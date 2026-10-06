import React, { useState } from 'react';
import { FleetProvider } from './context/FleetContext';
import { Header } from './components/Layout/Header';
import { AnimatedBackground } from './components/Background/AnimatedBackground';
import { Dashboard } from './pages/Dashboard';
import { LiveOptimization } from './pages/LiveOptimization';
import { Algorithms } from './pages/Algorithms';
import { Analytics } from './pages/Analytics';
import { NavigationPage } from './components/Layout/Sidebar';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('dashboard');

  return (
    <FleetProvider>
      <div className="relative flex flex-col h-screen w-screen overflow-hidden bg-[#070a0f] text-slate-100">
        {/* Subtle Canvas Particle Background */}
        <AnimatedBackground />

        {/* Clean Top Navigation Bar */}
        <Header currentPage={currentPage} onSelectPage={setCurrentPage} />

        {/* Main Application Content Area */}
        <main className="relative flex-1 flex overflow-hidden z-10">
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'live' && <LiveOptimization />}
          {currentPage === 'algorithms' && <Algorithms />}
          {currentPage === 'analytics' && <Analytics />}
        </main>
      </div>
    </FleetProvider>
  );
};

export default App;
