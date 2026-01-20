'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getDayOfWeek } from '@/lib/workoutUtils';
import { useState } from 'react';

interface WeekViewProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export default function WeekView({ selectedDate, onDateChange }: WeekViewProps) {
  const [weekStart, setWeekStart] = useState(() => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - date.getDay());
    return date;
  });

  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      days.push({
        dateString,
        day: date.getDate(),
        isToday: dateString === new Date().toISOString().split('T')[0],
      });
    }
    return days;
  };

  const weekDays = getWeekDays();
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

  const goToPreviousWeek = () => {
    const newDate = new Date(weekStart);
    newDate.setDate(newDate.getDate() - 7);
    setWeekStart(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(weekStart);
    newDate.setDate(newDate.getDate() + 7);
    setWeekStart(newDate);
  };

  return (
    <div className="card">
      {/* Week navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousWeek}
          className="p-1.5 hover:opacity-70 transition-opacity text-text-secondary"
          aria-label="Semana anterior"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="text-center flex-1">
          <p className="text-xs text-text-tertiary">
            {weekStart.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
          </p>
        </div>

        <button
          onClick={goToNextWeek}
          className="p-1.5 hover:opacity-70 transition-opacity text-text-secondary"
          aria-label="Próxima semana"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Week days grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {weekDays.map((dayObj, index) => {
          const isSelected = dayObj.dateString === selectedDate;
          return (
            <button
              key={dayObj.dateString}
              onClick={() => onDateChange(dayObj.dateString)}
              className="flex flex-col items-center justify-center p-2 sm:p-3 rounded transition-all"
              style={{
                backgroundColor: isSelected ? 'var(--color-new)' : dayObj.isToday ? 'var(--bg-tertiary)' : 'transparent',
                border: isSelected ? 'none' : dayObj.isToday ? '1px solid var(--bg-tertiary)' : '1px solid transparent',
                color: isSelected ? 'white' : 'var(--text-secondary)',
              }}
            >
              <span className="text-xs font-medium">{dayNames[index]}</span>
              <span className={`text-sm sm:text-base font-semibold mt-1 ${isSelected ? 'text-white' : 'text-text-primary'}`}>
                {dayObj.day}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
