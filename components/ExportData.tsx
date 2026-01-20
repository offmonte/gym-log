'use client';

import { useState } from 'react';
import { Download, Copy, Check } from 'lucide-react';
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
  const [textContent, setTextContent] = useState<string>('');
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  const getWorkoutCount = () => {
    return filterWorkoutsByPeriod(workouts, timePeriod).length;
  };

  const handleGenerateText = () => {
    const filteredWorkouts = filterWorkoutsByPeriod(workouts, timePeriod);
    const content = formatWorkoutsAsText(filteredWorkouts);
    setTextContent(content);
  };

  const handleExportCSV = () => {
    const filteredWorkouts = filterWorkoutsByPeriod(workouts, timePeriod);
    const content = formatWorkoutsAsCSV(filteredWorkouts);
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `treinos_${dateStr}.csv`;
    downloadFile(content, filename, 'text/csv');
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(textContent);
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
    } catch (err) {
      console.error('Falha ao copiar para clipboard:', err);
    }
  };

  const isTextFormat = exportFormat === 'text';
  const hasWorkouts = getWorkoutCount() > 0;
  const hasTextContent = textContent.length > 0;

  return (
    <div className="card">
      <h3 className="text-base sm:text-lg font-semibold text-white mb-4">
        Exportar Dados
      </h3>

      {/* Period Dropdown */}
      <div className="mb-4">
        <label htmlFor="period-select" className="block text-xs font-medium text-text-secondary mb-2">
          Período
        </label>
        <select
          id="period-select"
          value={timePeriod}
          onChange={(e) => {
            setTimePeriod(e.target.value as TimePeriod);
            setTextContent('');
          }}
          className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-bg-tertiary bg-tertiary/30 text-text-primary cursor-pointer hover:border-color-new transition-colors"
        >
          <option value="week">Última semana</option>
          <option value="month">Último mês</option>
          <option value="all">Todos os treinos</option>
        </select>
      </div>

      {/* Format Dropdown */}
      <div className="mb-4">
        <label htmlFor="format-select" className="block text-xs font-medium text-text-secondary mb-2">
          Formato
        </label>
        <select
          id="format-select"
          value={exportFormat}
          onChange={(e) => {
            setExportFormat(e.target.value as ExportFormat);
            setTextContent('');
          }}
          className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-bg-tertiary bg-tertiary/30 text-text-primary cursor-pointer hover:border-color-new transition-colors"
        >
          <option value="text">Texto simples</option>
          <option value="csv">CSV</option>
        </select>
      </div>

      {/* Summary */}
      <div className="p-3 bg-tertiary/20 rounded mb-4">
        <p className="text-xs text-text-secondary">
          Total de treinos: <span className="font-semibold text-text-primary">{getWorkoutCount()}</span>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={isTextFormat ? handleGenerateText : handleExportCSV}
          disabled={!hasWorkouts}
          className="flex-1 py-2.5 sm:py-3 font-semibold text-xs sm:text-sm rounded transition-all flex items-center justify-center gap-2"
          style={{
            backgroundColor: hasWorkouts ? 'var(--color-new)' : 'var(--bg-tertiary)',
            color: hasWorkouts ? 'white' : 'var(--text-secondary)',
            cursor: hasWorkouts ? 'pointer' : 'not-allowed',
            opacity: hasWorkouts ? 1 : 0.6,
          }}
        >
          <Download size={16} />
          {isTextFormat ? 'Gerar relatório' : 'Exportar treino'}
        </button>

        {/* Copy Button - Only show for text format with content */}
        {isTextFormat && hasTextContent && (
          <button
            onClick={handleCopyToClipboard}
            className="px-3 sm:px-4 py-2.5 sm:py-3 font-semibold text-xs sm:text-sm rounded transition-all flex items-center justify-center gap-2"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              color: copiedToClipboard ? 'var(--color-up)' : 'var(--text-secondary)',
              border: copiedToClipboard ? `1px solid var(--color-up)` : '1px solid var(--bg-tertiary)',
            }}
          >
            {copiedToClipboard ? (
              <>
                <Check size={16} />
                Copiado
              </>
            ) : (
              <>
                <Copy size={16} />
                Copiar
              </>
            )}
          </button>
        )}
      </div>

      {/* Text Preview - Only show for text format with content */}
      {isTextFormat && hasTextContent && (
        <div className="mt-4 p-3 sm:p-4 bg-tertiary/20 rounded border border-bg-tertiary max-h-96 overflow-y-auto">
          <pre className="text-xs sm:text-sm text-text-secondary whitespace-pre-wrap break-words font-mono">
            {textContent}
          </pre>
        </div>
      )}
    </div>
  );
}
