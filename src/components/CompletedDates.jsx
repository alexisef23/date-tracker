import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, BookImage } from 'lucide-react';
import { useDateTracker } from '../context/DateContext';

export default function CompletedDates() {
  const { memories } = useDateTracker();

  const formatDate = (isoString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(isoString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="pb-24">
      {memories.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-classic-blue-300">
          <BookImage className="w-16 h-16 mb-4 opacity-50" strokeWidth={1} />
          <p className="font-serif italic text-lg text-classic-blue-700/60">No hay recuerdos todavía.</p>
          <p className="text-sm text-classic-blue-500/50 mt-1">Completa una salida para verla aquí.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {memories.map((memory) => (
              <motion.div
                key={memory.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2rem] shadow-sm border border-classic-beige-200/50 overflow-hidden relative group"
              >
                {/* Photo Area */}
                <div className="relative h-64 w-full bg-classic-beige-200">
                  {memory.photoUrl ? (
                    <img 
                      src={memory.photoUrl} 
                      alt={memory.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-classic-blue-300">
                      <BookImage className="w-12 h-12 opacity-50" />
                    </div>
                  )}
                  

                  
                  {/* Gradient Overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute bottom-0 left-0 p-5 text-white w-full">
                    <h3 className="font-serif text-2xl font-medium leading-tight mb-1 drop-shadow-md">{memory.title}</h3>
                    <div className="flex items-center gap-1.5 text-white/80 text-sm drop-shadow-sm">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(memory.completedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-5">
                  {memory.description && (
                    <p className="text-classic-blue-700/80 text-sm mb-5 font-serif italic leading-relaxed">
                      "{memory.description}"
                    </p>
                  )}
                  

                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

    </div>
  );
}
