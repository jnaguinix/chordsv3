import { createContext, useContext, useState, ReactNode } from 'react';

type UIContextType = {
  isWizardOpen: boolean;
  setWizardOpen: (val: boolean) => void;
  confirmModal: { isOpen: boolean; title?: string; msg: string; onConfirm: () => void } | null;
  showConfirm: (msg: string, onConfirm: () => void, title?: string) => void;
  closeConfirm: () => void;
  toastMsg: string | null;
  showToast: (msg: string) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (val: boolean) => void;
  isInspectorOpen: boolean;
  setInspectorOpen: (val: boolean) => void;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [isWizardOpen, setWizardOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<UIContextType['confirmModal']>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isInspectorOpen, setInspectorOpen] = useState(true);

  const showConfirm = (msg: string, onConfirm: () => void, title?: string) => {
    setConfirmModal({ isOpen: true, msg, onConfirm, title });
  };

  const closeConfirm = () => {
    setConfirmModal(null);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  return (
    <UIContext.Provider value={{ 
      isWizardOpen, setWizardOpen, 
      confirmModal, showConfirm, closeConfirm, 
      toastMsg, showToast,
      isSidebarOpen, setSidebarOpen,
      isInspectorOpen, setInspectorOpen
    }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) throw new Error('useUI must be used within UIProvider');
  return context;
}
