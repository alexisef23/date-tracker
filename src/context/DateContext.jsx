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

    // Subscribe to realtime changes
    const channel = supabase
      .channel('dates-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'dates' }, () => {
        fetchDates();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addIdea = async (idea) => {
    try {
      const { error } = await supabase.from('dates').insert([{
        ...idea,
        completed: false
      }]);
      if (error) throw error;
    } catch (error) {
      console.error("Error agregando idea: ", error);
    }
  };

  const completeIdea = async (id, photoUrl = null) => {
    try {
      const { error } = await supabase.from('dates').update({
        completed: true,
        completedAt: new Date().toISOString(),
        photoUrl: photoUrl,
        magicStyle: null
      }).eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error("Error completando salida: ", error);
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
