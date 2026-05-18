/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { PassageProvider } from './context/PassageContext';
import { UIProvider } from './context/UIContext';
import { MainLayout } from './components/MainLayout';
import { initAudio } from './lib/audio';

export default function App() {
  useEffect(() => {
    initAudio().catch(console.error);
  }, []);

  return (
    <PassageProvider>
      <UIProvider>
        <MainLayout />
      </UIProvider>
    </PassageProvider>
  );
}

