'use client';

import { useState } from 'react';

export type NavTab = 'workout' | 'history' | 'settings';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs: { id: NavTab; label: string; icon: string }[] = [
    { id: 'workout', label: 'Treino', icon: '🏋️' },
    { id: 'history', label: 'Histórico', icon: '📅' },
    { id: 'settings', label: 'Ajustes', icon: '⚙️' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-secondary border-t border-tertiary md:hidden">
      <div className="flex justify-around items-center h-20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center justify-center flex-1 h-full transition-all text-xs font-medium"
            style={{
              color: activeTab === tab.id ? 'var(--color-new)' : 'var(--text-secondary)',
              backgroundColor:
                activeTab === tab.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
            }}
          >
            <span className="text-2xl mb-1">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
