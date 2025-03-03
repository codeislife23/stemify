# Stemify Web Application

A web application for simulating audio track separation into individual stems (vocals, drums, bass, and other instruments) using FFmpeg.

## Quick Start Guide

### Prerequisites

- Node.js 18+ for the frontend
- Python 3.10+ for the backend
- FFmpeg (required for audio processing)
  - Windows: Download from [here](https://www.gyan.dev/ffmpeg/builds/) and add to PATH
  - macOS: `brew install ffmpeg`
  - Linux: `sudo apt-get install ffmpeg`

### Running the Application

#### Step 1: Start the Backend Server

Navigate to the backend directory and run the server:

```bash
# Windows PowerShell
cd backend
python app.py

# Linux/macOS
cd backend
python app.py
```

The backend server should start on http://localhost:5000.

#### Step 2: Start the Frontend Development Server

In a new terminal window:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend should be available at http://localhost:8081 (or another port if 8081 is in use).

### Troubleshooting

If you encounter issues with the audio separation:

1. **Backend not running**: Make sure the backend server is running at http://localhost:5000
   - Check if you can access http://localhost:5000/api/health in your browser
   - If not, make sure you're in the correct directory when starting the backend

2. **FFmpeg not installed**: The backend requires FFmpeg for audio processing
   - Run `ffmpeg -version` to check if it's installed
   - If not, install it following the instructions above

3. **Python dependencies**: Make sure all required Python packages are installed
   - Run `pip install -r backend/requirements.txt --upgrade`

4. **File upload issues**: If the upload component isn't working
   - Try a smaller audio file (under 10MB)
   - Make sure you're using a supported format (WAV, MP3, FLAC, AAC)

5. **Backend errors**: Check the backend console for error messages
   - Look for Python exceptions or error logs

## Implementation Note

This application uses FFmpeg to create simulated stems by applying different equalizer settings to the original audio file. This is a simplified approach that doesn't perform true source separation but provides a demonstration of how the application works.

For true audio source separation, you would need to integrate a specialized library like Spleeter, Demucs, or a similar tool.

## Features

- Upload audio files (WAV, MP3, FLAC, AAC)
- Create simulated stems (vocals, drums, bass, other) using FFmpeg
- Preview and download individual stems
- Modern, responsive UI with dark mode support

## Technologies

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Flask, FFmpeg
- Containerization: Docker, Docker Compose

## Documentation

- [Frontend Documentation](./src/README.md)
- [Backend Documentation](./backend/README.md)

## License

MIT

## Acknowledgments

- [shadcn-ui](https://ui.shadcn.com/) for the UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Flask](https://flask.palletsprojects.com/) for the backend framework

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/8241ba4c-c67f-4b6c-a66c-2d91a53ba6ce) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Python
- Flask
- FFmpeg

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/8241ba4c-c67f-4b6c-a66c-2d91a53ba6ce) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
