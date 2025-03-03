# Stemify Backend Service

This is the backend service for the Stemify web application, providing API endpoints for audio stem separation using FFmpeg.

## Overview

The backend service is built with Flask and provides a RESTful API for:
- Uploading audio files
- Processing audio files to create simulated stems using FFmpeg
- Retrieving separated stems
- Checking job status

## Setup

### Prerequisites

- Python 3.10+
- FFmpeg (for audio processing)
  - Windows: Download from [here](https://www.gyan.dev/ffmpeg/builds/) and add to PATH
  - macOS: `brew install ffmpeg`
  - Linux: `sudo apt-get install ffmpeg`

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the Flask application:
   ```bash
   python app.py
   ```

The server will start on http://localhost:5000 by default.

### Troubleshooting

If you encounter issues:

1. Make sure you're in the correct directory:
   ```bash
   # Windows PowerShell
   cd C:\Users\cybersah\Documents\GitHub\stemify-web-main\backend
   
   # Windows Command Prompt
   cd C:\Users\cybersah\Documents\GitHub\stemify-web-main\backend
   
   # Linux/macOS
   cd /path/to/stemify-web-main/backend
   ```

2. Check if FFmpeg is installed and in your PATH:
   ```bash
   ffmpeg -version
   ```

3. If you get errors about missing packages, try:
   ```bash
   pip install -r requirements.txt --upgrade
   ```

4. If you're using Windows and having issues with the run.bat file, try running the commands directly:
   ```powershell
   pip install -r requirements.txt
   python app.py
   ```

## API Endpoints

### Health Check

```
GET /api/health
```

Returns a status message to verify the API is running.

**Response:**
```json
{
  "status": "ok",
  "ffmpeg_available": true
}
```

### Separate Audio

```
POST /api/separate
```

Upload an audio file for separation into stems.

**Request:**
- Content-Type: multipart/form-data
- Body: 
  - file: The audio file to separate (supported formats: WAV, MP3, FLAC, AAC, M4A)

**Response:**
```json
{
  "job_id": "uuid-string",
  "stems": [
    {
      "id": "job_id_vocals",
      "name": "filename_vocals.wav",
      "type": "vocals",
      "path": "relative/path/to/stem",
      "size": 12345
    },
    {
      "id": "job_id_drums",
      "name": "filename_drums.wav",
      "type": "drums",
      "path": "relative/path/to/stem",
      "size": 12345
    },
    ...
  ]
}
```

### Get Stem

```
GET /api/stems/<stem_path>
```

Download a separated stem file.

**Parameters:**
- stem_path: The relative path to the stem file (returned from the separation API)

**Response:**
- The audio file as an attachment

### Get Job Status

```
GET /api/jobs/<job_id>
```

Get information about a separation job.

**Parameters:**
- job_id: The UUID of the job (returned from the separation API)

**Response:**
```json
{
  "job_id": "uuid-string",
  "original_file": "filename.ext",
  "stems": [
    {
      "id": "job_id_vocals",
      "name": "filename_vocals.wav",
      "type": "vocals",
      "path": "relative/path/to/stem",
      "size": 12345
    },
    ...
  ]
}
```

## Implementation Details

This backend uses FFmpeg to create simulated stems by applying different equalizer settings to the original audio file. This is a simplified approach that doesn't perform true source separation but provides a demonstration of how the API works.

For true audio source separation, you would need to integrate a specialized library like Spleeter, Demucs, or a similar tool.

## Running with Docker

If you prefer to use Docker, you can build and run the backend service using:

```bash
docker build -t stemify-backend .
docker run -p 5000:5000 stemify-backend
```

Or use Docker Compose to run both frontend and backend:

```bash
cd ..  # Go back to the root directory
docker-compose up
```

## Directory Structure

- `app.py`: Main Flask application
- `requirements.txt`: Python dependencies
- `uploads/`: Temporary storage for uploaded files
- `outputs/`: Storage for separated stems

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- 400: Bad Request (invalid file, missing parameters)
- 404: Not Found (stem or job not found)
- 500: Internal Server Error (processing error)

## Development

### Adding New Features

To add new features to the backend:

1. Modify `app.py` to add new routes or functionality
2. Update the requirements if new dependencies are needed
3. Test the API endpoints using tools like Postman or curl

### Logging

The application uses Python's logging module to log information and errors:

```python
logger.info("Informational message")
logger.error("Error message", exc_info=True)
```

Logs are output to the console by default.

## Troubleshooting

### Common Issues

1. **File upload errors**:
   - Check that the file format is supported
   - Ensure the uploads directory is writable

2. **Processing errors**:
   - Verify FFmpeg is installed and accessible
   - Check the audio file is not corrupted

3. **API connection issues**:
   - Ensure CORS is properly configured
   - Check that the server is running on the expected port

## License

This project is licensed under the MIT License. 