import React from 'react';
import { useUI } from '../../context/UIContext';
import { cn } from '../../lib/utils';

export function ConfirmModal() {
  const { confirmModal, closeConfirm } = useUI();

  if (!confirmModal || !confirmModal.isOpen) return null;

  const handleConfirm = () => {
    confirmModal.onConfirm();
    closeConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black/75 z-[200] flex items-center justify-center p-4">
      <div className="bg-[var(--color-panel2)] border border-[var(--color-brd2)] rounded-[22px] p-6 w-[350px] flex flex-col gap-4 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
        <p className="text-sm text-[var(--color-txt)] leading-relaxed font-medium">
          {confirmModal.msg}
        </p>
        <div className="flex justify-end gap-2 mt-2">
          <button 
            onClick={closeConfirm}
            className="px-4 py-2 text-[13px] font-bold rounded-xl bg-[var(--color-panel3)] border border-[var(--color-brd2)] text-[var(--color-mut2)] hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleConfirm}
            className={cn(
              "px-4 py-2 text-[13px] font-bold rounded-xl transition-colors",
              confirmModal.title?.includes('Eliminar') ? "bg-[#c03030] hover:bg-[#a02020] text-white" : "bg-[var(--color-txt)] text-[var(--color-bg)] hover:opacity-90"
            )}
          >
            {confirmModal.title?.includes('Eliminar') ? 'Eliminar' : 'Aceptar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Toast() {
  const { toastMsg } = useUI();

  if (!toastMsg) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[300] bg-[var(--color-panel3)] border border-[var(--color-brd2)] rounded-xl py-3 px-5 text-[13px] font-semibold text-[var(--color-txt)] shadow-[0_6px_28px_rgba(0,0,0,0.4)] animate-in slide-in-from-bottom-2 fade-in duration-200 pointer-events-none">
      {toastMsg}
    </div>
  );
}
