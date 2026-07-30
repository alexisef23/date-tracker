import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const DateContext = createContext();

export function DateProvider({ children }) {
  const [ideas, setIdeas] = useState([]);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDates = async () => {
    const { data, error } = await supabase.from('dates').select('*');
    if (error) {
      console.error("Error leyendo desde Supabase:", error);
      setLoading(false);
      return;
    }

    const allDates = data || [];
    
    const pendingIdeas = allDates
      .filter(d => !d.completed)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      
    const completedDates = allDates
      .filter(d => d.completed)
      .sort((a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime());

    const sortedPendingIdeas = pendingIdeas.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    setIdeas(sortedPendingIdeas);
    setMemories(completedDates);
    setLoading(false);
  };

  useEffect(() => {
    // Initial fetch
    fetchDates();

    // Subscribe to realtime changes with granular updates
    const channel = supabase
      .channel('dates-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'dates' }, (payload) => {
        const newRow = payload.new;
        if (newRow.completed) {
          setMemories(prev => prev.some(m => m.id === newRow.id) ? prev : [newRow, ...prev].sort((a,b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0)));
        } else {
          setIdeas(prev => prev.some(i => i.id === newRow.id) ? prev : [newRow, ...prev].sort((a,b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)));
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'dates' }, (payload) => {
        const newRow = payload.new;
        if (newRow.completed) {
          setIdeas(prev => prev.filter(i => i.id !== newRow.id));
          setMemories(prev => {
            if (prev.some(m => m.id === newRow.id)) {
              return prev.map(m => m.id === newRow.id ? newRow : m);
            }
            return [newRow, ...prev].sort((a,b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0));
          });
        } else {
          setIdeas(prev => prev.map(i => i.id === newRow.id ? newRow : i));
        }
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'dates' }, (payload) => {
        setIdeas(prev => prev.filter(i => i.id !== payload.old.id));
        setMemories(prev => prev.filter(i => i.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addIdea = async (idea) => {
    // Actualización optimista
    const tempId = `temp-${Date.now()}`;
    const newIdea = { ...idea, id: tempId, completed: false, createdAt: new Date().toISOString() };
    setIdeas(prev => [newIdea, ...prev]);

    try {
      const { data, error } = await supabase.from('dates').insert([{
        ...idea,
        completed: false
      }]).select().single();
      
      if (error) throw error;
      
      // Actualizar el id temporal con el real de la BD
      setIdeas(prev => prev.map(i => i.id === tempId ? data : i));
    } catch (error) {
      console.error("Error agregando idea: ", error);
      // Revertir si hay error
      setIdeas(prev => prev.filter(i => i.id !== tempId));
    }
  };

  const completeIdea = async (id, photoUrl = null) => {
    const ideaToComplete = ideas.find(i => i.id === id);
    if (!ideaToComplete) return;

    // Actualización optimista instantánea
    const completedDate = new Date().toISOString();
    const updatedIdea = { ...ideaToComplete, completed: true, completedAt: completedDate, photoUrl };
    
    setIdeas(prev => prev.filter(i => i.id !== id));
    setMemories(prev => [updatedIdea, ...prev]);

    try {
      const { error } = await supabase.from('dates').update({
        completed: true,
        completedAt: completedDate,
        photoUrl: photoUrl
      }).eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error("Error completando salida: ", error);
      // Revertir si falla
      setMemories(prev => prev.filter(i => i.id !== id));
      setIdeas(prev => [ideaToComplete, ...prev]);
    }
  };

  return (
    <DateContext.Provider value={{ ideas, memories, addIdea, completeIdea, loading }}>
      {children}
    </DateContext.Provider>
  );
}

export function useDateTracker() {
  return useContext(DateContext);
}
