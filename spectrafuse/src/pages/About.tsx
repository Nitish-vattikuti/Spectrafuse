import React from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Target, Wrench, User, Cpu, Rocket, Shield } from 'lucide-react';

export function About() {
  return (
    <PageWrapper className="pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-dark-text mb-4">
            See Beyond the Visible Spectrum
          </h1>
          <p className="text-lg text-dark-muted">
            A browser-based multi-spectral image fusion tool built for advanced aerial image analysis at the Centre for Airborne Systems.
          </p>
        </div>



        {/* Problem Statement */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-dark-text mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-accent" /> The Problem
          </h2>
          <Card className="bg-dark-bg">
            <div className="space-y-4 text-dark-muted">
              <p>
                Currently, researchers must export raw aerial imagery to <strong className="text-dark-text">MATLAB</strong> or{' '}
                <strong className="text-dark-text">ENVI</strong> software to perform multi-spectral fusion and analysis.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-danger/10 border border-danger/20">
                  <h4 className="text-sm font-semibold text-danger mb-2">Current Workflow</h4>
                  <ul className="text-xs space-y-1 text-dark-muted">
                    <li>• MATLAB license: ₹40+ lakhs/year</li>
                    <li>• ENVI: ₹15+ lakhs/license</li>
                    <li>• Installation on each workstation</li>
                    <li>• Training required for each tool</li>
                    <li>• Cannot run on field laptops easily</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                  <h4 className="text-sm font-semibold text-success mb-2">SpectraFuse</h4>
                  <ul className="text-xs space-y-1 text-dark-muted">
                    <li>• Zero cost — open source</li>
                    <li>• Zero installation — runs in browser</li>
                    <li>• Air-gap deployable as static site</li>
                    <li>• Intuitive GUI — minimal training</li>
                    <li>• Works on any device with a browser</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </section>



        {/* Technical Architecture */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-dark-text mb-4 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-primary" /> Technical Architecture
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Frontend', items: ['React 18 + TypeScript', 'Vite (build tool)', 'Tailwind CSS', 'Zustand (state)'] },
              { label: 'Processing', items: ['Pure TypeScript algorithms', 'Canvas API for I/O', 'TensorFlow.js (detection)', 'Web Workers (async)'] },
              { label: 'Visualization', items: ['Recharts (histograms)', 'Canvas (image viewer)', 'False-color LUTs', 'Compare slider'] },
              { label: 'Export', items: ['PNG / JPEG download', 'jsPDF (PDF reports)', 'file-saver (blob export)', 'Auto-named files'] },
            ].map((group) => (
              <Card key={group.label} className="bg-dark-bg">
                <h4 className="text-sm font-semibold text-primary mb-2">{group.label}</h4>
                <ul className="text-xs text-dark-muted space-y-1">
                  {group.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </section>

        {/* Roadmap */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-dark-text mb-4 flex items-center gap-2">
            <Rocket className="w-6 h-6 text-accent" /> Future Roadmap
          </h2>
          <Card className="bg-dark-bg">
            <div className="space-y-3">
              {[
                { status: 'planned', label: 'GeoTIFF support with coordinate metadata preservation' },
                { status: 'planned', label: 'UAV live stream integration for real-time fusion' },
                { status: 'planned', label: 'GPU acceleration via WebGPU for large images' },
                { status: 'planned', label: 'Multi-frame temporal fusion for video analysis' },
                { status: 'planned', label: 'Custom CNN-based fusion model training in-browser' },
                { status: 'planned', label: 'Collaborative annotation for team workflows' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent/50" />
                  <span className="text-sm text-dark-muted">{item.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
      <Footer />
    </PageWrapper>
  );
}
