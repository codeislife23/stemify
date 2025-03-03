import React, { useState, useEffect } from 'react';
import { Download, Music } from 'lucide-react';
import UploadZone from '@/components/UploadZone';
import ProcessingStatus from '@/components/ProcessingStatus';
import StemPreview from '@/components/StemPreview';
import { AudioFile, ProcessingStage, Stem, ProcessingStatus as ProcessStatus } from '@/lib/types';
import { separateStems, downloadAllStems } from '@/lib/audio-utils';
import { toast } from 'sonner';
import ThemeToggle from '@/components/ThemeToggle';
import AuthButtons from '@/components/AuthButtons';
import BackendStatus from '@/components/BackendStatus';

const Index = () => {
  const [audioFile, setAudioFile] = useState<AudioFile | null>(null);
  const [status, setStatus] = useState<ProcessStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number | undefined>(undefined);
  const [stages, setStages] = useState<ProcessingStage[]>([]);
  const [stems, setStems] = useState<Stem[]>([]);

  // Initialize stages
  useEffect(() => {
    setStages([
      { id: 'upload', name: 'Uploading', progress: 0, status: 'pending' },
      { id: 'analyze', name: 'Analyzing', progress: 0, status: 'pending' },
      { id: 'vocals', name: 'Separating vocals', progress: 0, status: 'pending' },
      { id: 'drums', name: 'Separating drums', progress: 0, status: 'pending' },
      { id: 'bass', name: 'Separating bass', progress: 0, status: 'pending' },
      { id: 'other', name: 'Separating other instruments', progress: 0, status: 'pending' },
      { id: 'finalize', name: 'Finalizing', progress: 0, status: 'pending' }
    ]);
  }, []);

  const handleFileSelected = async (file: AudioFile) => {
    setAudioFile(file);
    setStatus('uploading');
    setProgress(0);
    setCurrentStage('Uploading');
    setEstimatedTimeRemaining(file.duration ? file.duration * 2 : undefined);
    setStems([]);
    
    // Reset stages
    setStages(prevStages => prevStages.map(stage => ({
      ...stage,
      progress: 0,
      status: 'pending'
    })));
    
    try {
      toast.success(`Processing ${file.name}`);
      
      // Start stem separation
      const separatedStems = await separateStems(file, handleProgressUpdate);
      
      setStems(separatedStems);
      setStatus('completed');
      toast.success('Stem separation completed!');
    } catch (error) {
      console.error('Error separating stems:', error);
      setStatus('error');
      toast.error('An error occurred during stem separation.');
    }
  };

  const handleProgressUpdate = (stage: string, stageProgress: number) => {
    // Find current stage index
    const currentStageIndex = stages.findIndex(s => s.name === stage);
    if (currentStageIndex === -1) return;
    
    // Update current stage
    setCurrentStage(stage);
    
    // Update stage status
    setStages(prevStages => {
      const newStages = [...prevStages];
      
      // Mark previous stages as completed
      for (let i = 0; i < currentStageIndex; i++) {
        newStages[i] = {
          ...newStages[i],
          progress: 100,
          status: 'completed'
        };
      }
      
      // Update current stage
      newStages[currentStageIndex] = {
        ...newStages[currentStageIndex],
        progress: stageProgress,
        status: 'processing'
      };
      
      return newStages;
    });
    
    // Calculate overall progress
    const totalStages = stages.length;
    const completedStages = currentStageIndex;
    const overallProgress = ((completedStages / totalStages) * 100) + (stageProgress / totalStages);
    
    setProgress(overallProgress);
    
    // Update estimated time
    if (audioFile?.duration) {
      const estimatedTotal = audioFile.duration * 2; // Just a rough estimate
      const remainingPercentage = (100 - overallProgress) / 100;
      setEstimatedTimeRemaining(estimatedTotal * remainingPercentage);
    }
  };

  const handleDownloadAll = () => {
    if (stems.length === 0) return;
    
    toast.success('Downloading all stems');
    downloadAllStems(stems);
  };

  const renderContent = () => {
    if (status === 'idle') {
      return (
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block mb-3 px-3 py-1 bg-stemify-purple/10 text-stemify-purple rounded-full text-sm font-medium">
              Audio Stem Separation
            </div>
            <h1 className="text-4xl font-bold text-stemify-black dark:text-white mb-4">
              Separate your music into individual stems
            </h1>
            <p className="text-lg text-stemify-gray dark:text-gray-300 max-w-2xl mx-auto">
              Upload your song and we'll separate it into vocals, drums, bass, and other instruments.
              Perfect for remixing, karaoke, or music production.
            </p>
          </div>
          
          <UploadZone onFileSelected={handleFileSelected} />
        </div>
      );
    }
    
    if (status === 'uploading' || status === 'processing') {
      return (
        <div className="w-full max-w-4xl mx-auto">
          {audioFile && (
            <div className="mb-8 text-center animate-fade-in">
              <h2 className="text-2xl font-bold text-stemify-black dark:text-white mb-2">
                Processing {audioFile.name}
              </h2>
              <p className="text-stemify-gray dark:text-gray-300">
                Please wait while we separate your song into individual stems.
              </p>
            </div>
          )}
          
          <ProcessingStatus
            status={status}
            stages={stages}
            currentStage={currentStage}
            progress={progress}
            estimatedTimeRemaining={estimatedTimeRemaining}
          />
        </div>
      );
    }
    
    if (status === 'completed') {
      return (
        <div className="w-full max-w-4xl mx-auto">
          <div className="mb-8 text-center animate-fade-in">
            <h2 className="text-2xl font-bold text-stemify-black dark:text-white mb-2">
              Separation Complete!
            </h2>
            <p className="text-stemify-gray dark:text-gray-300 mb-4">
              Your song has been separated into the following stems. Preview and download them below.
            </p>
            
            <button
              onClick={handleDownloadAll}
              className="btn-effect px-6 py-2.5 rounded-full flex items-center space-x-2 bg-stemify-purple text-white hover:bg-stemify-purple-dark transition-colors mx-auto"
            >
              <Download className="w-5 h-5" />
              <span>Download All Stems</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stems.map((stem) => (
              <StemPreview key={stem.type} stem={stem} />
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setAudioFile(null);
                setStatus('idle');
                setProgress(0);
                setStems([]);
              }}
              className="text-stemify-purple hover:text-stemify-purple-dark hover:underline transition-colors"
            >
              Process another file
            </button>
          </div>
        </div>
      );
    }
    
    if (status === 'error') {
      return (
        <div className="w-full max-w-4xl mx-auto text-center">
          <div className="mb-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-red-500 mb-2">
              Processing Error
            </h2>
            <p className="text-stemify-gray dark:text-gray-300 mb-4">
              We encountered an error while processing your file. Please try again.
            </p>
            
            <button
              onClick={() => {
                setAudioFile(null);
                setStatus('idle');
                setProgress(0);
              }}
              className="btn-effect px-6 py-2.5 rounded-full flex items-center space-x-2 bg-stemify-purple text-white hover:bg-stemify-purple-dark transition-colors mx-auto"
            >
              <span>Try Again</span>
            </button>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 text-black dark:text-white">
      <header className="py-6 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-stemify-purple/10 flex items-center justify-center">
              <Music className="h-5 w-5 text-stemify-purple" />
            </div>
            <span className="ml-2 text-xl font-semibold text-stemify-black dark:text-white">stemify</span>
          </div>
          <div className="flex items-center gap-4">
            <BackendStatus />
            <AuthButtons />
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-12">
        {renderContent()}
      </main>
      
      <footer className="py-8 px-4 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto text-center text-sm text-stemify-gray dark:text-gray-400">
          <p>Maximum file size: 500MB · Supported formats: WAV, MP3, FLAC, AAC · 44.1kHz and 48kHz only</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
