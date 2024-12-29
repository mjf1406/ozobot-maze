import type { MazeData } from "~/components/MazeGeneratorOutput";
import type { Cell, ColorCode } from "./generateOutput";
import {
  type AbsolutePosition,
  placeColorCodes,
  type PlacedColorCode
} from "./placeColorCodes";
import {
  connectColorCodes,
  type Coordinates
} from "./connectColorCodes";

// Units in millimeters
export const LINE_THICKNESS = 5;
export const PARALLEL_LINES_GAP = 25;
export const COLOR_CODE_WIDTH = 5;
export const COLOR_CODE_GAP = 36;
export const CORNER_INTERSECTION_GAP = 25;
export const SAFE_AREA_DIAMETER = 20;
export const CALIBRATION_CIRCLE_DIAMETER = 39;
export const CURVE_DIAMETER = 25;
export const LINE_SIDE_WHITE_SPACE = 12;
export const ZIGZAG_BACKWALK_COLOR_CODE_GAP = 64;
export const GRID_CELL_SIZE = 6; // in millimeters

export type Direction =
  | "top_to_bottom"
  | "bottom_to_top"
  | "left_to_right"
  | "right_to_left";
export const directions: Direction[] = [
  "top_to_bottom",
  "bottom_to_top",
  "left_to_right",
  "right_to_left"
];

export function sortCoordinatesArray(
  coordinates: Coordinates[] | AbsolutePosition[]
): Coordinates[] | AbsolutePosition[] {
  if (coordinates.length <= 1) return coordinates;
  let coordToSortBy: "x" | "y" = "x"; // Default to x
  if (
    coordinates[0] &&
    coordinates[1] &&
    coordinates[0].x !== coordinates[1].x
  ) {
    coordToSortBy = "x";
  } else if (
    coordinates[0] &&
    coordinates[1] &&
    coordinates[0].y !== coordinates[1].y
  ) {
    coordToSortBy = "y";
  }
  return [...coordinates].sort((a, b) => a[coordToSortBy] - b[coordToSortBy]);
}

interface GenerateMazeReturn {
  grid: Cell[][];
  placedColorCodes: PlacedColorCode[];
  failedToPlaceColorCodes: string[];
}

export const generateMaze = async (
  usedColorCodes: ColorCode[],
  originalGrid: Cell[][],
  data: Omit<MazeData, "maze">,
  maxRetries = 3
): Promise<GenerateMazeReturn> => {
  // We will store the best result across attempts.
  let bestResult = placeColorCodes(usedColorCodes, originalGrid);

  for (let i = 0; i < maxRetries; i++) {
    // For each attempt, clone the grid or create a fresh one
    const gridClone = originalGrid.map(row => row.map(cell => ({ ...cell })));

    // Try to place color codes
    const {
      grid: updatedGrid,
      placedColorCodes,
      failedToPlaceColorCodes
    } = placeColorCodes(usedColorCodes, gridClone);

    // If this attempt is strictly better (fewer failures), update bestResult
    if (
      failedToPlaceColorCodes.length < bestResult.failedToPlaceColorCodes.length
    ) {
      bestResult = {
        grid: updatedGrid,
        placedColorCodes,
        failedToPlaceColorCodes
      };
    }

    // If there are no failures, we can stop looking — it's perfect
    if (failedToPlaceColorCodes.length === 0) {
      break;
    }
  }

  // If we are generating an "ozobot_maze", attempt to connect color codes
  if (data.mazeType === "ozobot_maze") {
    // Connect the color codes using black lines or other logic
    const connectedGrid = connectColorCodes(
      bestResult.grid,
      bestResult.placedColorCodes
    );
    bestResult = {
      ...bestResult,
      grid: connectedGrid
    };

    /*
      TODO: Additional constraints or rules:
        - [ ] 25mm between parallel tracks
        - [ ] 51mm min between color codes
        - [ ] 25mm from a corner/intersection before the next corner/intersection/color code
        - [ ] Safe area with diameter of 20mm at line ends
        - [ ] At least 12mm white space on each side of a line
        - [ ] Corner minimum angle is 90deg
    */
  }

  console.log("🚀 ~ bestResult:", bestResult)
  return bestResult;
};
