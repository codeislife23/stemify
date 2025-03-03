
import React from 'react';
import { Download, Headphones } from 'lucide-react';
import { Stem } from '@/lib/types';
import { formatFileSize, downloadStem } from '@/lib/audio-utils';
import AudioPlayer from './AudioPlayer';

interface StemPreviewProps {
  stem: Stem;
}

const StemPreview: React.FC<StemPreviewProps> = ({ stem }) => {
  const getIconColor = () => {
    switch (stem.type) {
      case 'vocals': return 'text-pink-500';
      case 'drums': return 'text-amber-500';
      case 'bass': return 'text-emerald-500';
      case 'other': return 'text-violet-500';
      default: return 'text-gray-500';
    }
  };
  
  const getIconBg = () => {
    switch (stem.type) {
      case 'vocals': return 'bg-pink-50';
      case 'drums': return 'bg-amber-50';
      case 'bass': return 'bg-emerald-50';
      case 'other': return 'bg-violet-50';
      default: return 'bg-gray-50';
    }
  };

  const capitalizeStem = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const handleDownload = () => {
    downloadStem(stem);
  };

  return (
    <div className="stem-container bg-white shadow-sm animate-fade-in group">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getIconBg()}`}>
              <Headphones className={`w-5 h-5 ${getIconColor()}`} />
            </div>
            <div>
              <h3 className="font-medium text-stemify-black">{capitalizeStem(stem.type)}</h3>
              <p className="text-xs text-stemify-gray">
                {formatFileSize(stem.size)} · {stem.sampleRate / 1000}kHz · {stem.format.toUpperCase()}
              </p>
            </div>
          </div>
          <button 
            onClick={handleDownload}
            className="p-2 rounded-full hover:bg-gray-100 text-stemify-gray hover:text-stemify-purple transition-colors"
            aria-label={`Download ${stem.type} stem`}
          >
            <Download size={20} />
          </button>
        </div>
        
        <AudioPlayer url={stem.url} title={stem.name} />
      </div>
    </div>
  );
};

export default StemPreview;
