import React from 'react';
import { Radar } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-dark-border bg-dark-bg/50" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 text-center">
          <div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Radar className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-dark-text">Spectra<span className="text-primary">Fuse</span></span>
            </div>
            <p className="text-sm text-dark-muted max-w-md mx-auto">
              Multi-spectral aerial image fusion platform built for advanced aerial image analysis at the Centre for Airborne Systems.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-dark-border text-center text-xs text-dark-muted">
          <p>SpectraFuse — Advanced Image Fusion Platform © {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
