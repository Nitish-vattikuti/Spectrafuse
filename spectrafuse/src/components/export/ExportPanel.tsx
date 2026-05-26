import React from 'react';
import { useExport } from '@/hooks/useExport';
import { useFusionStore } from '@/store/fusionStore';
import { Button } from '@/components/ui/Button';
import { Download, FileText, Image } from 'lucide-react';

export function ExportPanel() {
  const { downloadPng, downloadJpeg, downloadReport } = useExport();
  const result = useFusionStore((s) => s.result);

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-medium text-dark-muted uppercase tracking-wider">📤 Export</h4>
      <div className="space-y-1.5">
        <Button
          onClick={downloadPng}
          disabled={!result}
          variant="outline"
          size="sm"
          className="w-full justify-start"
        >
          <Image className="w-4 h-4" /> Download PNG
        </Button>
        <Button
          onClick={downloadJpeg}
          disabled={!result}
          variant="outline"
          size="sm"
          className="w-full justify-start"
        >
          <Download className="w-4 h-4" /> Download JPEG
        </Button>
        <Button
          onClick={downloadReport}
          disabled={!result}
          variant="outline"
          size="sm"
          className="w-full justify-start"
        >
          <FileText className="w-4 h-4" /> Download Report (PDF)
        </Button>
      </div>
    </div>
  );
}
