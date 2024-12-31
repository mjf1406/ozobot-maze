// connectColorCodes.ts

import { sortCoordinatesArray } from "./generateMaze";
import { COLORS, type Cell } from "./generateOutput";
import type { PlacedColorCode } from "./placeColorCodes";

export type Coordinates = {
  x: number;
  y: number;
};

function areCoordinatesInGrid(
  coord: Coordinates,
  gridSize: { width: number; height: number }
): boolean {
  return (
    coord.x >= 0 &&
    coord.x < gridSize.width &&
    coord.y >= 0 &&
    coord.y < gridSize.height
  );
}

function calculateManhattanDistance(
  point1: Coordinates,
  point2: Coordinates
): number {
  return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y);
}

/**
 * Produces a simple L-shaped path from the last coordinate of colorCodeStart
 * to the first coordinate of colorCodeEnd by first moving horizontally,
 * then vertically (or vice-versa). This ensures only 90-degree turns.
 */
function findManhattanPath(
  colorCodeStart: PlacedColorCode,
  colorCodeEnd: PlacedColorCode
): Coordinates[] | undefined {
  // Sort the arrays so we can reliably pick the first & last
  const coordinatesStart = sortCoordinatesArray(colorCodeStart.coordinates);
  const coordinatesEnd = sortCoordinatesArray(colorCodeEnd.coordinates);

  const startCoord = coordinatesStart[coordinatesStart.length - 1];
  const endCoord = coordinatesEnd[0];

  if (!startCoord || !endCoord) return undefined;

  const path: Coordinates[] = [];
  let currentX = startCoord.x;
  let currentY = startCoord.y;

  // 1. Move horizontally until x == endCoord.x
  while (currentX !== endCoord.x) {
    currentX += endCoord.x > currentX ? 1 : -1;
    path.push({ x: currentX, y: currentY });
  }

  // 2. Move vertically until y == endCoord.y
  while (currentY !== endCoord.y) {
    currentY += endCoord.y > currentY ? 1 : -1;
    path.push({ x: currentX, y: currentY });
  }

  return path;
}

/**
 * Colors the given path in black.
 */
export function colorManhattanPath(grid: Cell[][], manhattanPath: Coordinates[]): void {
  for (const coord of manhattanPath) {
    if (grid[coord.y]?.[coord.x]) {
      if (!grid[coord.y]![coord.x]!.color) {
        grid[coord.y]![coord.x]!.color = COLORS.black;
      }
    }
  }
}

interface DistanceItem {
  element: PlacedColorCode;
  manhattanDistance: number;
}

/**
 * For each placed color code, find the closest (by Manhattan distance)
 * *subsequent* color code, generate a simple path to that code, and color it black.
 */
export function connectColorCodes(grid: Cell[][], placedColorCodes: PlacedColorCode[]): Cell[][] {
  // console.log("Starting connectColorCodes with", placedColorCodes.length, "color codes");
  for (let index = 0; index < placedColorCodes.length - 1; index++) {
    const elementCurrent = placedColorCodes[index];
    const manhattanDistances: DistanceItem[] = [];

    for (let manhattanIndex = 0; manhattanIndex < placedColorCodes.length; manhattanIndex++) {
      const element = placedColorCodes[manhattanIndex];
      if (manhattanIndex <= index || !elementCurrent?.coordinates) continue;

      const startCell = elementCurrent.coordinates[elementCurrent.coordinates.length - 1];
      const endCell = element?.coordinates[0];
      if (!startCell || !endCell) continue;

      const manhattanDistance = calculateManhattanDistance(startCell, endCell);

      if (element && manhattanDistance) {
        manhattanDistances.push({
          element,
          manhattanDistance
        });
      }
    }

    // Sort by ascending distance
    manhattanDistances.sort((a, b) => a.manhattanDistance - b.manhattanDistance);
    const elementNext = manhattanDistances[0]?.element;

    // If either color code is missing coordinates, skip
    if (!elementCurrent?.coordinates || !elementNext?.coordinates) {
      continue;
    }

    // Use the last coordinate of the current color code
    // and the first coordinate of the next color code to build a path
    const path = findManhattanPath(elementCurrent, elementNext);

    if (path) {
      colorManhattanPath(grid, path);
    } else {
      console.error(`No valid path found between color codes ${index} and ${index + 1}`);
    }
  }

  return grid;
}
