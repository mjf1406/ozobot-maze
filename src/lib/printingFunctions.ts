import { CALIBRATION_CIRCLE_DIAMETER, COLOR_CODE_GAP, COLOR_CODE_WIDTH, CORNER_INTERSECTION_GAP, CURVE_DIAMETER, LINE_SIDE_WHITE_SPACE, LINE_THICKNESS, PARALLEL_LINES_GAP, SAFE_AREA_DIAMETER, ZIGZAG_BACKWALK_COLOR_CODE_GAP } from "./generateMaze";

type PaperSize = 'A4' | 'A3' | 'Letter' | 'Legal';

type PaperDimensions = {
  width: number;
  height: number;
};

type Dimensions = {
  mm: PaperDimensions;
  pixels: PaperDimensions;
};

type ScalingObject = {
  paperSize: PaperSize;
  dpi: number;
  dimensions: Dimensions;
  LINE_THICKNESS: number;
  PARALLEL_LINES_GAP: number;
  COLOR_CODE_WIDTH: number;
  COLOR_CODE_GAP: number;
  CORNER_INTERSECTION_GAP: number;
  SAFE_AREA_DIAMETER: number;
  CALIBRATION_CIRCLE_DIAMETER: number;
  CURVE_DIAMETER: number;
  LINE_SIDE_WHITE_SPACE: number;
  ZIGZAG_BACKWALK_COLOR_CODE_GAP: number;
};

const PAPER_SIZES: Record<PaperSize, PaperDimensions> = {
  'A4': { width: 210, height: 297 },
  'A3': { width: 297, height: 420 },
  'Letter': { width: 215.9, height: 279.4 },
  'Legal': { width: 215.9, height: 355.6 }
};

const DPI = {
  SCREEN: 72,
  PRINT_LOW: 150,
  PRINT_MEDIUM: 300,
  PRINT_HIGH: 600
} as const;

type DPIValue = typeof DPI[keyof typeof DPI];

const mmToPixels = (mm: number, dpi: DPIValue = DPI.PRINT_MEDIUM): number => {
  const inchesToMM = 25.4;
  return Math.round((mm / inchesToMM) * dpi);
};

const createScalingObject = (paperSize: PaperSize, dpi: DPIValue = DPI.PRINT_MEDIUM): ScalingObject => {
  const dimensions = PAPER_SIZES[paperSize];
  if (!dimensions) {
    throw new Error(`Unsupported paper size: ${paperSize}`);
  }

  return {
    paperSize,
    dpi,
    dimensions: {
      mm: { ...dimensions },
      pixels: {
        width: mmToPixels(dimensions.width, dpi),
        height: mmToPixels(dimensions.height, dpi)
      }
    },
    LINE_THICKNESS: mmToPixels(LINE_THICKNESS, dpi),
    PARALLEL_LINES_GAP: mmToPixels(PARALLEL_LINES_GAP, dpi),
    COLOR_CODE_WIDTH: mmToPixels(COLOR_CODE_WIDTH, dpi),
    COLOR_CODE_GAP: mmToPixels(COLOR_CODE_GAP, dpi),
    CORNER_INTERSECTION_GAP: mmToPixels(CORNER_INTERSECTION_GAP, dpi),
    SAFE_AREA_DIAMETER: mmToPixels(SAFE_AREA_DIAMETER, dpi),
    CALIBRATION_CIRCLE_DIAMETER: mmToPixels(CALIBRATION_CIRCLE_DIAMETER, dpi),
    CURVE_DIAMETER: mmToPixels(CURVE_DIAMETER, dpi),
    LINE_SIDE_WHITE_SPACE: mmToPixels(LINE_SIDE_WHITE_SPACE, dpi),
    ZIGZAG_BACKWALK_COLOR_CODE_GAP: mmToPixels(ZIGZAG_BACKWALK_COLOR_CODE_GAP, dpi)
  };
};

export {
  PAPER_SIZES,
  DPI,
  mmToPixels,
  createScalingObject,
  type PaperSize,
  type PaperDimensions,
  type ScalingObject,
  type DPIValue
};