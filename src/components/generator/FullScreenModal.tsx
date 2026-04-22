import React from 'react';
import { motion } from 'motion/react';
import { Maximize2, Download, X, Play } from 'lucide-react';
import { GenResult } from '../../types/generator';

interface FullScreenModalProps {
  result: GenResult;
  onClose: () => void;
  onDownload: () => void;
}

export const FullScreenModal: React.FC<FullScreenModalProps> = ({ result, onClose, onDownload }) => {
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-3xl flex items-center justify-center overflow-hidden"
      onClick={onClose}
    >
      <div className="absolute top-6 right-6 flex gap-4 z-[210]" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onDownload}
          className="w-10 h-10 md:w-12 md:h-12 bg-white/5 hover:bg-white/20 border border-white/10 rounded-full flex items-center justify-center transition-all group"
          title="Download"
        >
          <Download className="w-4 h-4 md:w-5 md:h-5 text-white/60 group-hover:text-white" />
        </button>
        <button 
          onClick={onClose}
          className="w-10 h-10 md:w-12 md:h-12 bg-white/5 hover:bg-white/20 border border-white/10 rounded-full flex items-center justify-center transition-all group"
          title="Close"
        >
          <X className="w-5 h-5 md:w-6 md:h-6 text-white/60 group-hover:text-white" />
        </button>
      </div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full h-full flex items-center justify-center p-2 md:p-8"
      >
        {result.type === "image" ? (
          <img 
            src={result.url} 
            className="max-w-full max-h-full object-contain shadow-[0_0_100px_rgba(0,0,0,0.5)] select-none" 
            alt="Full Screen Result" 
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div 
            className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center bg-black/40 rounded-3xl overflow-hidden shadow-2xl border border-white/5"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={result.url} className="w-full h-full object-cover opacity-20 blur-2xl scale-110" alt="Video Background" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-20 h-20 md:w-28 md:h-28 bg-brand-indigo/10 backdrop-blur-2xl rounded-full flex items-center justify-center border border-brand-indigo/30 mb-8 shadow-2xl">
                <Play className="w-8 h-8 md:w-12 md:h-12 text-brand-indigo-light fill-brand-indigo-light" />
              </div>
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.6em] text-white/40">Cinematic Masterpiece</span>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
