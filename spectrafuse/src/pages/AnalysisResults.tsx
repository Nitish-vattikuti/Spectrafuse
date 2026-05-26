import React from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Footer } from '@/components/layout/Footer';
import { useFusionStore } from '@/store/fusionStore';
import { MetricsPanel } from '@/components/analysis/MetricsPanel';
import { DetectionReport } from '@/components/detection/DetectionReport';
import { ExportPanel } from '@/components/export/ExportPanel';
import { FusedImageViewer } from '@/components/viewer/FusedImageViewer';
import { BandHistogram } from '@/components/viewer/BandHistogram';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export function AnalysisResults() {
  const result = useFusionStore((s) => s.result);
  const detectedObjects = useFusionStore((s) => s.detectedObjects);
  const thermalAnomalies = useFusionStore((s) => s.thermalAnomalies);

  if (!result) {
    return (
      <PageWrapper className="pt-24">
        <div className="max-w-4xl mx-auto px-4 text-center py-20">
          <h1 className="text-2xl font-bold text-dark-text mb-4">No Analysis Results</h1>
          <p className="text-dark-muted mb-6">Run a fusion in the workbench first to see detailed results.</p>
          <Link to="/workbench">
            <Button><ArrowLeft className="w-4 h-4" /> Go to Workbench</Button>
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/workbench">
            <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /> Back</Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-dark-text">Analysis Results</h1>
            <p className="text-sm text-dark-muted">
              Algorithm: {result.algorithm.toUpperCase()} | Processed: {result.timestamp.toLocaleString()} | Time: {result.processingTimeMs}ms
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <FusedImageViewer imageData={result.imageData} overlayDetections={detectedObjects} overlayAnomalies={thermalAnomalies} />
            <BandHistogram imageData={result.imageData} isRGB />
          </div>
          <div className="space-y-6">
            <MetricsPanel />
            <DetectionReport />
            <ExportPanel />
          </div>
        </div>
      </div>
      <Footer />
    </PageWrapper>
  );
}
