import { Loader } from "lucide-react";
import { AudioFile, Stem } from "./types";
import { separateAudioFile, getStemUrl } from "./api-service";

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const formatDuration = (seconds: number): string => {
  if (isNaN(seconds) || seconds === 0) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const isValidAudioFormat = (file: File): boolean => {
  const validTypes = ['audio/wav', 'audio/mpeg', 'audio/flac', 'audio/aac', 'audio/mp4', 'audio/x-m4a'];
  return validTypes.includes(file.type);
};

export const isValidFileSize = (file: File): boolean => {
  const maxSize = 500 * 1024 * 1024; // 500MB
  return file.size <= maxSize;
};

export const getAudioFormat = (file: File): "wav" | "mp3" | "flac" | "aac" | null => {
  if (file.type === 'audio/wav') return 'wav';
  if (file.type === 'audio/mpeg') return 'mp3';
  if (file.type === 'audio/flac') return 'flac';
  if (file.type === 'audio/aac' || file.type === 'audio/mp4' || file.type === 'audio/x-m4a') return 'aac';
  return null;
};

export const getAudioDetails = async (file: File): Promise<{ duration: number; sampleRate: number }> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target?.result) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        audioContext.decodeAudioData(e.target.result as ArrayBuffer, (buffer) => {
          resolve({
            duration: buffer.duration,
            sampleRate: buffer.sampleRate
          });
        }, (err) => {
          console.error('Error decoding audio data', err);
          // Provide fallback values for demo
          resolve({
            duration: 30,
            sampleRate: 44100
          });
        });
      }
    };
    
    reader.onerror = (err) => {
      console.error('Error reading file', err);
      reject(err);
    };
    
    reader.readAsArrayBuffer(file);
  });
};

export const separateStems = async (
  file: AudioFile,
  progressCallback: (stage: string, progress: number) => void
): Promise<Stem[]> => {
  try {
    // Start with uploading stage
    progressCallback("Uploading", 0);
    
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      progressCallback("Uploading", progress);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Processing stage
    progressCallback("Processing", 0);
    
    // Call the backend API to separate the stems
    const response = await separateAudioFile(file.file);
    
    // Create stem objects from the API response
    const stems: Stem[] = response.stems.map(stem => {
      // Map the stem type to our application's stem type
      let stemType: "vocals" | "drums" | "bass" | "other" = "other";
      if (stem.type === "vocals") stemType = "vocals";
      else if (stem.type === "drums") stemType = "drums";
      else if (stem.type === "bass") stemType = "bass";
      
      return {
        id: stem.id,
        name: stem.name,
        type: stemType,
        url: getStemUrl(stem.path),
        format: 'wav',
        size: stem.size,
        duration: file.duration || 30,
        sampleRate: 44100,
        channels: 2
      };
    });
    
    // Finalize
    progressCallback("Finalizing", 100);
    
    return stems;
  } catch (error) {
    console.error('Error separating stems:', error);
    throw error;
  }
};

export const downloadStem = (stem: Stem): void => {
  // For stems from our API, the URL is already a download link
  window.open(stem.url, '_blank');
};

export const downloadAllStems = (stems: Stem[]): void => {
  // Download each stem with a slight delay to avoid browser blocking
  stems.forEach((stem, index) => {
    setTimeout(() => {
      downloadStem(stem);
    }, index * 1000);
  });
};

export { Loader };
