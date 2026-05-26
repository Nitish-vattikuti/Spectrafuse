import React from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BookOpen, Code2, BarChart3, Lightbulb, FileText, ExternalLink } from 'lucide-react';

export function Documentation() {
  return (
    <PageWrapper className="pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-12">
          <Badge variant="primary" className="mb-3">Documentation</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-dark-text mb-4">
            Algorithm & Technical Reference
          </h1>
          <p className="text-lg text-dark-muted">
            Complete documentation of all fusion algorithms, quality metrics, and how to interpret results.
          </p>
        </div>

        {/* Table of Contents */}
        <Card className="mb-12">
          <h2 className="text-lg font-semibold text-dark-text mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" /> Contents
          </h2>
          <nav className="space-y-1">
            {['Introduction to Multi-Spectral Fusion', 'DWT (Discrete Wavelet Transform)', 'PCA (Principal Component Analysis)',
              'Brovey Transform', 'IHS (Intensity-Hue-Saturation)', 'Mean Fusion',
              'Quality Metrics (PSNR, SSIM, Entropy)', 'Thermal Anomaly Detection', 'References'].map((item, i) => (
              <a key={i} href={`#section-${i}`} className="block px-3 py-1.5 rounded text-sm text-dark-muted hover:text-primary hover:bg-primary/10 transition-colors">
                {i + 1}. {item}
              </a>
            ))}
          </nav>
        </Card>

        {/* Section 1: Introduction */}
        <section id="section-0" className="mb-12">
          <h2 className="text-2xl font-bold text-dark-text mb-4 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-primary" /> 1. Introduction to Multi-Spectral Fusion
          </h2>
          <div className="prose prose-invert max-w-none space-y-4 text-dark-muted">
            <p>
              Multi-spectral image fusion combines imagery captured across different wavelength bands into a single
              composite image. In airborne surveillance, electro-optic (EO) payloads simultaneously capture:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-dark-text">Visible Band (RGB)</strong> — 400–700 nm — Standard color imagery</li>
              <li><strong className="text-dark-text">Near-Infrared (NIR)</strong> — 700–1000 nm — Penetrates camouflage, reveals vegetation health</li>
              <li><strong className="text-dark-text">Thermal IR (LWIR)</strong> — 8000–14000 nm — Detects heat signatures from engines, personnel, structures</li>
            </ul>
            <p>
              Fusion combines the strengths of each band: color fidelity from visible, material discrimination from NIR,
              and thermal contrast from IR — producing enhanced imagery for target detection and scene understanding.
            </p>
          </div>
        </section>

        {/* Section 2: DWT */}
        <section id="section-1" className="mb-12">
          <h2 className="text-2xl font-bold text-dark-text mb-4 flex items-center gap-2">
            <Code2 className="w-6 h-6 text-secondary" /> 2. DWT (Discrete Wavelet Transform)
          </h2>
          <Badge variant="secondary" className="mb-3">Best for: Detail Preservation</Badge>
          <div className="space-y-4 text-dark-muted">
            <p>
              DWT decomposes each image into frequency sub-bands using the Haar wavelet. At each decomposition level,
              four sub-bands are produced: LL (approximation), LH (horizontal detail), HL (vertical detail), HH (diagonal detail).
            </p>
            <Card className="bg-dark-bg">
              <h4 className="text-sm font-semibold text-dark-text mb-2">Haar Wavelet (1D)</h4>
              <pre className="text-xs text-primary font-mono overflow-x-auto">
{`Forward:  avg[i] = (s[2i] + s[2i+1]) / √2
          diff[i] = (s[2i] - s[2i+1]) / √2

Inverse:  s[2i]   = (avg[i] + diff[i]) / √2
          s[2i+1] = (avg[i] - diff[i]) / √2

2D DWT: Apply 1D to rows, then to columns.`}
              </pre>
            </Card>
            <Card className="bg-dark-bg">
              <h4 className="text-sm font-semibold text-dark-text mb-2">Fusion Rules</h4>
              <pre className="text-xs text-primary font-mono overflow-x-auto">
{`Approximation (LL): Fused_LL = α × Band1_LL + (1-α) × Band2_LL
Detail (LH,HL,HH):  Fused = max(|Band1_detail|, |Band2_detail|)

• Max rule preserves edges from whichever band has strongest features
• Alpha (α) controls the balance between bands in smooth regions
• Decomposition level (1-5) controls the resolution of analysis`}
              </pre>
            </Card>
            <p><strong className="text-dark-text">Parameters:</strong></p>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li><strong className="text-dark-text">Decomposition Level (1–5):</strong> Higher = more multi-resolution detail but slower</li>
              <li><strong className="text-dark-text">Fusion Rule:</strong> Max (edges), Mean (smooth), Min (conservative)</li>
              <li><strong className="text-dark-text">Alpha (0–1):</strong> Weight for approximation blending</li>
            </ul>
          </div>
        </section>

        {/* Section 3: PCA */}
        <section id="section-2" className="mb-12">
          <h2 className="text-2xl font-bold text-dark-text mb-4">3. PCA (Principal Component Analysis)</h2>
          <Badge variant="secondary" className="mb-3">Best for: Statistical Independence</Badge>
          <div className="space-y-4 text-dark-muted">
            <p>PCA projects multi-band data onto orthogonal principal components ordered by variance.</p>
            <Card className="bg-dark-bg">
              <pre className="text-xs text-primary font-mono overflow-x-auto">
{`1. Stack bands as matrix M (rows=pixels, cols=bands)
2. Compute covariance: Cov = M^T × M / N
3. Eigendecomposition: find eigenvalues & eigenvectors
4. Project: PC = M × eigenvectors
5. Replace PC1 with histogram-matched thermal band
6. Reconstruct: Fused = PC × eigenvectors^(-1)
7. Clamp to [0, 255]`}
              </pre>
            </Card>
            <p>Histogram matching ensures the thermal replacement has the same statistical distribution as the original PC1.</p>
          </div>
        </section>

        {/* Section 4: Brovey */}
        <section id="section-3" className="mb-12">
          <h2 className="text-2xl font-bold text-dark-text mb-4">4. Brovey Transform</h2>
          <Badge variant="secondary" className="mb-3">Best for: Color Sharpening</Badge>
          <div className="space-y-4 text-dark-muted">
            <Card className="bg-dark-bg">
              <pre className="text-xs text-primary font-mono overflow-x-auto">
{`DNF = Thermal / (R + G + B + ε)
Fused_R = R × DNF × scaleFactor
Fused_G = G × DNF × scaleFactor  
Fused_B = B × DNF × scaleFactor
Clamp to [0, 255]

scaleFactor: 0.5–3.0 (default 1.5)`}
              </pre>
            </Card>
            <p>The Digital Number Factor (DNF) injects thermal contrast into each color channel proportionally.</p>
          </div>
        </section>

        {/* Section 5: IHS */}
        <section id="section-4" className="mb-12">
          <h2 className="text-2xl font-bold text-dark-text mb-4">5. IHS (Intensity-Hue-Saturation)</h2>
          <Badge variant="secondary" className="mb-3">Best for: Geometric Accuracy</Badge>
          <div className="space-y-4 text-dark-muted">
            <Card className="bg-dark-bg">
              <pre className="text-xs text-primary font-mono overflow-x-auto">
{`Forward:  I = (R + G + B) / 3
          v1 = (-R - G + 2B) / √6
          v2 = (R - G) / √2
          H = atan2(v2, v1), S = √(v1² + v2²)

Replace I with normalized thermal band

Inverse:  v1 = S × cos(H)
          v2 = S × sin(H)
          R = I - v1/√6 + v2/√2
          G = I - v1/√6 - v2/√2
          B = I + 2v1/√6`}
              </pre>
            </Card>
          </div>
        </section>

        {/* Section 6: Mean */}
        <section id="section-5" className="mb-12">
          <h2 className="text-2xl font-bold text-dark-text mb-4">6. Mean Fusion</h2>
          <Badge variant="secondary" className="mb-3">Best for: Quick Baseline</Badge>
          <div className="space-y-4 text-dark-muted">
            <Card className="bg-dark-bg">
              <pre className="text-xs text-primary font-mono overflow-x-auto">
{`Output[x,y] = Σ(band[i][x,y] × weight[i]) / Σ(weights)

Default: visible=0.5, NIR=0.3, thermal=0.2`}
              </pre>
            </Card>
          </div>
        </section>

        {/* Section 7: Quality Metrics */}
        <section id="section-6" className="mb-12">
          <h2 className="text-2xl font-bold text-dark-text mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-accent" /> 7. Quality Metrics
          </h2>
          <div className="space-y-6">
            <Card className="bg-dark-bg">
              <h4 className="text-sm font-semibold text-dark-text mb-2">PSNR (Peak Signal-to-Noise Ratio)</h4>
              <pre className="text-xs text-primary font-mono mb-2">
{`MSE = (1/N) × Σ(original[i] - fused[i])²
PSNR = 10 × log10(255² / MSE)  [in dB]`}
              </pre>
              <p className="text-xs text-dark-muted">Range: 20–50 dB. Higher = better. &gt;35 dB = excellent.</p>
            </Card>
            <Card className="bg-dark-bg">
              <h4 className="text-sm font-semibold text-dark-text mb-2">SSIM (Structural Similarity Index)</h4>
              <pre className="text-xs text-primary font-mono mb-2">
{`SSIM = (2μxμy + C1)(2σxy + C2) / (μx² + μy² + C1)(σx² + σy² + C2)
C1 = 6.5025, C2 = 58.5225  (8×8 windows)`}
              </pre>
              <p className="text-xs text-dark-muted">Range: -1 to 1. Higher = better. &gt;0.85 = excellent.</p>
            </Card>
            <Card className="bg-dark-bg">
              <h4 className="text-sm font-semibold text-dark-text mb-2">Shannon Entropy</h4>
              <pre className="text-xs text-primary font-mono mb-2">
{`H = -Σ p(i) × log2(p(i))  for histogram bins [0,255]`}
              </pre>
              <p className="text-xs text-dark-muted">Range: 0–8 bits. Higher = more information content.</p>
            </Card>
          </div>
        </section>

        {/* Section 8: Thermal Anomaly */}
        <section id="section-7" className="mb-12">
          <h2 className="text-2xl font-bold text-dark-text mb-4">8. Thermal Anomaly Detection</h2>
          <Card className="bg-dark-bg">
            <pre className="text-xs text-primary font-mono">
{`1. Compute mean (μ) and std deviation (σ) of thermal band
2. Hotspot threshold: pixel > μ + (T × σ)
3. Connected component labeling (4-connected)
4. Filter regions by minimum area (20 pixels)
5. Return bounding boxes with peak intensity

T = 2.0 default (2-sigma rule), adjustable 1.0–4.0`}
            </pre>
          </Card>
        </section>

        {/* Section 9: References */}
        <section id="section-8" className="mb-12">
          <h2 className="text-2xl font-bold text-dark-text mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" /> 9. References
          </h2>
          <div className="space-y-3">
            {[
              { title: 'Pixel-level image fusion: A survey of the state of the art', authors: 'Li, S., Kang, X., Fang, L., et al.', year: '2017', journal: 'Information Fusion, 33, 100-112' },
              { title: 'A wavelet-based image fusion tutorial', authors: 'Pajares, G. & De La Cruz, J. M.', year: '2004', journal: 'Pattern Recognition, 37(9), 1855-1872' },
              { title: 'Comparison of three different methods to merge multiresolution and multispectral data', authors: 'Chavez, P. S., Sides, S. C., & Anderson, J. A.', year: '1991', journal: 'Photogrammetric Engineering & Remote Sensing, 57(3), 295-303' },
              { title: 'Image quality assessment: from error visibility to structural similarity', authors: 'Wang, Z., Bovik, A. C., et al.', year: '2004', journal: 'IEEE Trans. on Image Processing, 13(4), 600-612' },
            ].map((ref, i) => (
              <Card key={i} className="bg-dark-bg">
                <p className="text-sm text-dark-text font-medium">{ref.title}</p>
                <p className="text-xs text-dark-muted mt-1">{ref.authors} ({ref.year}). {ref.journal}</p>
              </Card>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </PageWrapper>
  );
}
