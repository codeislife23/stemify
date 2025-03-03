# Testing the Stemify Application

This guide will help you test the audio separation functionality in the Stemify application.

## Current Status

The application is now running with:
- Backend server: http://localhost:5000
- Frontend application: http://localhost:8082

## Testing Steps

1. **Verify Backend Health**
   - Open your browser and navigate to http://localhost:5000/api/health
   - You should see a JSON response like: `{"status":"ok","ffmpeg_available":true}`
   - If `ffmpeg_available` is `false`, you need to install FFmpeg

2. **Upload an Audio File**
   - Go to the frontend application at http://localhost:8082
   - Click on the upload zone or drag and drop an audio file
   - Supported formats: WAV, MP3, FLAC, AAC
   - Keep the file size reasonable (under 10MB for testing)

3. **Monitor the Separation Process**
   - After uploading, the application will show a processing status
   - The backend will create simulated stems using FFmpeg
   - This process should take a few seconds depending on the file size

4. **Preview and Download Stems**
   - Once processing is complete, you'll see the separated stems
   - You can play each stem to hear the result
   - You can download individual stems or all stems as a zip file

## Troubleshooting

If you encounter issues:

1. **Check Backend Console**
   - Look at the terminal where the backend is running
   - Check for any error messages or exceptions

2. **Check Browser Console**
   - Open your browser's developer tools (F12 or right-click > Inspect)
   - Go to the Console tab
   - Look for any JavaScript errors or failed network requests

3. **Verify FFmpeg**
   - Make sure FFmpeg is installed and in your PATH
   - Run `ffmpeg -version` in a terminal to verify

4. **Try a Different Audio File**
   - Some audio files might cause issues
   - Try a simple, short MP3 file for testing

## Understanding the Results

The current implementation uses FFmpeg to create simulated stems by applying different equalizer settings to the original audio file:

- **Vocals**: Enhanced mid frequencies (around 1kHz)
- **Drums**: Enhanced high frequencies (around 8kHz)
- **Bass**: Enhanced low frequencies (around 80Hz)
- **Other**: Enhanced mid-range frequencies (around 2kHz)

This is not true audio source separation but a simulation to demonstrate the application's workflow. The stems will sound similar to the original but with different frequency characteristics.

## Next Steps

For true audio source separation, you would need to integrate a specialized library like:
- [Spleeter](https://github.com/deezer/spleeter)
- [Demucs](https://github.com/facebookresearch/demucs)
- [Open-Unmix](https://github.com/sigsep/open-unmix-pytorch)

These libraries use machine learning models to perform actual source separation. 