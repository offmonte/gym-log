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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-secondary rounded-lg max-w-md w-full p-6 sm:p-8 animate-slide-in">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle size={28} className="text-red-500 flex-shrink-0" />
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Tem certeza?
          </h2>
        </div>

        <p className="text-text-secondary text-sm sm:text-base mb-6 leading-relaxed">
          Tem certeza que deseja apagar <span className="font-semibold">TODAS</span> suas anotações de treino? Esse processo não poderá ser revertido depois.
        </p>

        {!isButtonEnabled && (
          <p className="text-xs sm:text-sm text-text-tertiary mb-6 text-center">
            Botão de apagar disponível em {secondsRemaining} segundo{secondsRemaining !== 1 ? 's' : ''}...
          </p>
        )}

        <div className="flex gap-3 sm:gap-4">
          <button
            onClick={onCancel}
            className="flex-1 py-3 btn-secondary text-sm font-medium flex items-center justify-center gap-1"
          >
            <X size={16} />
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            disabled={!isButtonEnabled}
            className="flex-1 py-3 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-1"
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
