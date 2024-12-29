// lib/placeColorCodes.ts

import {
  COLOR_CODE_GAP,
  type Direction,
  directions,
  GRID_CELL_SIZE,
  LINE_SIDE_WHITE_SPACE,
} from "./generateMaze";
import { COLORS, type Cell, type ColorCode } from "./generateOutput";

// Units in grid cells
export const PERPENDICULAR_PADDING_CELLS = 7;
export const MIN_EDGE_DISTANCE = 3;

// Define the structure to save placed color code coordinates
export type PlacedColorCode = {
  name: string;
  direction: Direction;
  coordinates: { x: number; y: number }[];
};

export type AbsolutePosition = {
  x: number;
  y: number;
  type: "color" | "padding";
};

export const placeColorCodes = (
  usedColorCodes: ColorCode[],
  grid: Cell[][]
): {
  grid: Cell[][];
  placedColorCodes: PlacedColorCode[];
  failedToPlaceColorCodes: string[];
} => {
  // Helper constants in terms of grid cells
  const MIN_DISTANCE_BETWEEN_COLOR_CODES = Math.ceil(COLOR_CODE_GAP / GRID_CELL_SIZE); // 11 cells
  // const MIN_WHITE_SPACE = Math.ceil(LINE_SIDE_WHITE_SPACE / GRID_CELL_SIZE); // 3 cells
  const MIN_WHITE_SPACE = 0
  const MAX_PLACEMENT_ATTEMPTS = 10000;

  // Keep track of placed color code positions
  const placedPositions: { x: number; y: number }[] = [];

  // Keep track of placed color codes with their coordinates
  const placedColorCodes: PlacedColorCode[] = [];

  const failedToPlaceColorCodes: string[] = [];

  // -------- Helper Functions --------

  const isValidCell = (x: number, y: number, grid: Cell[][]): boolean => {
    // Make sure x and y are within the grid's bounds
    if (
      x < MIN_WHITE_SPACE + MIN_EDGE_DISTANCE ||
      y < MIN_WHITE_SPACE + MIN_EDGE_DISTANCE
    )
      return false;
    if (
      x >= grid.length - MIN_WHITE_SPACE - MIN_EDGE_DISTANCE ||
      (grid[0] && y >= grid[0].length - MIN_WHITE_SPACE - MIN_EDGE_DISTANCE)
    )
      return false;

    // Ensure the cell is not already occupied
    if (grid[x]?.[y]?.color) return false;

    return true;
  };

  const isValidColorCodePlacement = (
    positions: { x: number; y: number }[]
  ): boolean => {
    for (const pos of positions) {
      for (const placedPos of placedPositions) {
        const dx = placedPos.x - pos.x;
        const dy = placedPos.y - pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < MIN_DISTANCE_BETWEEN_COLOR_CODES) {
          return false;
        }
      }
    }
    return true;
  };

  const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const getAbsolutePositions = (
    originX: number,
    originY: number,
    direction: Direction
  ): AbsolutePosition[] => {
    const positions: AbsolutePosition[] = [];
    for (let i = 0; i < 3; i++) {
      switch (direction) {
        case "top_to_bottom":
          positions.push({ x: originX + i, y: originY, type: "color" });
          break;
        case "bottom_to_top":
          positions.push({ x: originX - i, y: originY, type: "color" });
          break;
        case "left_to_right":
          positions.push({ x: originX, y: originY + i, type: "color" });
          break;
        case "right_to_left":
          positions.push({ x: originX, y: originY - i, type: "color" });
          break;
      }
    }
    return positions;
  };

  function addPaddingToColorCode(
    absolutePositions: AbsolutePosition[],
    direction: Direction
  ): AbsolutePosition[] {
    const startCoords = absolutePositions[0];
    const endCoords = absolutePositions[absolutePositions.length - 1];

    const frontPadding: AbsolutePosition[] = [];
    const endPadding: AbsolutePosition[] = [];

    for (let offset = 1; offset <= PERPENDICULAR_PADDING_CELLS; offset++) {
      if (!startCoords || !endCoords) continue;

      switch (direction) {
        case "top_to_bottom":
          frontPadding.push({
            x: endCoords.x + offset,
            y: endCoords.y,
            type: "padding",
          });
          endPadding.push({
            x: startCoords.x - offset,
            y: startCoords.y,
            type: "padding",
          });
          break;
        case "bottom_to_top":
          frontPadding.push({
            x: endCoords.x - offset,
            y: endCoords.y,
            type: "padding",
          });
          endPadding.push({
            x: startCoords.x + offset,
            y: startCoords.y,
            type: "padding",
          });
          break;
        case "left_to_right":
          frontPadding.push({
            x: endCoords.x,
            y: endCoords.y + offset,
            type: "padding",
          });
          endPadding.push({
            x: startCoords.x,
            y: startCoords.y - offset,
            type: "padding",
          });
          break;
        case "right_to_left":
          frontPadding.push({
            x: endCoords.x,
            y: endCoords.y - offset,
            type: "padding",
          });
          endPadding.push({
            x: startCoords.x,
            y: startCoords.y + offset,
            type: "padding",
          });
          break;
      }
    }

    return [...frontPadding, ...absolutePositions, ...endPadding];
  }

  // -------- Main Placement Logic --------

  for (const colorCode of usedColorCodes) {
    const quantity = colorCode.quantity ?? 1; // Default to 1 if quantity is undefined

    for (let q = 0; q < quantity; q++) {
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < MAX_PLACEMENT_ATTEMPTS) {
        // 1. Generate a random starting position somewhere in the grid
        const originX = getRandomInt(
          MIN_WHITE_SPACE + MIN_EDGE_DISTANCE,
          grid.length - MIN_WHITE_SPACE - MIN_EDGE_DISTANCE
        );
        const originY = getRandomInt(
          MIN_WHITE_SPACE + MIN_EDGE_DISTANCE,
          (grid[0]?.length ?? 0) - MIN_WHITE_SPACE - MIN_EDGE_DISTANCE
        );

        // 2. Try ALL directions for this (originX, originY).
        for (const direction of directions) {
          // Construct positions in this direction
          let absolutePositions = getAbsolutePositions(originX, originY, direction);
          absolutePositions = addPaddingToColorCode(absolutePositions, direction);

          // Check if all positions are valid cells
          const allValid = absolutePositions.every((pos) =>
            isValidCell(pos.x, pos.y, grid)
          );

          // Check distance constraints
          const distanceValid = isValidColorCodePlacement(absolutePositions);

          if (allValid && distanceValid) {
            // Place the color code
            let colorIndex = 0;
            absolutePositions.forEach((pos) => {
              if (pos.type === "color") {
                grid[pos.x]![pos.y]!.color = colorCode.colors[colorIndex];
                colorIndex++;
              } else if (pos.type === "padding") {
                grid[pos.x]![pos.y]!.color = COLORS.black;
              }
              placedPositions.push({ x: pos.x, y: pos.y });
            });

            // Save the placement
            placedColorCodes.push({
              name: colorCode.name,
              direction,
              coordinates: absolutePositions.map((pos) => ({
                x: pos.x,
                y: pos.y,
              })),
            });

            placed = true;
            break; // No need to check other directions once placed
          }
        }

        attempts++;
      }

      if (!placed) {
        console.warn(
          `Could not place color code: ${colorCode.name} (Instance ${
            q + 1
          }/${quantity}) after ${MAX_PLACEMENT_ATTEMPTS} attempts`
        );
        failedToPlaceColorCodes.push(colorCode.name);
      }
    }
  }

  return { grid, placedColorCodes, failedToPlaceColorCodes };
};
