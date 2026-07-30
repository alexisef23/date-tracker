import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useDateTracker } from '../context/DateContext';

export default function AddIdeaModal({ isOpen, onClose }) {
  const { addIdea } = useDateTracker();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    addIdea({ title, description });
    setTitle('');
    setDescription('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-classic-blue-900/40 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-classic-beige-50 w-full max-w-sm rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-4 border-b border-classic-beige-200 flex justify-between items-center bg-white/50">
            <h3 className="font-serif text-lg text-classic-blue-900 font-medium">Nueva Idea de Salida</h3>
            <button onClick={onClose} className="text-classic-blue-400 hover:text-classic-blue-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-classic-blue-800 mb-1">Título de la salida</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Tarde de picnic..."
                className="w-full px-4 py-2 bg-white border border-classic-beige-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-classic-blue-300 focus:border-classic-blue-400 transition-shadow text-classic-blue-900"
                autoFocus
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-classic-blue-800 mb-1">Detalles (opcional)</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Llevar mantel, sándwiches..."
                rows={3}
                className="w-full px-4 py-2 bg-white border border-classic-beige-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-classic-blue-300 focus:border-classic-blue-400 transition-shadow text-classic-blue-900 resize-none"
              />
            </div>
            
            <button 
              type="submit"
              disabled={!title.trim()}
              className="w-full py-3 px-4 bg-classic-blue-600 hover:bg-classic-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              Guardar Idea
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
