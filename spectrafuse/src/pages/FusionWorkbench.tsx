import React, { useState } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { ImageDropzone } from '@/components/upload/ImageDropzone';
import { FusionControls } from '@/components/fusion/FusionControls';
import { ProcessingStatus } from '@/components/fusion/ProcessingStatus';
import { ImageCompareSlider } from '@/components/viewer/ImageCompareSlider';
import { FusedImageViewer } from '@/components/viewer/FusedImageViewer';
import { BandHistogram } from '@/components/viewer/BandHistogram';
import { MetricsPanel } from '@/components/analysis/MetricsPanel';
import { SpectralPlot } from '@/components/analysis/SpectralPlot';
import { TargetDetector } from '@/components/detection/TargetDetector';
import { ThermalAnomalyFinder } from '@/components/detection/ThermalAnomalyFinder';
import { DetectionReport } from '@/components/detection/DetectionReport';
import { ExportPanel } from '@/components/export/ExportPanel';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { useImageStore } from '@/store/imageStore';
import { useFusionStore } from '@/store/fusionStore';
import { useUIStore } from '@/store/uiStore';
import { useFusion } from '@/hooks/useFusion';
import { Play, Trash2, ImageIcon, SplitSquareVertical, Grid3X3, Layers } from 'lucide-react';

export function FusionWorkbench() {
  const visibleBand = useImageStore((s) => s.visibleBand);
  const nirBand = useImageStore((s) => s.nirBand);
  const thermalBand = useImageStore((s) => s.thermalBand);
  const clearAll = useImageStore((s) => s.clearAll);
  const loadSampleImages = useImageStore((s) => s.loadSampleImages);

  const result = useFusionStore((s) => s.result);
  const status = useFusionStore((s) => s.status);
  const detectedObjects = useFusionStore((s) => s.detectedObjects);
  const thermalAnomalies = useFusionStore((s) => s.thermalAnomalies);
  const reset = useFusionStore((s) => s.reset);

  const viewMode = useUIStore((s) => s.viewMode);
  const setViewMode = useUIStore((s) => s.setViewMode);

  const { runFusion } = useFusion();
  const [showLeftPanel, setShowLeftPanel] = useState(true);

  const hasBands = !!(visibleBand || nirBand || thermalBand);

  const handleClear = () => {
    clearAll();
    reset();
  };

  return (
    <PageWrapper className="pt-16">
      <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT PANEL: Upload + Controls */}
        <div className={`${showLeftPanel ? 'w-full lg:w-[300px]' : 'w-0 overflow-hidden'} flex-shrink-0 border-r border-dark-border bg-dark-card/50 overflow-y-auto transition-all`}>
          <div className="p-4 space-y-5">
            {/* Upload Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-dark-text flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" /> Upload Images
                </h3>
                {hasBands && (
                  <button onClick={handleClear} className="text-xs text-dark-muted hover:text-danger transition-colors" aria-label="Clear all images">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <ImageDropzone bandType="visible" label="Visible Band (RGB)" hasImage={!!visibleBand} imageUrl={visibleBand?.url} />
              <ImageDropzone bandType="nir" label="Near-IR Band" hasImage={!!nirBand} imageUrl={nirBand?.url} />
              <ImageDropzone bandType="thermal" label="Thermal IR Band" hasImage={!!thermalBand} imageUrl={thermalBand?.url} />
            </div>

            <div className="border-t border-dark-border" />

            {/* Fusion Controls */}
            <FusionControls />

            <div className="border-t border-dark-border" />

            {/* Action Buttons */}
            <div className="space-y-2">
              <Tooltip content={!hasBands ? 'Upload at least one image to begin' : 'Run fusion algorithm'}>
                <Button
                  onClick={runFusion}
                  disabled={!hasBands || status === 'processing'}
                  className="w-full"
                  size="md"
                >
                  <Play className="w-4 h-4" />
                  {status === 'processing' ? 'Processing...' : 'Run Fusion'}
                </Button>
              </Tooltip>
              <Button
                onClick={async () => { await loadSampleImages(); }}
                variant="ghost"
                size="sm"
                className="w-full"
              >
                <ImageIcon className="w-4 h-4" /> Load Sample Images
              </Button>
            </div>

            <ProcessingStatus />
          </div>
        </div>

        {/* CENTER PANEL: Image Viewer */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-dark-border bg-dark-card/30">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setViewMode('compare')}
                className={`p-1.5 rounded-lg text-sm transition-colors ${viewMode === 'compare' ? 'bg-primary/20 text-primary' : 'text-dark-muted hover:text-dark-text'}`}
                aria-label="Compare view"
                title="Before/After"
              >
                <SplitSquareVertical className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('single')}
                className={`p-1.5 rounded-lg text-sm transition-colors ${viewMode === 'single' ? 'bg-primary/20 text-primary' : 'text-dark-muted hover:text-dark-text'}`}
                aria-label="Single view"
                title="Single"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-sm transition-colors ${viewMode === 'grid' ? 'bg-primary/20 text-primary' : 'text-dark-muted hover:text-dark-text'}`}
                aria-label="Grid view"
                title="Grid"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => setShowLeftPanel(!showLeftPanel)}
              className="lg:hidden p-1.5 rounded-lg text-dark-muted hover:text-dark-text text-xs"
            >
              {showLeftPanel ? 'Hide Panel' : 'Show Panel'}
            </button>
          </div>

          {/* Main Viewer Area */}
          <div className="flex-1 overflow-auto p-4">
            {viewMode === 'compare' && (
              <ImageCompareSlider
                beforeImageData={visibleBand?.imageData || null}
                afterImageData={result?.imageData || null}
              />
            )}
            {viewMode === 'single' && (
              <FusedImageViewer
                imageData={result?.imageData || null}
                overlayDetections={detectedObjects}
                overlayAnomalies={thermalAnomalies}
              />
            )}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-2 gap-3">
                {visibleBand && (
                  <div className="rounded-lg border border-dark-border overflow-hidden">
                    <div className="px-2 py-1 bg-dark-card/80 text-xs text-blue-400 font-medium">Visible</div>
                    <img src={visibleBand.url} alt="Visible band" className="w-full h-auto" />
                  </div>
                )}
                {nirBand && (
                  <div className="rounded-lg border border-dark-border overflow-hidden">
                    <div className="px-2 py-1 bg-dark-card/80 text-xs text-green-400 font-medium">NIR</div>
                    <img src={nirBand.url} alt="NIR band" className="w-full h-auto" />
                  </div>
                )}
                {thermalBand && (
                  <div className="rounded-lg border border-dark-border overflow-hidden">
                    <div className="px-2 py-1 bg-dark-card/80 text-xs text-orange-400 font-medium">Thermal</div>
                    <img src={thermalBand.url} alt="Thermal band" className="w-full h-auto" />
                  </div>
                )}
                {result && (
                  <div className="rounded-lg border border-primary/40 overflow-hidden glow-primary">
                    <div className="px-2 py-1 bg-primary/20 text-xs text-primary font-medium">Fused ({result.algorithm.toUpperCase()})</div>
                    <FusedImageViewer imageData={result.imageData} />
                  </div>
                )}
              </div>
            )}

            {/* Band previews below viewer */}
            {result && viewMode !== 'grid' && (
              <div className="mt-4">
                <BandHistogram imageData={result.imageData} isRGB />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Analysis + Export */}
        <div className="hidden lg:block w-[280px] flex-shrink-0 border-l border-dark-border bg-dark-card/50 overflow-y-auto">
          <div className="p-4 space-y-5">
            {/* Metrics */}
            <MetricsPanel />

            <div className="border-t border-dark-border" />

            {/* Spectral Plot */}
            {result && (
              <>
                <div>
                  <h4 className="text-xs font-medium text-dark-muted uppercase tracking-wider mb-2">Spectral Profile</h4>
                  <SpectralPlot bands={[visibleBand, nirBand, thermalBand]} fusedImageData={result.imageData} />
                </div>
                <div className="border-t border-dark-border" />
              </>
            )}

            {/* Detection */}
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-dark-muted uppercase tracking-wider">🎯 Detection</h4>
              <TargetDetector />
              <ThermalAnomalyFinder />
              <DetectionReport />
            </div>

            <div className="border-t border-dark-border" />

            {/* Export */}
            <ExportPanel />
          </div>
        </div>
      </div>

      {/* Mobile bottom bar for analysis (visible on small screens) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-dark-card border-t border-dark-border p-3 flex items-center gap-2 overflow-x-auto z-30">
        {result && (
          <>
            <div className="text-xs text-dark-muted whitespace-nowrap">
              {useFusionStore.getState().metrics ? `PSNR: ${useFusionStore.getState().metrics!.psnr.toFixed(1)}dB` : ''}
            </div>
            <Button onClick={() => {}} size="sm" variant="outline" className="whitespace-nowrap">
              Export ↓
            </Button>
          </>
        )}
      </div>
    </PageWrapper>
  );
}
