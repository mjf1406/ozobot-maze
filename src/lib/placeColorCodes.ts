// lib/placeColorCodes.ts

import { type Direction, directions, GRID_CELL_SIZE } from "./generateMaze";
import { COLORS, type Cell, type ColorCode } from "./generateOutput";

// Units in millimeters
export const COLOR_CODE_GAP = 51;
export const LINE_SIDE_WHITE_SPACE = 12;
export const PERPENDICULAR_PADDING_CELLS = 7

// New constant for minimum distance from the edge in grid cells
export const MIN_EDGE_DISTANCE = 5;

// Define the structure to save placed color code coordinates
export type PlacedColorCode = {
  name: string;
  direction: Direction;
  coordinates: { x: number; y: number }[];
};

export type AbsolutePosition = {
  x: number,
  y: number,
  type: "color" | "padding"
}

export const placeColorCodes = (
  usedColorCodes: ColorCode[],
  grid: Cell[][]
): { grid: Cell[][]; placedColorCodes: PlacedColorCode[], failedToPlaceColorCodes: string[] } => {
  // Helper constants in terms of grid cells
  const MIN_DISTANCE_BETWEEN_COLOR_CODES = Math.ceil(COLOR_CODE_GAP / GRID_CELL_SIZE); // 11 cells
  const MIN_WHITE_SPACE = Math.ceil(LINE_SIDE_WHITE_SPACE / GRID_CELL_SIZE); // 3 cells
  const MAX_PLACEMENT_ATTEMPTS = 10000;

  // Keep track of placed color code positions
  const placedPositions: { x: number; y: number }[] = [];

  // Keep track of placed color codes with their coordinates
  const placedColorCodes: PlacedColorCode[] = [];

  const isValidCell = (x: number, y: number, grid: Cell[][]): boolean => {
    // Ensure the position is within grid bounds considering both white space and edge distance
    if (x < MIN_WHITE_SPACE + MIN_EDGE_DISTANCE || y < MIN_WHITE_SPACE + MIN_EDGE_DISTANCE)
      return false;
    if (x >= grid.length - MIN_WHITE_SPACE - MIN_EDGE_DISTANCE || (grid[0] && y >= grid[0].length - MIN_WHITE_SPACE - MIN_EDGE_DISTANCE))
      return false;

    // Ensure the cell is not already occupied
    if (grid[x]?.[y]?.color) return false; // Non-null assertion

    return true;
  };

  const isValidColorCodePlacement = (positions: { x: number; y: number }[]): boolean => {
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
    return Math.floor(Math.random() * (max - min)) + min;
  };

  const getRandomDirection = (): Direction => {
    return directions[Math.floor(Math.random() * directions.length)]!; // Type assertion
  };

  const getAbsolutePositions = (
    originX: number,
    originY: number,
    direction: Direction
  ): AbsolutePosition[] => {
    const positions: AbsolutePosition[] = [];
    for (let i = 0; i < 3; i++) {
      switch (direction) {
        case 'top_to_bottom':
          positions.push({ x: originX + i, y: originY, type: "color" });
          break;
        case 'bottom_to_top':
          positions.push({ x: originX - i, y: originY, type: "color" });
          break;
        case 'left_to_right':
          positions.push({ x: originX, y: originY + i, type: "color" });
          break;
        case 'right_to_left':
          positions.push({ x: originX, y: originY - i, type: "color" });
          break;
      }
    }
    return positions;
  };

  const failedToPlaceColorCodes: string[] = []

  // Iterate through each ColorCode
  for (const colorCode of usedColorCodes) {
    const quantity = colorCode.quantity ?? 1; // Default to 1 if quantity is undefined

    for (let q = 0; q < quantity; q++) {
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < MAX_PLACEMENT_ATTEMPTS) {
        const direction = getRandomDirection();

        let originX: number;
        let originY = 20;

        // Determine origin based on direction to ensure the color code fits within grid bounds
        switch (direction) {
          case 'top_to_bottom':
            originX = getRandomInt(MIN_WHITE_SPACE + MIN_EDGE_DISTANCE, grid.length - MIN_WHITE_SPACE - MIN_EDGE_DISTANCE - 2); // -2 for three cells
            if (grid[0]) originY = getRandomInt(MIN_WHITE_SPACE + MIN_EDGE_DISTANCE, grid[0].length - MIN_WHITE_SPACE - MIN_EDGE_DISTANCE);
            break;
          case 'bottom_to_top':
            originX = getRandomInt(MIN_WHITE_SPACE + MIN_EDGE_DISTANCE + 2, grid.length - MIN_WHITE_SPACE - MIN_EDGE_DISTANCE); // +2 to ensure space upwards
            if (grid[0]) originY = getRandomInt(MIN_WHITE_SPACE + MIN_EDGE_DISTANCE, grid[0].length - MIN_WHITE_SPACE - MIN_EDGE_DISTANCE);
            break;
          case 'left_to_right':
            originX = getRandomInt(MIN_WHITE_SPACE + MIN_EDGE_DISTANCE, grid.length - MIN_WHITE_SPACE - MIN_EDGE_DISTANCE);
            if (grid[0]) originY = getRandomInt(MIN_WHITE_SPACE + MIN_EDGE_DISTANCE, grid[0].length - MIN_WHITE_SPACE - MIN_EDGE_DISTANCE - 2); // -2 for three cells
            break;
          case 'right_to_left':
            originX = getRandomInt(MIN_WHITE_SPACE + MIN_EDGE_DISTANCE, grid.length - MIN_WHITE_SPACE - MIN_EDGE_DISTANCE);
            if (grid[0]) originY = getRandomInt(MIN_WHITE_SPACE + MIN_EDGE_DISTANCE + 2, grid[0].length - MIN_WHITE_SPACE - MIN_EDGE_DISTANCE); // +2 to ensure space leftwards
            break;
        }

        // Determine absolute positions based on direction
        let absolutePositions: AbsolutePosition[] = getAbsolutePositions(originX, originY, direction);
        absolutePositions = addPaddingToColorCode(absolutePositions, direction)
        
        // Check if all positions are valid
        const allValid = absolutePositions.every(pos => isValidCell(pos.x, pos.y, grid));
        
        // Check distance constraints
        const distanceValid = isValidColorCodePlacement(absolutePositions);
        
        if (allValid && distanceValid) {
          // Place all colors
          let colorIndex = 0;
          absolutePositions.forEach((pos) => {
            if(pos.type === "color") {
              grid[pos.x]![pos.y]!.color = colorCode.colors[colorIndex];
              colorIndex++;
            }
            else if (pos.type === "padding") {
              grid[pos.x]![pos.y]!.color = COLORS.black;
            }
            placedPositions.push({ x: pos.x, y: pos.y });
          });

          // Save the placement coordinates
          placedColorCodes.push({
            name: colorCode.name,
            direction,
            coordinates: absolutePositions.map(pos => ({ x: pos.x, y: pos.y })),
          });
          
          placed = true;
        }

        attempts++;
      }

      if (!placed) {
        console.warn(
          `Could not place color code: ${colorCode.name} (Instance ${q + 1}/${quantity}) after ${MAX_PLACEMENT_ATTEMPTS} attempts`
        );
        failedToPlaceColorCodes.push(colorCode.name)
      }
    }
  }

  return { grid, placedColorCodes, failedToPlaceColorCodes };
};

function addPaddingToColorCode(absolutePositions: AbsolutePosition[], direction: Direction): AbsolutePosition[] {
  const startCoords = absolutePositions[0];
  const endCoords = absolutePositions[absolutePositions.length - 1];

  const frontPadding: AbsolutePosition[] = [];
  const endPadding: AbsolutePosition[] = [];


  for (let offset = 1; offset <= PERPENDICULAR_PADDING_CELLS; offset++) {
    if (!startCoords || !endCoords) continue;

    switch (direction) {
      case 'top_to_bottom':
        frontPadding.push({ x: endCoords.x + offset, y: endCoords.y, type: "padding" });
        endPadding.push({ x: startCoords.x - offset, y: startCoords.y, type: "padding" });
        break;
      case 'bottom_to_top':
        frontPadding.push({ x: endCoords.x - offset, y: endCoords.y, type: "padding" });
        endPadding.push({ x: startCoords.x + offset, y: startCoords.y, type: "padding" });
        break;
      case 'left_to_right':
        frontPadding.push({ x: endCoords.x, y: endCoords.y + offset, type: "padding" });
        endPadding.push({ x: startCoords.x, y: startCoords.y - offset, type: "padding" });
        break;
      case 'right_to_left':
        frontPadding.push({ x: endCoords.x, y: endCoords.y - offset, type: "padding" });
        endPadding.push({ x: startCoords.x, y: startCoords.y + offset, type: "padding" });
        break;
    }
  }

  return [
    ...frontPadding,
    ...absolutePositions,
    ...endPadding
  ];
}
