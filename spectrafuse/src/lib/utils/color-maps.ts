// Full 256-entry colormap lookup tables
// Each entry is [R, G, B]

function interpolateLUT(stops: [number, [number, number, number]][]): [number, number, number][] {
  const lut: [number, number, number][] = new Array(256);
  for (let i = 0; i < 256; i++) {
    let lower = stops[0];
    let upper = stops[stops.length - 1];
    for (let s = 0; s < stops.length - 1; s++) {
      if (i >= stops[s][0] && i <= stops[s + 1][0]) {
        lower = stops[s];
        upper = stops[s + 1];
        break;
      }
    }
    const range = upper[0] - lower[0] || 1;
    const t = (i - lower[0]) / range;
    lut[i] = [
      Math.round(lower[1][0] + t * (upper[1][0] - lower[1][0])),
      Math.round(lower[1][1] + t * (upper[1][1] - lower[1][1])),
      Math.round(lower[1][2] + t * (upper[1][2] - lower[1][2])),
    ];
  }
  return lut;
}

const JET_STOPS: [number, [number, number, number]][] = [
  [0, [0, 0, 127]],
  [32, [0, 0, 255]],
  [64, [0, 127, 255]],
  [96, [0, 255, 255]],
  [128, [127, 255, 127]],
  [160, [255, 255, 0]],
  [192, [255, 127, 0]],
  [224, [255, 0, 0]],
  [255, [127, 0, 0]],
];

const INFERNO_STOPS: [number, [number, number, number]][] = [
  [0, [0, 0, 4]],
  [32, [40, 11, 84]],
  [64, [101, 21, 110]],
  [96, [159, 42, 99]],
  [128, [212, 72, 66]],
  [160, [245, 125, 21]],
  [192, [250, 181, 24]],
  [224, [246, 232, 82]],
  [255, [252, 255, 164]],
];

const VIRIDIS_STOPS: [number, [number, number, number]][] = [
  [0, [68, 1, 84]],
  [32, [72, 35, 116]],
  [64, [64, 67, 135]],
  [96, [52, 94, 141]],
  [128, [33, 145, 140]],
  [160, [44, 175, 100]],
  [192, [94, 201, 68]],
  [224, [175, 222, 36]],
  [255, [253, 231, 37]],
];

export const JET_LUT = interpolateLUT(JET_STOPS);
export const INFERNO_LUT = interpolateLUT(INFERNO_STOPS);
export const VIRIDIS_LUT = interpolateLUT(VIRIDIS_STOPS);

export type ColormapName = 'jet' | 'inferno' | 'viridis';

export function getColormap(name: ColormapName): [number, number, number][] {
  switch (name) {
    case 'jet': return JET_LUT;
    case 'inferno': return INFERNO_LUT;
    case 'viridis': return VIRIDIS_LUT;
    default: return INFERNO_LUT;
  }
}
