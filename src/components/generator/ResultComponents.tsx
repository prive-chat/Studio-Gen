import React from 'react';
import { motion } from 'motion/react';
import { Maximize2, Download, RefreshCw, Send, FileText } from 'lucide-react';
import { GenResult } from '../../types/generator';

interface ResultActionsProps {
  result: GenResult;
  onVariation: () => void;
  onDownload: () => void;
  onExpand: () => void;
}

export const ResultActions: React.FC<ResultActionsProps> = ({ 
  result, 
  onVariation, 
  onDownload, 
  onExpand 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-6 border-t border-white/5 bg-slate-900/80 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3 w-full sm:w-auto overflow-hidden order-2 sm:order-1">
        <div className="w-8 h-8 rounded-full bg-brand-indigo/20 flex items-center justify-center shrink-0">
          <Send className="w-3.5 h-3.5 text-brand-indigo-light" />
        </div>
        <p className="text-[10px] text-slate-400 truncate italic max-w-[200px] md:max-w-xs uppercase tracking-wider font-medium">
          "{result.prompt}"
        </p>
      </div>

      <div className="flex gap-2 w-full sm:w-auto order-1 sm:order-2">
        <button 
          onClick={onExpand}
          className="btn-secondary flex-1 sm:flex-none py-2 px-4 flex items-center justify-center gap-2 group"
          id="btn-expand"
        >
          <Maximize2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="hidden md:inline">Expand</span>
        </button>
        
        <button 
          onClick={onVariation}
          className="btn-secondary flex-1 sm:flex-none py-2 px-4 flex items-center justify-center gap-2 group"
          id="btn-variation"
        >
          <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
          <span className="hidden md:inline">Variation</span>
        </button>

        <button 
          onClick={onDownload}
          className="btn-primary flex-1 sm:flex-none py-2 px-4 flex items-center justify-center gap-2 group"
          id="btn-download"
        >
          <Download className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
          <span className="hidden md:inline">Save</span>
        </button>
      </div>
    </motion.div>
  );
};

export const ScriptAnnotation: React.FC<{ script: string }> = ({ script }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="absolute bottom-24 left-6 max-w-sm z-10"
  >
    <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl relative group overflow-hidden">
      <div className="absolute inset-0 bg-brand-indigo/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-start gap-4 relative">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-indigo/40 to-brand-indigo/10 flex items-center justify-center shrink-0 border border-brand-indigo/20">
          <FileText className="w-5 h-5 text-brand-indigo-light" />
        </div>
        <div className="space-y-1.5">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-indigo-light/80 flex items-center gap-2">
            Narrative Script
            <span className="w-1 h-1 rounded-full bg-brand-indigo-light animate-pulse" />
          </span>
          <p className="text-xs text-slate-200 leading-relaxed font-medium line-clamp-4">
            {script}
          </p>
        </div>
      </div>
    </div>
  </motion.div>
);
