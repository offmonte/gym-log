'use client';

import { Dumbbell, Calendar, Settings } from 'lucide-react';

export type NavTab = 'workout' | 'history' | 'settings';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

interface NavTabItem {
  id: NavTab;
  label: string;
  icon: React.ReactNode;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs: NavTabItem[] = [
    { id: 'workout', label: 'Treino', icon: <Dumbbell size={24} /> },
    { id: 'history', label: 'Histórico', icon: <Calendar size={24} /> },
    { id: 'settings', label: 'Ajustes', icon: <Settings size={24} /> },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-secondary border-t border-tertiary" style={{ paddingBottom: 'max(0px, env(safe-area-inset-bottom))' }}>
        <div className="flex justify-around items-center h-20">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center flex-1 h-full transition-all text-xs font-medium gap-1"
              style={{
                color: activeTab === tab.id ? 'var(--color-new)' : 'var(--text-secondary)',
                backgroundColor:
                  activeTab === tab.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
              }}
            >
              <div style={{
                color: activeTab === tab.id ? 'var(--color-new)' : 'var(--text-secondary)',
              }}>
                {tab.icon}
              </div>
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Desktop Sidebar Navigation */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-secondary border-r border-tertiary flex-col p-6" style={{ paddingRight: '0' }}>
        <div className="flex items-center gap-3 mb-12">
          <Dumbbell size={32} className="text-white" />
          <h1 className="text-2xl font-bold text-white">GymLog</h1>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-base font-medium w-full"
              style={{
                color: activeTab === tab.id ? 'var(--color-new)' : 'var(--text-secondary)',
                backgroundColor:
                  activeTab === tab.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
              }}
            >
              <div style={{
                color: activeTab === tab.id ? 'var(--color-new)' : 'var(--text-secondary)',
              }}>
                {tab.icon}
              </div>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
