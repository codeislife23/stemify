import os
import uuid
import json
import logging
import time
import shutil
import subprocess
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename

# Configure logging
logging.basicConfig(level=logging.INFO, 
                   format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
OUTPUT_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'outputs')
ALLOWED_EXTENSIONS = {'wav', 'mp3', 'flac', 'aac', 'm4a'}

# Create directories if they don't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def check_audio_separator():
    """Check if audio-separator is installed and available."""
    try:
        subprocess.run(['audio-separator', '--version'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        return True
    except (subprocess.SubprocessError, FileNotFoundError):
        logger.error("audio-separator is not installed or not in PATH")
        return False

@app.route('/api/health', methods=['GET'])
def health_check():
    audio_separator_available = check_audio_separator()
    return jsonify({
        'status': 'ok' if audio_separator_available else 'error',
        'audio_separator_available': audio_separator_available
    })

@app.route('/api/separate', methods=['POST'])
def separate_audio():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': f'File type not allowed. Supported formats: {", ".join(ALLOWED_EXTENSIONS)}'}), 400
    
    # Check if audio-separator is available
    if not check_audio_separator():
        return jsonify({'error': 'audio-separator is not installed or not in PATH. Please install audio-separator to use this service.'}), 500
    
    # Generate a unique ID for this separation job
    job_id = str(uuid.uuid4())
    job_folder = os.path.join(OUTPUT_FOLDER, job_id)
    os.makedirs(job_folder, exist_ok=True)
    
    # Save the uploaded file
    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, f"{job_id}_{filename}")
    file.save(file_path)
    
    logger.info(f"File saved: {file_path}")
    
    try:
        # Use audio-separator command to perform real stem separation
        logger.info(f"Starting separation for file: {file_path}")
        
        # Run the audio-separator command
        cmd = [
            'audio-separator',
            file_path,
            '--model_filename', 'htdemucs_ft.yaml',
            '--output_format', 'MP3',
            '--output_dir', job_folder
        ]
        
        logger.info(f"Running command: {' '.join(cmd)}")
        process = subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        
        logger.info(f"Separation completed. Output: {process.stdout}")
        if process.stderr:
            logger.warning(f"Stderr: {process.stderr}")
        
        # Define the stem types we expect
        stem_types = ['vocals', 'drums', 'bass', 'other']
        stems = []
        
        # Get the base filename without extension
        base_filename = os.path.splitext(filename)[0]
        
        # Look for the separated stems in the output directory
        for stem_type in stem_types:
            # The audio-separator typically outputs files with naming pattern like:
            # original_filename/htdemucs_ft/vocals.mp3
            stem_dir = os.path.join(job_folder, base_filename, 'htdemucs_ft')
            stem_path = os.path.join(stem_dir, f"{stem_type}.mp3")
            
            # Check if the file exists
            if os.path.exists(stem_path):
                # Get file size
                file_size = os.path.getsize(stem_path)
                
                # Get relative path for API access
                relative_path = os.path.relpath(stem_path, OUTPUT_FOLDER)
                
                # Create a more user-friendly filename
                display_filename = f"{base_filename}_{stem_type}.mp3"
                
                stems.append({
                    'id': f"{job_id}_{stem_type}",
                    'name': display_filename,
                    'type': stem_type,
                    'path': relative_path,
                    'size': file_size
                })
            else:
                logger.warning(f"Stem file not found: {stem_path}")
        
        # Save job metadata
        with open(os.path.join(job_folder, 'metadata.json'), 'w') as f:
            json.dump({
                'job_id': job_id,
                'original_file': filename,
                'stems': stems
            }, f)
        
        return jsonify({
            'job_id': job_id,
            'stems': stems
        })
    
    except subprocess.CalledProcessError as e:
        logger.error(f"Error during separation: {str(e)}", exc_info=True)
        logger.error(f"Command output: {e.stdout}")
        logger.error(f"Command error: {e.stderr}")
        return jsonify({'error': f"Error during separation: {str(e)}"}), 500
    
    except Exception as e:
        logger.error(f"Error during separation: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500
    
    finally:
        # Clean up the uploaded file
        if os.path.exists(file_path):
            os.remove(file_path)

@app.route('/api/stems/<path:stem_path>', methods=['GET'])
def get_stem(stem_path):
    file_path = os.path.join(OUTPUT_FOLDER, stem_path)
    if not os.path.exists(file_path):
        return jsonify({'error': 'File not found'}), 404
    
    return send_file(file_path, as_attachment=True)

@app.route('/api/jobs/<job_id>', methods=['GET'])
def get_job(job_id):
    job_folder = os.path.join(OUTPUT_FOLDER, job_id)
    metadata_file = os.path.join(job_folder, 'metadata.json')
    
    if not os.path.exists(metadata_file):
        return jsonify({'error': 'Job not found'}), 404
    
    with open(metadata_file, 'r') as f:
        metadata = json.load(f)
    
    return jsonify(metadata)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True) 