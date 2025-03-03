# Stemify Quick Start Guide

This guide will help you get started with Stemify quickly.

## What is Stemify?

Stemify is a web application that allows you to upload audio files and separate them into individual stems (vocals, drums, bass, and other instruments). It provides a simple, intuitive interface for audio stem separation.

## Quick Installation

### Prerequisites

- Node.js 16+ (for frontend)
- Python 3.10+ (for backend)
- FFmpeg (for audio processing)

### Option 1: Running Locally (Recommended for Development)

#### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd stemify-web-main
```

#### Step 2: Start the Backend

```bash
# Navigate to the backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start the Flask server
python app.py
```

The backend will be available at http://localhost:5000.

#### Step 3: Start the Frontend

Open a new terminal window:

```bash
# Navigate to the project root
cd stemify-web-main

# Install Node.js dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at http://localhost:8081 (or another port if 8081 is in use).

### Option 2: Using Docker (Recommended for Production)

If you have Docker and Docker Compose installed:

```bash
# Build and start all services
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Using Stemify

1. **Upload an Audio File**:
   - Click the "Upload" button or drag and drop an audio file
   - Supported formats: WAV, MP3, FLAC, AAC, M4A

2. **Start Separation**:
   - Click the "Separate" button to start the stem separation process
   - The process may take a few minutes depending on the file size

3. **Download Stems**:
   - Once processing is complete, you'll see a list of separated stems
   - Click on each stem to preview or download it

## Troubleshooting

### Backend Not Connecting

If you see a "Backend not connected" message:

1. Ensure the backend server is running
2. Check that you're using the correct URL (http://localhost:5000 by default)
3. Verify there are no firewall or network issues blocking the connection

### Audio Processing Issues

If you encounter issues with audio processing:

1. Ensure FFmpeg is installed and accessible
2. Check that the audio file format is supported
3. Try with a smaller or different audio file

### Frontend Not Starting

If the frontend doesn't start:

1. Ensure Node.js is installed (version 16+)
2. Check that all dependencies are installed (`npm install`)
3. Try running with a different port if 8081 is in use

## Next Steps

- Check the full documentation in the README.md file
- Explore Docker deployment options in DOCKER.md
- Review the backend API documentation in backend/README.md

## Getting Help

If you encounter any issues not covered in this guide:

1. Check the troubleshooting sections in the documentation
2. Look for error messages in the console logs
3. Refer to the project repository for updates and issues 