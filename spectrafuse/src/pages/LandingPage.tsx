import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useImageStore } from '@/store/imageStore';
import {
  Layers, Brain, Thermometer, Crosshair, BarChart3, Zap,
  Upload, Settings2, Download, ChevronRight, Radar, Eye
} from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();
  const loadSampleImages = useImageStore((s) => s.loadSampleImages);

  const handleTrySamples = async () => {
    await loadSampleImages();
    navigate('/workbench');
  };

  return (
    <PageWrapper>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Solid bg */}
        <div className="absolute inset-0 bg-dark-bg" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-dark-text mb-6">
                Multi-Spectral Image Fusion for{' '}
                <span className="gradient-text">Airborne Surveillance</span>
              </h1>
              <p className="text-lg sm:text-xl text-dark-muted mb-8 max-w-2xl">
                Fuse IR, visible, and NIR imagery from EO payloads.
                Developed for Centre for Airborne Systems. Runs entirely in your browser.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/workbench">
                  <Button size="lg" className="w-full sm:w-auto text-base">
                    <Radar className="w-5 h-5" /> Open Fusion Tool
                  </Button>
                </Link>
                <Button size="lg" variant="outline" onClick={handleTrySamples} className="w-full sm:w-auto text-base">
                  <Eye className="w-5 h-5" /> Try with Samples
                </Button>
              </div>
            </div>

            {/* Right - Hero Animation */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-[400px] h-[300px]">
                {/* Three band cards merging */}
                <div className="merge-left absolute left-0 top-4 w-28 h-36 rounded-xl bg-gradient-to-br from-neutral-600/30 to-neutral-800/30 border border-neutral-500/30 flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                  <div className="w-16 h-16 rounded bg-gradient-to-br from-neutral-500/50 to-neutral-700/50" />
                  <span className="text-[10px] text-neutral-300 font-medium">Visible Band</span>
                </div>
                <div className="merge-center absolute left-1/2 -translate-x-1/2 top-0 w-28 h-36 rounded-xl bg-gradient-to-br from-stone-600/30 to-stone-800/30 border border-stone-500/30 flex flex-col items-center justify-center gap-2 backdrop-blur-sm z-10">
                  <div className="w-16 h-16 rounded bg-gradient-to-br from-stone-500/50 to-stone-700/50" />
                  <span className="text-[10px] text-stone-300 font-medium">Near-IR Band</span>
                </div>
                <div className="merge-right absolute right-0 top-4 w-28 h-36 rounded-xl bg-gradient-to-br from-primary/30 to-primary border border-primary/50 flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                  <div className="w-16 h-16 rounded bg-gradient-to-br from-primary/50 to-primary/80" />
                  <span className="text-[10px] text-primary-300 font-medium text-primary">Thermal IR Band</span>
                </div>

                {/* Arrow */}
                <div className="absolute left-1/2 -translate-x-1/2 top-[160px] text-dark-muted text-2xl">↓</div>

                {/* Result card */}
                <div className="merge-glow absolute left-1/2 -translate-x-1/2 bottom-0 w-36 h-24 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30 border border-primary/40 flex flex-col items-center justify-center gap-1 backdrop-blur-sm">
                  <div className="w-20 h-10 rounded bg-gradient-to-r from-neutral-500/40 via-stone-500/40 to-primary/40" />
                  <span className="text-[10px] text-primary font-semibold">Fused Output</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="hazard-stripe" />

      {/* Stats Bar */}
      <section className="border-y border-dark-border bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
          {[
            '5 Fusion Algorithms',
            'Zero Installation',
            'Client-Side Processing',
            'False-Color Mapping',
            'Advanced Image Analytics',
          ].map((stat) => (
            <div key={stat} className="text-sm font-medium text-dark-muted">{stat}</div>
          ))}
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-text mb-4">Powerful Features</h2>
            <p className="text-dark-muted text-lg max-w-2xl mx-auto">
              Everything you need for multi-spectral image analysis, right in your browser.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Layers className="w-6 h-6" />, title: 'Multi-Band Input', desc: 'Upload RGB visible, Near-IR, and Thermal IR bands independently. Supports JPG, PNG, TIFF, BMP.', color: 'text-dark-text' },
              { icon: <Brain className="w-6 h-6" />, title: '5 Fusion Algorithms', desc: 'DWT, PCA, Brovey, IHS, and Mean fusion — each optimized for different analysis scenarios.', color: 'text-secondary' },
              { icon: <Thermometer className="w-6 h-6" />, title: 'False-Color Thermal', desc: 'Apply Jet, Inferno, or Viridis colormaps to thermal data for intuitive heat visualization.', color: 'text-accent' },
              { icon: <Crosshair className="w-6 h-6" />, title: 'Object Detection', desc: 'TensorFlow.js COCO-SSD powered object detection directly on fused imagery.', color: 'text-primary' },
              { icon: <Zap className="w-6 h-6" />, title: 'Thermal Anomalies', desc: 'Statistical hot-spot detection using sigma-thresholding on thermal bands.', color: 'text-accent' },
              { icon: <BarChart3 className="w-6 h-6" />, title: 'Quality Metrics', desc: 'PSNR, SSIM, and Shannon Entropy with automatic quality grading.', color: 'text-dark-text' },
            ].map((f) => (
              <Card key={f.title} glow className="group hover:translate-y-[-2px] transition-transform">
                <div className={`w-12 h-12 rounded-xl bg-dark-bg flex items-center justify-center mb-4 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-dark-text mb-2">{f.title}</h3>
                <p className="text-sm text-dark-muted">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* How It Works */}
      <section className="py-20 bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-text mb-4">How It Works</h2>
            <p className="text-dark-muted text-lg">Three simple steps to fused imagery</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: <Upload className="w-8 h-8" />, title: 'Upload Spectral Bands', desc: 'Drag and drop your visible, NIR, and thermal images into the workbench.' },
              { step: '02', icon: <Settings2 className="w-8 h-8" />, title: 'Select Algorithm & Tune', desc: 'Choose from 5 fusion algorithms and fine-tune parameters with sliders.' },
              { step: '03', icon: <Download className="w-8 h-8" />, title: 'Analyze & Export', desc: 'View quality metrics, detect objects, find thermal anomalies, and download results.' },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center mx-auto mb-4 text-primary">
                  {s.icon}
                </div>
                <div className="text-xs font-bold text-primary mb-2">STEP {s.step}</div>
                <h3 className="text-lg font-semibold text-dark-text mb-2">{s.title}</h3>
                <p className="text-sm text-dark-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Algorithm Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-text mb-4">Fusion Algorithms</h2>
            <p className="text-dark-muted text-lg">Choose the right algorithm for your analysis</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { id: 'DWT', name: 'Discrete Wavelet Transform', best: 'Detail preservation', desc: 'Multi-resolution Haar wavelet decomposition with configurable fusion rules for optimal edge and detail retention.' },
              { id: 'PCA', name: 'Principal Component Analysis', best: 'Statistical independence', desc: 'Projects bands onto principal components, replaces first component with thermal data for optimal variance.' },
              { id: 'Brovey', name: 'Brovey Transform', best: 'Color sharpening', desc: 'Pan-sharpening method that injects thermal information while preserving spectral ratios.' },
              { id: 'IHS', name: 'Intensity-Hue-Saturation', best: 'Geometric accuracy', desc: 'Replaces intensity with thermal while preserving color information for natural-looking fusion.' },
              { id: 'Mean', name: 'Weighted Mean', best: 'Quick baseline', desc: 'Simple weighted pixel averaging. Fast and predictable — use as baseline comparison.' },
            ].map((a) => (
              <Card key={a.id} className="hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold text-primary font-mono">{a.id}</span>
                  <Badge variant="secondary">{a.best}</Badge>
                </div>
                <h4 className="text-sm font-semibold text-dark-text mb-1">{a.name}</h4>
                <p className="text-xs text-dark-muted">{a.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* Try Sample CTA */}
      <section className="py-20 bg-dark-bg border-t border-dark-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-text mb-4">Ready to Try?</h2>
          <p className="text-dark-muted text-lg mb-8">
            Load sample aerial images and experiment with all 5 fusion algorithms instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleTrySamples} className="text-base">
              <Eye className="w-5 h-5" /> Load Sample Images & Launch
            </Button>
            <Link to="/docs">
              <Button size="lg" variant="outline" className="text-base w-full">
                Read Documentation <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>



      <Footer />
    </PageWrapper>
  );
}
