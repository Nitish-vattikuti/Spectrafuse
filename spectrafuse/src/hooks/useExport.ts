import { useCallback } from 'react';
import { useFusionStore } from '@/store/fusionStore';
import { exportAsPng, exportAsJpeg } from '@/lib/image/exporter';

export function useExport() {
  const result = useFusionStore((s) => s.result);
  const metrics = useFusionStore((s) => s.metrics);
  const detectedObjects = useFusionStore((s) => s.detectedObjects);
  const thermalAnomalies = useFusionStore((s) => s.thermalAnomalies);

  const downloadPng = useCallback(async () => {
    if (!result) return;
    await exportAsPng(result.imageData, result.algorithm);
  }, [result]);

  const downloadJpeg = useCallback(async () => {
    if (!result) return;
    await exportAsJpeg(result.imageData, result.algorithm);
  }, [result]);

  const downloadReport = useCallback(async () => {
    if (!result) return;
    try {
      const { default: jsPDF } = await import('jspdf');
      await import('jspdf-autotable');

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Header
      doc.setFontSize(22);
      doc.setTextColor(14, 165, 233);
      doc.text('SpectraFuse', 14, 20);
      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184);
      doc.text('Multi-Spectral Image Fusion Report', 14, 28);

      // Line
      doc.setDrawColor(51, 65, 85);
      doc.line(14, 32, pageWidth - 14, 32);

      // Metadata
      doc.setFontSize(12);
      doc.setTextColor(241, 245, 249);
      doc.text('Fusion Details', 14, 42);
      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184);
      doc.text(`Algorithm: ${result.algorithm.toUpperCase()}`, 14, 50);
      doc.text(`Date: ${result.timestamp.toLocaleString()}`, 14, 56);
      doc.text(`Processing Time: ${result.processingTimeMs}ms`, 14, 62);

      // Add fused image
      const canvas = document.createElement('canvas');
      canvas.width = result.imageData.width;
      canvas.height = result.imageData.height;
      canvas.getContext('2d')!.putImageData(result.imageData, 0, 0);
      const imgUrl = canvas.toDataURL('image/jpeg', 0.85);
      const imgW = pageWidth - 28;
      const imgH = (result.imageData.height / result.imageData.width) * imgW;
      doc.addImage(imgUrl, 'JPEG', 14, 70, imgW, Math.min(imgH, 100));

      const yAfterImg = 70 + Math.min(imgH, 100) + 10;

      // Metrics
      if (metrics) {
        doc.setFontSize(12);
        doc.setTextColor(241, 245, 249);
        doc.text('Quality Metrics', 14, yAfterImg);

        (doc as unknown as { autoTable: (opts: unknown) => void }).autoTable({
          startY: yAfterImg + 4,
          head: [['Metric', 'Value', 'Interpretation']],
          body: [
            ['PSNR', `${metrics.psnr.toFixed(2)} dB`, metrics.psnr > 35 ? 'Excellent' : metrics.psnr > 28 ? 'Good' : 'Fair'],
            ['SSIM', metrics.ssim.toFixed(4), metrics.ssim > 0.85 ? 'Excellent' : metrics.ssim > 0.7 ? 'Good' : 'Fair'],
            ['Entropy', `${metrics.entropy.toFixed(2)} bits`, metrics.entropy > 6 ? 'High info' : 'Moderate'],
          ],
          theme: 'grid',
          headStyles: { fillColor: [14, 165, 233] },
        });
      }

      // Detections
      if (detectedObjects.length > 0) {
        doc.addPage();
        doc.setFontSize(12);
        doc.text('Detected Objects', 14, 20);

        (doc as unknown as { autoTable: (opts: unknown) => void }).autoTable({
          startY: 26,
          head: [['Label', 'Confidence', 'Position (x, y)', 'Size (w × h)']],
          body: detectedObjects.map(d => [
            d.label,
            `${(d.confidence * 100).toFixed(1)}%`,
            `${Math.round(d.bbox[0])}, ${Math.round(d.bbox[1])}`,
            `${Math.round(d.bbox[2])} × ${Math.round(d.bbox[3])}`,
          ]),
          theme: 'grid',
          headStyles: { fillColor: [99, 102, 241] },
        });
      }

      // Thermal anomalies
      if (thermalAnomalies.length > 0) {
        const lastY = detectedObjects.length > 0 ? 80 : 20;
        if (detectedObjects.length === 0) doc.addPage();
        doc.setFontSize(12);
        doc.text('Thermal Anomalies', 14, lastY);

        (doc as unknown as { autoTable: (opts: unknown) => void }).autoTable({
          startY: lastY + 6,
          head: [['ID', 'Position', 'Size', 'Peak Intensity', 'Area (px)']],
          body: thermalAnomalies.map(a => [
            a.id,
            `${a.x}, ${a.y}`,
            `${a.width} × ${a.height}`,
            a.peakIntensity.toFixed(1),
            a.area.toString(),
          ]),
          theme: 'grid',
          headStyles: { fillColor: [249, 115, 22] },
        });
      }

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text('SpectraFuse — Advanced Image Fusion Platform', 14, doc.internal.pageSize.getHeight() - 10);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 40, doc.internal.pageSize.getHeight() - 10);
      }

      const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      doc.save(`spectrafuse_report_${ts}.pdf`);
    } catch (err) {
      console.error('Report generation failed:', err);
    }
  }, [result, metrics, detectedObjects, thermalAnomalies]);

  return { downloadPng, downloadJpeg, downloadReport };
}
