// lib/generateMaze.ts

import type { MazeData } from "~/components/MazeGeneratorOutput";
import type { Cell, ColorCode } from "./generateOutput";
import { placeColorCodes, type PlacedColorCode } from "./placeColorCodes";

// Units in millimeters
export const LINE_THICKNESS = 5;
export const PARALLEL_LINES_GAP = 25;
export const COLOR_CODE_WIDTH = 5;
export const COLOR_CODE_GAP = 51;
export const CORNER_INTERSECTION_GAP = 25;
export const SAFE_AREA_DIAMETER = 20;
export const CALIBRATION_CIRCLE_DIAMETER = 39;
export const CURVE_DIAMETER = 25;
export const LINE_SIDE_WHITE_SPACE = 12;
export const ZIGZAG_BACKWALK_COLOR_CODE_GAP = 64;
export const GRID_CELL_SIZE = 5; // in millimeters

export const generateMaze = async (
  usedColorCodes: ColorCode[],
  grid: Cell[][],
  data: Omit<MazeData, "maze">
): Promise<{ grid: Cell[][]; placedColorCodes: PlacedColorCode[] }> => {
  // Place color codes using the separate module
  const { grid: updatedGrid, placedColorCodes } = placeColorCodes(usedColorCodes, grid);
  console.log("🚀 ~ placedColorCodes:", placedColorCodes)
  if (data.mazeType === "ozobot_maze") {
      // TODO: Implement connection logic between color codes with black lines within constraints
    
      // TODO: Add erroneous black lines to fool the user

  }

  // Assign x and y coordinates to each cell (if not already done)
  for (let rowIndex = 0; rowIndex < updatedGrid.length; rowIndex++) {
    const row = updatedGrid[rowIndex];
    if (!row) break;
    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      const cell = row[colIndex];
      if (cell) {
        cell.x = rowIndex;
        cell.y = colIndex;
      }
    }
  }

  return { grid: updatedGrid, placedColorCodes };
};
