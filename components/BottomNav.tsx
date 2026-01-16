'use client';

import { useState } from 'react';
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
    <nav className="fixed bottom-0 left-0 right-0 bg-secondary border-t border-tertiary" style={{ paddingBottom: 'max(0px, env(safe-area-inset-bottom))' }}>
      <div className="flex justify-around items-center h-20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center justify-center flex-1 h-full transition-all text-xs md:text-sm font-medium"
            style={{
              color: activeTab === tab.id ? 'var(--color-new)' : 'var(--text-secondary)',
              backgroundColor:
                activeTab === tab.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
            }}
          >
            <div className="mb-1" style={{
              color: activeTab === tab.id ? 'var(--color-new)' : 'var(--text-secondary)',
            }}>
              {tab.icon}
            </div>
            <span className="text-xs md:text-xs">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
