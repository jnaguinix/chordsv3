import React from 'react';
import { Sidebar } from './layout/Sidebar';
import { Topbar } from './layout/Topbar';
import { StepsTimeline } from './layout/StepsTimeline';
import { PianoEditor } from './piano/PianoEditor';
import { Inspector } from './layout/Inspector';
import { EmptyState } from './layout/EmptyState';
import { WizardModal } from './wizard/WizardModal';
import { ConfirmModal, Toast } from './ui/Modals';
import { usePassage } from '../context/PassageContext';
import { useUI } from '../context/UIContext';

export function MainLayout() {
  const { activeProg } = usePassage();
  const { isSidebarOpen, isInspectorOpen } = useUI();

  return (
    <div className="h-screen w-full flex bg-[var(--color-bg)] text-[var(--color-txt)] overflow-hidden font-sans">
      {isSidebarOpen && <Sidebar />}
      
      <main className="flex-1 flex flex-col min-w-0">
        {activeProg ? (
          <>
            <Topbar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <StepsTimeline />
              <PianoEditor />
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </main>

      {activeProg && isInspectorOpen && <Inspector />}

      <WizardModal />
      <ConfirmModal />
      <Toast />
    </div>
  );
}
