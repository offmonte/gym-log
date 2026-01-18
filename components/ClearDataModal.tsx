'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, X, Trash2 } from 'lucide-react';

interface ClearDataModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ClearDataModal({
  isOpen,
  onConfirm,
  onCancel,
}: ClearDataModalProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(3);
  const isButtonEnabled = secondsRemaining === 0;

  useEffect(() => {
    if (!isOpen) {
      setSecondsRemaining(3);
      return;
    }

    if (secondsRemaining > 0) {
      const timer = setTimeout(() => {
        setSecondsRemaining(secondsRemaining - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, secondsRemaining]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-secondary rounded-lg max-w-sm w-full p-5 sm:p-6 animate-slide-in">
        <div className="flex items-center gap-3 mb-3 sm:mb-4">
          <AlertCircle size={24} className="text-red-500 flex-shrink-0" />
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Tem certeza?
          </h2>
        </div>

        <p className="text-text-secondary text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
          Tem certeza que deseja apagar <span className="font-semibold">TODAS</span> suas anotações de treino? Esse processo não poderá ser revertido depois.
        </p>

        {!isButtonEnabled && (
          <p className="text-xs text-text-tertiary mb-4 sm:mb-6 text-center">
            Botão de apagar disponível em {secondsRemaining} segundo{secondsRemaining !== 1 ? 's' : ''}...
          </p>
        )}

        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 sm:py-3 btn-secondary text-xs sm:text-sm font-medium flex items-center justify-center gap-1"
          >
            <X size={16} />
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            disabled={!isButtonEnabled}
            className="flex-1 py-2.5 sm:py-3 text-xs sm:text-sm font-medium rounded transition-all flex items-center justify-center gap-1"
            style={{
              backgroundColor: isButtonEnabled ? 'var(--color-down)' : 'var(--bg-tertiary)',
              color: isButtonEnabled ? 'white' : 'var(--text-secondary)',
              cursor: isButtonEnabled ? 'pointer' : 'not-allowed',
              opacity: isButtonEnabled ? 1 : 0.6,
            }}
          >
            <Trash2 size={16} />
            {isButtonEnabled ? 'Apagar Tudo' : 'Aguarde...'}
          </button>
        </div>
      </div>
    </div>
  );
}
