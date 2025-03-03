#!/bin/bash

echo "Checking for FFmpeg..."
if ! command -v ffmpeg &> /dev/null; then
    echo "FFmpeg not found! Please install FFmpeg."
    echo "macOS: brew install ffmpeg"
    echo "Linux: sudo apt-get install ffmpeg"
    exit 1
fi

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Starting Flask server..."
python app.py 