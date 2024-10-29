// lib/generateMaze.ts

import type { MazeData } from "~/components/MazeGeneratorOutput";
import type { Cell, ColorCode } from "./generateOutput";
import { type AbsolutePosition, placeColorCodes, type PlacedColorCode } from "./placeColorCodes";
import { connectColorCodes, type Coordinates } from "./connectColorCodes";

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

export function sortCoordinatesArray(coordinates: Coordinates[] | AbsolutePosition[]): Coordinates[] | AbsolutePosition[] {
  if (coordinates.length <= 1) return coordinates;
  let coordToSortBy: 'x' | 'y' = 'x';  // Default to x
  if ( coordinates[0] && coordinates[1] && coordinates[0].x !== coordinates[1].x ) {
      coordToSortBy = 'x';
  } else if ( coordinates[0] && coordinates[1] &&  coordinates[0].y !== coordinates[1].y ) {
      coordToSortBy = 'y';
  }
  return [...coordinates].sort((a, b) => a[coordToSortBy] - b[coordToSortBy]);
}

export const generateMaze = async (
  usedColorCodes: ColorCode[],
  grid: Cell[][],
  data: Omit<MazeData, "maze">
): Promise<{ grid: Cell[][]; placedColorCodes: PlacedColorCode[] }> => {
  const { grid: updatedGrid, placedColorCodes } = placeColorCodes(usedColorCodes, grid);

  if (data.mazeType === "ozobot_maze") {
    // TODO: Implement connection logic between color codes with black lines within constraints
    // const grid = connectColorCodes(gridThree, placedColorCodesTwo)
    const grid = connectColorCodes(updatedGrid, placedColorCodes)
      
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

  return { grid: updatedGrid, placedColorCodes };
};