
import React from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { ProcessingStage, ProcessingStatus } from '@/lib/types';

interface ProcessingStatusProps {
  status: ProcessingStatus;
  stages: ProcessingStage[];
  currentStage: string;
  progress: number;
  estimatedTimeRemaining?: number;
}

const ProcessingStatusComponent: React.FC<ProcessingStatusProps> = ({
  status,
  stages,
  currentStage,
  progress,
  estimatedTimeRemaining
}) => {
  const getStatusIcon = (stageStatus: 'pending' | 'processing' | 'completed' | 'failed') => {
    switch (stageStatus) {
      case 'pending':
        return null;
      case 'processing':
        return <Loader className="w-4 h-4 text-stemify-purple animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const formatEstimatedTime = (seconds?: number) => {
    if (!seconds) return 'Calculating...';
    if (seconds < 60) return `${Math.ceil(seconds)} seconds remaining`;
    return `${Math.ceil(seconds / 60)} minutes remaining`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="mb-2 flex justify-between items-center">
        <h3 className="text-lg font-medium text-stemify-black">Processing</h3>
        {estimatedTimeRemaining !== undefined && (
          <p className="text-sm text-stemify-gray">{formatEstimatedTime(estimatedTimeRemaining)}</p>
        )}
      </div>

      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-stemify-purple transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-3">
        {stages.map((stage) => (
          <div key={stage.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 flex items-center justify-center">
                {getStatusIcon(stage.status)}
              </div>
              <span className={`text-sm ${stage.status === 'processing' ? 'text-stemify-black font-medium' : 'text-stemify-gray'}`}>
                {stage.name}
              </span>
            </div>
            {stage.status === 'processing' && (
              <span className="text-xs text-stemify-gray">{Math.round(stage.progress)}%</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessingStatusComponent;
