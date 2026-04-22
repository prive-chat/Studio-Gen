import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useStore();

  return (
    <div className="fixed bottom-24 right-6 z-[300] flex flex-col gap-3 pointer-events-none w-full max-w-xs sm:max-w-sm">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl ${
              n.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-100' :
              n.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-100' :
              'bg-brand-indigo/10 border-brand-indigo/20 text-indigo-100'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {n.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
              {n.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
              {n.type === 'info' && <Info className="w-5 h-5 text-indigo-400" />}
            </div>
            <p className="text-xs md:text-sm font-medium leading-relaxed flex-1">
              {n.message}
            </p>
            <button 
              onClick={() => removeNotification(n.id)}
              className="shrink-0 p-1 hover:bg-white/5 rounded-md transition-colors"
            >
              <X className="w-4 h-4 opacity-50 hover:opacity-100" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
