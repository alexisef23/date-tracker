import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, CalendarHeart } from 'lucide-react';
import { useDateTracker } from '../context/DateContext';
import AddIdeaModal from './AddIdeaModal';
import PhotoUploadModal from './PhotoUploadModal';

export default function IdeaList() {
  const { ideas } = useDateTracker();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);

  const handleCompleteClick = (idea) => {
    setSelectedIdea(idea);
  };

  return (
    <div className="pb-32">
      {ideas.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-classic-blue-300">
          <CalendarHeart className="w-16 h-16 mb-4 opacity-50" strokeWidth={1} />
          <p className="font-serif italic text-lg text-classic-blue-700/60">Aún no hay ideas de salidas.</p>
          <p className="text-sm text-classic-blue-500/50 mt-1">¡Añade una para empezar!</p>
          
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="mt-6 px-6 py-3 bg-classic-blue-600 text-white rounded-full font-medium shadow-lg hover:bg-classic-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Añadir Primera Idea
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {ideas.map((idea) => (
              <motion.div
                key={idea.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-classic-beige-200/50 relative overflow-hidden group"
              >
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-classic-blue-50 rounded-bl-full opacity-50 -z-0" />
                
                <div className="flex justify-between items-start relative z-10">
                  <div className="pr-4">
                    <h3 className="font-serif font-medium text-lg text-classic-blue-900 mb-1 leading-tight">{idea.title}</h3>
                    {idea.description && (
                      <p className="text-sm text-classic-blue-600/70 line-clamp-2">{idea.description}</p>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleCompleteClick(idea)}
                    className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-classic-blue-200 flex items-center justify-center text-transparent hover:bg-classic-blue-500 hover:border-classic-blue-500 hover:text-white transition-all group-hover:border-classic-blue-400 group-hover:text-classic-blue-200 shadow-sm"
                    aria-label="Marcar como completada"
                  >
                    <Check className="w-5 h-5" strokeWidth={3} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-classic-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-classic-blue-600/30 hover:bg-classic-blue-700 transition-colors z-20"
      >
        <Plus className="w-6 h-6" strokeWidth={2.5} />
      </motion.button>

      {/* Modals */}
      <AddIdeaModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
      
      <PhotoUploadModal
        idea={selectedIdea}
        isOpen={!!selectedIdea}
        onClose={() => setSelectedIdea(null)}
      />
    </div>
  );
}
