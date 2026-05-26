# 🛰️ SpectraFuse

> **Multi-Spectral Image Fusion for Airborne Surveillance**
> 
> *A client-side browser application engineered for the Centre for Airborne Systems (DRDO CABS) to fuse, analyze, and process IR, visible, and NIR imagery from Electro-Optical (EO) payloads.*

---

## ⚡ Features

### 1. Multi-Band Fusion Algorithms
Easily merge Visible, Near-Infrared (NIR), and Thermal Infrared (TIR) images using 5 sophisticated mathematical fusion techniques:
*   **Discrete Wavelet Transform (DWT):** Multi-resolution Haar wavelet decomposition with configurable high/low-frequency fusion rules. Best for edge and detail preservation.
*   **Principal Component Analysis (PCA):** Projects bands onto principal components, replacing the first component with thermal data. Best for statistical independence and variance.
*   **Brovey Transform:** A powerful Pan-sharpening method that injects thermal data while perfectly preserving spectral and color ratios.
*   **Intensity-Hue-Saturation (IHS):** Replaces the intensity channel with thermal data, preserving exact color hues for highly natural-looking fusions.
*   **Weighted Mean:** A fast, adjustable pixel-averaging algorithm for establishing baselines.

### 2. Deep Learning Object Detection (Aerial Focus)
Leverages TensorFlow.js (COCO-SSD) executing entirely in the browser to detect key tactical and transport assets (vehicles, airplanes, boats) with customizable confidence thresholds to prevent false positives in high-altitude imagery.

### 3. Thermal Anomaly Detection
Uses advanced statistical sigma-thresholding and a 3x3 box-blur noise reduction algorithm on the thermal bands to accurately locate heat signatures, hot spots, and tactical anomalies.

### 4. Advanced Analytics & Quality Metrics
Real-time mathematical breakdown of your fusion quality:
*   **PSNR (Peak Signal-to-Noise Ratio)**
*   **SSIM (Structural Similarity Index)**
*   **Shannon Entropy**
*   *Includes automated letter grading (A+ to F) based on combined metric performance.*

### 5. False-Color Mapping
Apply Jet, Inferno, or Viridis colormaps dynamically to thermal data for rapid, intuitive heat visualization before or after fusion.

---

## 🛠️ Technical Architecture

*   **Frontend Framework:** React 18 with Vite
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (Tactical Deep Orange & Pure Black UI)
*   **Machine Learning:** TensorFlow.js (`@tensorflow/tfjs`, `@tensorflow-models/coco-ssd`)
*   **State Management:** Zustand
*   **Export/Reporting:** `jspdf`, `file-saver`
*   **Data Visualization:** Recharts

*Because this application runs entirely client-side, your classified/sensitive images are never uploaded to an external server.*

---

## 🚀 Quick Start (Local Development)

To run SpectraFuse locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Nitish-vattikuti/Spectrafuse.git
   cd Spectrafuse
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:5173`

---

## 🌍 Deployment

SpectraFuse includes a `netlify.toml` file, making it instantly ready to deploy on **Netlify** or **Render**.

### Deploying to Netlify (Recommended)
1. Push your code to GitHub.
2. Log into [Netlify](https://www.netlify.com/).
3. Click **Add new site** > **Import an existing project**.
4. Select this GitHub repository.
5. Netlify will automatically detect the settings from `netlify.toml` (`npm run build` and `dist` folder).
6. Click **Deploy site**.

### Deploying to Render
1. Log into [Render](https://render.com/).
2. Create a new **Static Site**.
3. Connect this GitHub repository.
4. Set the **Build Command** to `npm run build` and **Publish Directory** to `dist`.
5. *Important:* Add a Redirect/Rewrite rule under the site settings to redirect `/*` to `/index.html` (Status 200) to support React Router.

---

## 🛡️ License

Built for **DRDO CABS**.
