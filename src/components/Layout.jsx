import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, BookImage } from 'lucide-react';

export default function Layout({ children, activeTab, setActiveTab }) {
  return (
    <div className="flex flex-col h-screen sm:h-[85vh] w-full max-w-md overflow-hidden bg-classic-beige-100 mx-auto sm:rounded-3xl shadow-none sm:shadow-2xl relative sm:border border-classic-beige-200 transform">
      {/* Header Clásico */}
      <header className="pt-12 pb-6 px-4 sm:px-6 bg-classic-beige-50 shadow-sm z-10 relative">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-serif text-classic-blue-900 font-medium">Nuestras Salidas</h1>
          <Heart className="text-classic-blue-400 w-6 h-6" strokeWidth={1.5} />
        </div>
        <p className="text-classic-blue-600/70 text-sm mt-1 font-serif italic">para que no se nos olviden</p>
      </header>

      {/* Área de Contenido con scroll */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 scroll-smooth">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navegación Inferior (Tabs) */}
      <nav className="bg-classic-beige-50 border-t border-classic-beige-200 px-4 sm:px-6 py-4 flex justify-around items-center pb-8 z-10 relative">
        <button 
          onClick={() => setActiveTab('ideas')}
          className={`flex flex-col items-center transition-colors duration-300 ${activeTab === 'ideas' ? 'text-classic-blue-700' : 'text-slate-400'}`}
        >
          <div className={`p-2 rounded-full mb-1 transition-colors duration-300 ${activeTab === 'ideas' ? 'bg-classic-blue-50' : 'bg-transparent'}`}>
            <Heart className="w-6 h-6" strokeWidth={activeTab === 'ideas' ? 2 : 1.5} />
          </div>
          <span className="text-xs font-medium">Ideas</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('memories')}
          className={`flex flex-col items-center transition-colors duration-300 ${activeTab === 'memories' ? 'text-classic-blue-700' : 'text-slate-400'}`}
        >
          <div className={`p-2 rounded-full mb-1 transition-colors duration-300 ${activeTab === 'memories' ? 'bg-classic-blue-50' : 'bg-transparent'}`}>
            <BookImage className="w-6 h-6" strokeWidth={activeTab === 'memories' ? 2 : 1.5} />
          </div>
          <span className="text-xs font-medium">Recuerdos</span>
        </button>
      </nav>
    </div>
  );
}
