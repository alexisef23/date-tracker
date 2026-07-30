import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, Image as ImageIcon, Camera } from 'lucide-react';
import { useDateTracker } from '../context/DateContext';
import { supabase } from '../supabase';

export default function PhotoUploadModal({ idea, isOpen, onClose }) {
  const { completeIdea } = useDateTracker();
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  if (!isOpen || !idea) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };



  const handleComplete = async () => {
    setIsUploading(true);
    
    try {
      let finalPhotoUrl = null;

      if (selectedFile) {
        // Subir foto a Supabase Storage
        const fileExtension = selectedFile.name.split('.').pop() || 'jpg';
        const fileName = `${idea.id}_${Date.now()}.${fileExtension}`;
        
        const { error: uploadError } = await supabase.storage
          .from('date-photos')
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('date-photos')
          .getPublicUrl(fileName);
          
        finalPhotoUrl = data.publicUrl;
      }
      
      await completeIdea(idea.id, finalPhotoUrl);
      
      setIsUploading(false);
      onClose();
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      alert("Hubo un error al guardar tu recuerdo. Revisa los permisos de Supabase Storage.");
      setIsUploading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-classic-blue-900/60 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-classic-beige-50 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-classic-beige-200/50"
        >
          <div className="p-5 flex justify-between items-center">
            <h3 className="font-serif text-xl text-classic-blue-900 font-medium">Captura este recuerdo</h3>
            <button onClick={onClose} disabled={isUploading} className="text-classic-blue-400 hover:text-classic-blue-600 transition-colors p-1 bg-classic-beige-200/50 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="px-6 pb-6 text-center">
            <p className="text-classic-blue-700/80 mb-4 font-serif italic">
              "{idea.title}"
            </p>
            
            <div className="mb-4 flex gap-2 justify-center">
               <button 
                onClick={() => { fileInputRef.current?.click(); }}
                className="flex items-center gap-2 px-4 py-2.5 bg-classic-beige-200 hover:bg-classic-beige-300 text-classic-blue-800 rounded-xl text-sm transition-colors font-medium shadow-sm flex-1 justify-center"
               >
                 <ImageIcon className="w-5 h-5" />
                 Galería
               </button>
               
               <button 
                onClick={() => { cameraInputRef.current?.click(); }}
                className="flex items-center gap-2 px-4 py-2.5 bg-classic-blue-100 hover:bg-classic-blue-200 text-classic-blue-800 rounded-xl text-sm transition-colors font-medium shadow-sm flex-1 justify-center"
               >
                 <Camera className="w-5 h-5" />
                 Cámara
               </button>
            </div>

            <div 
              className={`relative rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${
                preview ? 'border-2 border-classic-blue-300 bg-black/5' : 'border-2 border-dashed border-classic-beige-300 bg-white hover:bg-classic-beige-100 cursor-pointer h-56'
              }`}
              onClick={() => !preview && fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
              <input 
                type="file" 
                ref={cameraInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
                capture="environment"
              />
              
              {preview ? (
                <div className="relative w-full">
                  <img src={preview} alt="Vista previa" className="w-full h-56 object-cover" />
                  <button 
                    onClick={(e) => { e.stopPropagation(); setPreview(null); setSelectedFile(null); }}
                    className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur rounded-full text-red-500 shadow-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="p-6 flex flex-col items-center text-classic-blue-400">
                  <div className="w-12 h-12 rounded-full bg-classic-blue-50 flex items-center justify-center mb-3">
                     <ImageIcon className="w-6 h-6 text-classic-blue-500" />
                  </div>
                  <span className="text-sm font-medium text-classic-blue-800">Toca para buscar en tu dispositivo</span>
                </div>
              )}
            </div>

            <div className="mt-8 flex gap-3">
              <button 
                onClick={handleComplete}
                disabled={isUploading}
                className="flex-1 py-3 px-4 bg-classic-blue-600 hover:bg-classic-blue-700 text-white rounded-xl font-medium transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait relative overflow-hidden"
              >
                {isUploading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    <UploadCloud className="w-5 h-5" />
                    <span>Guardar Recuerdo</span>
                  </>
                )}
              </button>
            </div>
            
            {!preview && (
              <button 
                onClick={handleComplete}
                className="mt-4 text-sm text-classic-blue-400 hover:text-classic-blue-600 underline decoration-classic-blue-400/30 underline-offset-4"
              >
                Completar sin foto por ahora
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
