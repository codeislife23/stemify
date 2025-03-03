import React, { useState, useRef, useCallback } from 'react';
import { Upload, Music, File, AlertCircle, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { isValidAudioFormat, isValidFileSize, getAudioFormat, getAudioDetails } from '@/lib/audio-utils';
import { AudioFile } from '@/lib/types';

interface UploadZoneProps {
  onFileSelected: (file: AudioFile) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Use useCallback to memoize event handlers
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only set isDragging to false if we're leaving the drop zone
    // and not entering a child element
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  const processFile = async (file: File) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // Check if it's a valid audio format
      if (!isValidAudioFormat(file)) {
        toast.error('Unsupported file format. Please upload WAV, MP3, FLAC, or AAC files.');
        setIsProcessing(false);
        return;
      }

      // Check file size
      if (!isValidFileSize(file)) {
        toast.error('File too large. Maximum file size is 500MB.');
        setIsProcessing(false);
        return;
      }

      // Get format
      const format = getAudioFormat(file);
      if (!format) {
        toast.error('Could not determine audio format.');
        setIsProcessing(false);
        return;
      }

      // Get audio details
      try {
        const { duration, sampleRate } = await getAudioDetails(file);

        // Check sample rate - make this a warning instead of an error
        if (sampleRate !== 44100 && sampleRate !== 48000) {
          toast.warning('Non-standard sample rate detected. Processing may take longer or quality might be affected.');
        }

        // Create audio file object
        const audioFile: AudioFile = {
          file,
          name: file.name,
          size: file.size,
          format,
          duration,
          sampleRate
        };

        // Call the onFileSelected callback
        onFileSelected(audioFile);
      } catch (error) {
        console.error('Error getting audio details:', error);
        
        // Fallback to basic file info if audio details can't be read
        const audioFile: AudioFile = {
          file,
          name: file.name,
          size: file.size,
          format
        };
        
        toast.warning('Could not read detailed audio information. Processing will continue but may be less accurate.');
        onFileSelected(audioFile);
      }
    } catch (error) {
      console.error('Error processing audio file:', error);
      toast.error('Error processing audio file. Please try again.');
    }

    setIsProcessing(false);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from triggering the parent div's onClick
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  // Add global event listeners for drag and drop
  React.useEffect(() => {
    const handleWindowDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleWindowDrop = (e: DragEvent) => {
      e.preventDefault();
    };

    window.addEventListener('dragover', handleWindowDragOver);
    window.addEventListener('drop', handleWindowDrop);

    return () => {
      window.removeEventListener('dragover', handleWindowDragOver);
      window.removeEventListener('drop', handleWindowDrop);
    };
  }, []);

  return (
    <div
      ref={dropZoneRef}
      className={`w-full max-w-3xl mx-auto rounded-xl border-2 border-dashed p-10 transition-all duration-300 upload-zone-accessible ${
        isDragging 
          ? 'animate-pulse-border border-stemify-purple bg-stemify-purple/5 shadow-lg' 
          : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
      }`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label="Upload audio file"
      data-dragging={isDragging}
      style={{ cursor: 'pointer' }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        className="hidden"
        accept="audio/*,.wav,.mp3,.flac,.aac,.m4a"
        aria-hidden="true"
      />

      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
          isDragging ? 'bg-stemify-purple/20' : 'bg-gray-100 dark:bg-gray-800'
        } transition-colors duration-300`}>
          <Upload 
            className={`w-8 h-8 ${
              isDragging ? 'text-stemify-purple' : 'text-gray-400 dark:text-gray-300'
            } transition-colors duration-300`} 
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium text-stemify-black dark:text-white">
            {isProcessing ? 'Processing...' : 'Upload your audio file'}
          </h3>
          <p className="text-sm text-stemify-gray dark:text-gray-300 max-w-md mx-auto">
            {isDragging 
              ? 'Drop your file here to upload' 
              : 'Drag and drop your audio file here, or click to browse. We support WAV, MP3, FLAC, and AAC formats.'}
          </p>
        </div>

        <button
          onClick={handleButtonClick}
          disabled={isProcessing}
          className="btn-effect px-6 py-2.5 rounded-full flex items-center space-x-2 bg-stemify-purple text-white hover:bg-stemify-purple-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Processing</span>
            </>
          ) : (
            <>
              <Music className="w-5 h-5" />
              <span>Select Audio</span>
            </>
          )}
        </button>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-stemify-gray dark:text-gray-400 mt-4">
          <div className="flex items-center">
            <File className="w-4 h-4 mr-1" />
            <span>Max 500MB</span>
          </div>
          <div className="flex items-center">
            <Music className="w-4 h-4 mr-1" />
            <span>WAV, MP3, FLAC, AAC</span>
          </div>
          <div className="flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            <span>44.1kHz or 48kHz recommended</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadZone;
