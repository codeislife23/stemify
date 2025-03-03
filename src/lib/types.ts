
export type AudioFormat = 'wav' | 'mp3' | 'flac' | 'aac';

export type StemType = 'vocals' | 'drums' | 'bass' | 'other';

export interface AudioFile {
  file: File;
  name: string;
  size: number;
  format: AudioFormat;
  duration?: number;
  sampleRate?: number;
}

export interface ProcessingStage {
  id: string;
  name: string;
  progress: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface Stem {
  id: string;
  type: StemType;
  name: string;
  url: string;
  duration: number;
  size: number;
  format: AudioFormat;
  sampleRate: number;
  channels: number;
}

export type ProcessingStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
