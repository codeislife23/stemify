@echo off
echo Checking for FFmpeg...
where ffmpeg >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo FFmpeg not found! Please install FFmpeg and add it to your PATH.
    echo Download from: https://www.gyan.dev/ffmpeg/builds/
    pause
    exit /b 1
)

echo Installing dependencies...
pip install -r requirements.txt

echo Starting Flask server...
python app.py 