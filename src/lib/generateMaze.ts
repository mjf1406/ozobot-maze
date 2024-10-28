// lib/generateMaze.ts

import type { MazeData } from "~/components/MazeGeneratorOutput";
import type { Cell, ColorCode } from "./generateOutput";
import { placeColorCodes, type PlacedColorCode } from "./placeColorCodes";
import { colorManhattanPath, connectColorCodes, type Coordinates } from "./connectColorCodes";

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
export const GRID_CELL_SIZE = 6; // in millimeters

export type Direction = 'top_to_bottom' | 'bottom_to_top' | 'left_to_right' | 'right_to_left';
export const directions: Direction[] = ['top_to_bottom', 'bottom_to_top', 'left_to_right', 'right_to_left'];

function addPaddingToColorCode(colorCodeStart: PlacedColorCode): { path: Coordinates[], colorCodeStartUpdated: PlacedColorCode } | undefined {
  const path: Coordinates[] = [];
  const startCoords1 = colorCodeStart.coordinates[0] 
  const startCoords = colorCodeStart.coordinates[colorCodeStart.coordinates.length - 1]
  const startDirection = colorCodeStart.direction

  const frontPadding: Coordinates[] = [];
  const endPadding: Coordinates[] = [];

  const safety = [1, 2, 3, 4, 5, 6, 7]
  for (const offset of safety) {
      if (!startCoords || !startCoords1 ) continue
      switch (startDirection) {
          case 'top_to_bottom':
              frontPadding.push({ y: startCoords?.x + offset, x: startCoords?.y })
              endPadding.push({ y: startCoords1?.x - offset, x: startCoords1?.y })
              break;
          case 'bottom_to_top':
              frontPadding.push({ y: startCoords?.x - offset, x: startCoords?.y })
              endPadding.push({ y: startCoords1?.x + offset, x: startCoords1?.y })
              break;
          case 'left_to_right':
              frontPadding.push({ y: startCoords?.x, x: startCoords?.y + offset})
              endPadding.push({ y: startCoords1?.x, x: startCoords1?.y - offset})
              break;
          case 'right_to_left':
              frontPadding.push({ y: startCoords?.x, x: startCoords?.y - offset})
              endPadding.push({ y: startCoords1?.x, x: startCoords1?.y + offset})
              break;
        }
  }

  path.push(
    ...frontPadding,
    ...endPadding
  )

  colorCodeStart.coordinates = [
    ...frontPadding, 
    ...colorCodeStart.coordinates, 
    ...endPadding
  ]

  return { path, colorCodeStartUpdated: colorCodeStart};
}

function addPaddingToColorCodes(placedColorCodes: PlacedColorCode[], grid: Cell[][]): {
  grid: Cell[][];
  placedColorCodes: PlacedColorCode[];
} {
  const updatedColorCodes: PlacedColorCode[] = [];

  for (const colorCode of placedColorCodes) {
    const result = addPaddingToColorCode(colorCode);
    
    if (result) {
      const { path, colorCodeStartUpdated } = result;
      colorManhattanPath(grid, path);
      updatedColorCodes.push(colorCodeStartUpdated);
    } else {
      updatedColorCodes.push(colorCode);
    }
  }

  return {
    grid,
    placedColorCodes: updatedColorCodes
  };
}

export const generateMaze = async (
  usedColorCodes: ColorCode[],
  grid: Cell[][],
  data: Omit<MazeData, "maze">
): Promise<{ grid: Cell[][]; placedColorCodes: PlacedColorCode[] }> => {
  // Place color codes using the separate module
  const { grid: updatedGrid, placedColorCodes } = placeColorCodes(usedColorCodes, grid);
  const { grid: gridThree, placedColorCodes: placedColorCodesTwo } = addPaddingToColorCodes(placedColorCodes, updatedGrid)

  if (data.mazeType === "ozobot_maze") {
    // TODO: Implement connection logic between color codes with black lines within constraints
    const grid = connectColorCodes(gridThree, placedColorCodesTwo)
      
    /*
    TODO: Add erroneous black lines to fool the user
      - [ ] at least 25mm between any parallel tracks
      - [ ] At least 51mm between color codes
      - [ ] there must be at least 25mm from a corner/intersection before another corner/intersection/color code
      - [ ] line that end in a color must have a safe area with a diameter of 20mm starting from the end of the line
      - [ ] each side of a line must have at least 12mm of white space
      - [ ] corner minimum angel is 90deg
    */

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