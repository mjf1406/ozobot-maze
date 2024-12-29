import { sortCoordinatesArray } from "./generateMaze";
import { COLORS, type Cell } from "./generateOutput";
import type { PlacedColorCode } from "./placeColorCodes";

export type Coordinates = {
    x: number;
    y: number;
}

function areCoordinatesInGrid(coord: Coordinates, gridSize: { width: number; height: number }): boolean {
    return coord.x >= 0 && coord.x < gridSize.width && coord.y >= 0 && coord.y < gridSize.height;
}

function calculateManhattanDistance(point1: Coordinates, point2: Coordinates): number {
    return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y);
}

function findManhattanPath(colorCodeStart: PlacedColorCode, colorCodeEnd: PlacedColorCode): Coordinates[] | undefined {
    // console.log("🚀 ~ findManhattanPath ~ colorCodeStart:", colorCodeStart)
    // console.log("🚀 ~ findManhattanPath ~ colorCodeEnd:", colorCodeEnd)
    /*
        - [ ] at least 25mm between any parallel tracks (5 cells)
        - [ ] At least 51mm between color codes (10 cells)
        - [ ] there must be at least 25mm from a corner/intersection before another corner/intersection/color code (5 cells)
        - [ ] line that end in a color must have a safe area with a diameter of 20mm starting from the end of the line (4 cells)
        - [ ] each side of a line must have at least 12mm of white space (3 cells between parallel tracks that are not using Line Switch)
        - [ ] all turns must be 90 degrees
    */
    const path: Coordinates[] = [];

    const coordinatesStart = sortCoordinatesArray(colorCodeStart.coordinates)
    const coordinatesEnd = sortCoordinatesArray(colorCodeEnd.coordinates)

    const startCoords1 = coordinatesStart[0] 
    const startCoords = coordinatesStart[coordinatesStart.length - 1]

    const endCoords1 = coordinatesEnd[0]
    const endCoords = coordinatesEnd[coordinatesEnd.length - 1]

    const startDirection = colorCodeStart.direction
    const endDirection = colorCodeEnd.direction

    const safety = [1, 2, 3, 4, 5]
    for (const offset of safety) {
        if (!startCoords || !endCoords || !startCoords1 || !endCoords1) continue
        // Need to ensure it moves 5 cells away from start 
        switch (startDirection) {
            case 'top_to_bottom':
                break;
            case 'bottom_to_top':
                break;
            case 'left_to_right':
                break;
            case 'right_to_left':
                break;
          }
    
        // Ensure it moves 5 cells away from the end
        switch (endDirection) {
            case 'top_to_bottom':
                break;
            case 'bottom_to_top':
                break;
            case 'left_to_right':
                break;
            case 'right_to_left':
                break;
          }
    }

    // console.log("🚀 ~ findManhattanPath ~ path:", path)
    return path;
}

export function colorManhattanPath(grid: Cell[][], manhattanPath: Coordinates[]): void {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let index = 0; index < manhattanPath.length; index++) {
        const coord = manhattanPath[index];
        if (!coord) continue
        if (grid[coord.y]?.[coord.x]) {
           if (!grid[coord.y]![coord.x]!.color) grid[coord.y]![coord.x]!.color = COLORS.black;
        }
    }
}

interface DistanceItem {
    element: PlacedColorCode;
    manhattanDistance: number;
}

export function connectColorCodes(grid: Cell[][], placedColorCodes: PlacedColorCode[]): Cell[][] {
    // console.log("Starting connectColorCodes with", placedColorCodes.length, "color codes");
    
    for (let index = 0; index < placedColorCodes.length - 1; index++) {
        const elementCurrent = placedColorCodes[index];
        const manhattanDistances: DistanceItem[] = []

        for (let manhattanIndex = 0; manhattanIndex < placedColorCodes.length; manhattanIndex++) {
            const element = placedColorCodes[manhattanIndex];
            if (manhattanIndex <= index || !elementCurrent?.coordinates) continue

            const startCell = elementCurrent?.coordinates[elementCurrent.coordinates.length - 1]
            const endCell = element?.coordinates[0]
            if (!startCell || !endCell) continue
            const manhattanDistance = calculateManhattanDistance(startCell, endCell)

            if (element && manhattanDistance) {
                manhattanDistances.push({
                    element,
                    manhattanDistance
                })
            }
        }

        manhattanDistances.sort((a, b) => a.manhattanDistance - b.manhattanDistance);
        const elementNext = manhattanDistances[0]?.element

        if (!elementCurrent?.coordinates || !elementNext?.coordinates) {
            // console.warn("Missing coordinates for elements at index", index);
            continue;
        }
        
        const startCoord = elementCurrent.coordinates[elementCurrent.coordinates.length - 1];
        const endCoord = elementNext.coordinates[0];
        
        if (startCoord && endCoord) {
            // console.info(`Finding path between color codes ${index} and ${index + 1}`);
            const path = findManhattanPath(elementCurrent, elementNext);
            
            if (path) {
                // console.log(`Found valid path with ${path.length} points`);
                colorManhattanPath(grid, path);
            } else {
                console.error(`No valid path found between color codes ${index} and ${index + 1}`);
            }
        }
    }

    return grid;
}