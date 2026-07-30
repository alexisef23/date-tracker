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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center sm:p-8">
        <AppContent />
      </div>
    </DateProvider>
  );
}

export default App;
