import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { LandingPage } from '@/pages/LandingPage';
import { FusionWorkbench } from '@/pages/FusionWorkbench';
import { AnalysisResults } from '@/pages/AnalysisResults';
import { Documentation } from '@/pages/Documentation';
import { About } from '@/pages/About';
import { NotFound } from '@/pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <div className="min-h-screen bg-dark-bg text-dark-text">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/workbench" element={<FusionWorkbench />} />
            <Route path="/results" element={<AnalysisResults />} />
            <Route path="/docs" element={<Documentation />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
