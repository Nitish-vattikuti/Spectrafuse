export type BandType = 'visible' | 'nir' | 'thermal';

export interface ImageBand {
  file: File;
  url: string;
  imageData: ImageData;
  width: number;
  height: number;
  channels: 1 | 3 | 4;
  bandType: BandType;
}

export interface PixelMatrix {
  data: Float64Array;
  width: number;
  height: number;
  channels: number;
}
