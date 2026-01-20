'use client';

import { useState } from 'react';
import { Download, FileText, File } from 'lucide-react';
import { Workout } from '@/lib/types';
import {
  filterWorkoutsByPeriod,
  formatWorkoutsAsText,
  formatWorkoutsAsCSV,
  downloadFile,
} from '@/lib/workoutUtils';

interface ExportDataProps {
  workouts: Workout[];
}

type TimePeriod = 'week' | 'month' | 'all';
type ExportFormat = 'text' | 'csv';

export default function ExportData({ workouts }: ExportDataProps) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('all');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('text');

  const handleExport = () => {
    const filteredWorkouts = filterWorkoutsByPeriod(workouts, timePeriod);

    let content = '';
    let filename = '';
    let mimeType = 'text/plain';

    if (exportFormat === 'text') {
      content = formatWorkoutsAsText(filteredWorkouts);
      const dateStr = new Date().toISOString().split('T')[0];
      filename = `treinos_${dateStr}.txt`;
    } else {
      content = formatWorkoutsAsCSV(filteredWorkouts);
      const dateStr = new Date().toISOString().split('T')[0];
      filename = `treinos_${dateStr}.csv`;
      mimeType = 'text/csv';
    }

    downloadFile(content, filename, mimeType);
  };

  const getWorkoutCount = () => {
    return filterWorkoutsByPeriod(workouts, timePeriod).length;
  };

  return (
    <div className="card">
      <h3 className="text-base sm:text-lg font-semibold text-white mb-4">
        Exportar Dados
      </h3>

      {/* Period Selection */}
      <div className="mb-5">
        <label className="block text-xs font-medium text-text-secondary mb-2">
          Período
        </label>
        <div className="space-y-2">
          {[
            { value: 'week' as TimePeriod, label: 'Última semana' },
            { value: 'month' as TimePeriod, label: 'Último mês' },
            { value: 'all' as TimePeriod, label: 'Todos os treinos' },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-center p-2.5 rounded cursor-pointer hover:bg-tertiary/30 transition-colors"
            >
              <input
                type="radio"
                name="timePeriod"
                value={option.value}
                checked={timePeriod === option.value}
                onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="ml-3 text-xs sm:text-sm text-text-primary">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Format Selection */}
      <div className="mb-5">
        <label className="block text-xs font-medium text-text-secondary mb-2">
          Formato
        </label>
        <div className="space-y-2">
          {[
            { value: 'text' as ExportFormat, label: 'Texto simples (.txt)', icon: FileText },
            { value: 'csv' as ExportFormat, label: 'CSV (.csv)', icon: File },
          ].map((option) => {
            const Icon = option.icon;
            return (
              <label
                key={option.value}
                className="flex items-center p-2.5 rounded cursor-pointer hover:bg-tertiary/30 transition-colors"
              >
                <input
                  type="radio"
                  name="exportFormat"
                  value={option.value}
                  checked={exportFormat === option.value}
                  onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
                  className="w-4 h-4 cursor-pointer"
                />
                <Icon size={16} className="ml-3 text-text-secondary" />
                <span className="ml-2 text-xs sm:text-sm text-text-primary">
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="p-3 bg-tertiary/20 rounded mb-5">
        <p className="text-xs text-text-secondary">
          Total de treinos: <span className="font-semibold text-text-primary">{getWorkoutCount()}</span>
        </p>
      </div>

      {/* Export Button */}
      <button
        onClick={handleExport}
        disabled={getWorkoutCount() === 0}
        className="w-full py-2.5 sm:py-3 font-semibold text-xs sm:text-sm rounded transition-all flex items-center justify-center gap-2"
        style={{
          backgroundColor: getWorkoutCount() > 0 ? 'var(--color-new)' : 'var(--bg-tertiary)',
          color: getWorkoutCount() > 0 ? 'white' : 'var(--text-secondary)',
          cursor: getWorkoutCount() > 0 ? 'pointer' : 'not-allowed',
          opacity: getWorkoutCount() > 0 ? 1 : 0.6,
        }}
      >
        <Download size={16} />
        {getWorkoutCount() > 0 ? 'Exportar Dados' : 'Nenhum treino para exportar'}
      </button>
    </div>
  );
}
