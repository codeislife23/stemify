import { AudioFile, Stem } from './types';

const API_BASE_URL = 'http://localhost:5000/api';

export interface SeparationResponse {
  job_id: string;
  stems: {
    id: string;
    name: string;
    type: string;
    path: string;
    size: number;
  }[];
}

export const separateAudioFile = async (file: File): Promise<SeparationResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}/separate`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to separate audio');
  }
  
  return await response.json();
};

export const getStemUrl = (stemPath: string): string => {
  return `${API_BASE_URL}/stems/${stemPath}`;
};

export const getJobStatus = async (jobId: string): Promise<SeparationResponse> => {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to get job status');
  }
  
  return await response.json();
};

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
}; 