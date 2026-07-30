import { useState } from 'react';
import Layout from './components/Layout';
import { DateProvider } from './context/DateContext';

import IdeaList from './components/IdeaList';
import CompletedDates from './components/CompletedDates';

function AppContent() {
  const [activeTab, setActiveTab] = useState('ideas');

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'ideas' ? <IdeaList /> : <CompletedDates />}
    </Layout>
  );
}

function App() {
  return (
    <DateProvider>
      <div className="min-h-screen bg-gray-100 sm:py-10 flex justify-center items-center">
        <div className="w-full h-screen sm:h-[844px] sm:w-[390px] sm:rounded-[3rem] overflow-hidden shadow-2xl relative bg-black ring-4 ring-black transform">
           {/* Mock of a phone bezel for desktop view */}
          <AppContent />
        </div>
      </div>
    </DateProvider>
  );
}

export default App;
