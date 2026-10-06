import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';
import { OrderPanel } from '../components/Orders/OrderPanel';
import { RiderPanel } from '../components/Riders/RiderPanel';
import { MapView } from '../components/Map/MapView';
import { AlgorithmPipeline } from '../components/Algorithms/AlgorithmPipeline';
import { WhyRiderModal } from '../components/Explanation/WhyRiderModal';
import { PanelLeftClose, PanelRightClose, PanelLeftOpen, PanelRightOpen } from 'lucide-react';

export const LiveOptimization: React.FC = () => {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const { presentationMode } = useFleet();

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden relative bg-[#070a0f]">
      {/* Top Workspace (Orders | Map | Riders) */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Left Orders Panel (Collapsible) */}
        {!presentationMode && leftOpen && (
          <div className="w-80 h-full shrink-0 z-10 transition-all">
            <OrderPanel />
          </div>
        )}

        {/* Center Map Section */}
        <div className="flex-1 h-full relative overflow-hidden bg-[#070a0f]">
          <MapView className="w-full h-full rounded-none border-none" />

          {/* Toggle buttons for left/right sidebars */}
          {!presentationMode && (
            <div className="absolute top-4 left-4 z-30 flex gap-2">
              <button
                onClick={() => setLeftOpen(!leftOpen)}
                className="p-2 rounded-xl bg-[#0d121d]/90 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white shadow-lg"
                title={leftOpen ? 'Collapse Orders Panel' : 'Expand Orders Panel'}
              >
                {leftOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
              </button>
            </div>
          )}

          {!presentationMode && (
            <div className="absolute top-4 right-4 z-30 flex gap-2">
              <button
                onClick={() => setRightOpen(!rightOpen)}
                className="p-2 rounded-xl bg-[#0d121d]/90 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white shadow-lg"
                title={rightOpen ? 'Collapse Riders Panel' : 'Expand Riders Panel'}
              >
                {rightOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>

        {/* Right Riders Panel (Collapsible) */}
        {!presentationMode && rightOpen && (
          <div className="w-80 h-full shrink-0 z-10 transition-all">
            <RiderPanel />
          </div>
        )}
      </div>

      {/* Bottom Algorithm Pipeline */}
      <div className="shrink-0 z-20">
        <AlgorithmPipeline />
      </div>

      {/* Why Rider Modal (if opened via detail icon) */}
      <WhyRiderModal />
    </div>
  );
};
