// lib/generateMaze.ts

import type { DifficultyOptions, Maze } from "~/components/MazeGeneratorForm";
import type { MazeData } from "~/components/MazeGeneratorOutput";
import { generateMaze, GRID_CELL_SIZE } from "./generateMaze";

type ColorName = 'red' | 'green' | 'blue' | 'black' | 'white';

export type ColorCode = {
    name: string;
    colors: string[];
    difficulties: string[];
    quantity?: number;
};

export const COLORS: Record<ColorName, string> = {
    red: "#EC2027",
    green: "#49B749",
    blue: "#1183C6",
    black: "#000000",
    white: "#ffffff"
};

export const COLOR_ABBREVIATIONS: Record<ColorName, string> = {
    red: "R",
    green: "G",
    blue: "B",
    black: "BK",
    white: "",
};

export const COLOR_CODES: ColorCode[] = [
    {
        name: "Left at Intersection",
        colors: [COLORS.green, COLORS.black, COLORS.red],
        difficulties: ["easy", "medium", "hard"],
    },
    {
        name: "Straight at Intersection",
        colors: [COLORS.blue, COLORS.black, COLORS.red],
        difficulties: ["easy", "medium", "hard"],
    },
    {
        name: "Right at Intersection",
        colors: [COLORS.blue, COLORS.red, COLORS.green],
        difficulties: ["easy", "medium", "hard"],
    },
    {
        name: "Line Switch Left",
        colors: [COLORS.green, COLORS.red, COLORS.green],
        difficulties: ["medium", "hard"],
    },
    {
        name: "Line Switch Straight",
        colors: [COLORS.green, COLORS.blue, COLORS.green],
        difficulties: ["medium", "hard"],
    },
    {
        name: "Line Switch Right",
        colors: [COLORS.red, COLORS.green, COLORS.red],
        difficulties: ["medium", "hard"],
    },
    {
        name: "U-Turn",
        colors: [COLORS.blue, COLORS.red, COLORS.blue],
        difficulties: ["hard"],
    },
    {
        name: "U-Turn (line end)",
        colors: [COLORS.blue, COLORS.red],
        difficulties: ["hard"],
    },
];

// export const MODIFIERS = {
//   A4: { height: 0.99, width: 1.20 },       
//   A3: { height: 1.07, width: 1.21 },
//   Letter: { height: 1.05, width: 1.25 },       
//   Legal: { height: 1.05, width: 1.25 },
// }

export const MODIFIERS = {
    A4: { height: 0.82, width: 1.0 },
    A3: { height: 0.88, width: 1.02 },
    Letter: { height: 0.87, width: 1.05 },
    Legal: { height: 0.88, width: 1.05 },
};

// export const MODIFIERS = {
//     A4: { height: 0.7, width: 0.85 },       
//     A3: { height: 0.76, width: 0.86 },
//     Letter: { height: 0.76, width: 0.89 },       
//     Legal: { height: 0.75, width: 0.89 },
// }

  

// const calculateModifiers = (gridSize: number) => {
//     return {
//         A4: {
//         height: (-0.145 * gridSize) + 1.715,
//         width: (-0.175 * gridSize) + 2.075,
//         },
//         A3: {
//         height: (-0.155 * gridSize) + 1.845,
//         width: (-0.175 * gridSize) + 2.085,
//         },
//         Letter: {
//         height: (-0.145 * gridSize) + 1.775,
//         width: (-0.180 * gridSize) + 2.150,
//         },
//         Legal: {
//         height: (-0.150 * gridSize) + 1.800,
//         width: (-0.180 * gridSize) + 2.150,
//         },
//     };
// };
  
// const MODIFIERS = calculateModifiers(GRID_CELL_SIZE);  

export type PaperSize = 'A4' | 'A3' | 'Letter' | 'Legal';

export const PAPER_SIZES: Record<PaperSize, { width: number; height: number }> = {
    A4: { width: 210, height: 297 },       // 210mm x 297mm
    A3: { width: 297, height: 420 },
    Letter: { width: 215.9, height: 279.4 },
    Legal: { width: 215.9, height: 355.6 },
};

export type Cell = {
    color?: string;
    x?: number
    y?: number
};

// Function to generate the grid
export const generateGrid = (
    paperSize: PaperSize,
    orientation: 'portrait' | 'landscape' = 'portrait', // Default to portrait
    squareSize: 5 // Default square size is 5mm
): Cell[][] => {
    let { width, height } = PAPER_SIZES[paperSize];

    // Swap width and height for landscape orientation
    if (orientation === 'landscape') {
        [width, height] = [height, width];
    }

    // Calculate the number of squares that fit horizontally and vertically
    const cols = Math.floor(width * MODIFIERS[paperSize].width / squareSize);
    const rows = Math.floor(height * MODIFIERS[paperSize].height / squareSize);

    // Initialize the 2D array (grid)
    const grid: Cell[][] = [];
    for (let row = 0; row < rows; row++) {
        const gridRow: Cell[] = [];
        for (let col = 0; col < cols; col++) {
            gridRow.push({ x: row, y: col }); // Initialize each cell with coordinates
        }
        grid.push(gridRow);
    }

    return grid;
};

export const getAbbreviation = (color: string) => {
    const entries = Object.entries(COLORS) as [ColorName, string][];
    const entry = entries.find(([_, value]) => value === color);
    return entry ? COLOR_ABBREVIATIONS[entry[0]] : '';
};

const getColorCodeQuantity = (usedColorCodes: ColorCode[], difficulty: DifficultyOptions) => {
    for (const colorCode of usedColorCodes) {
        const quantity = getRandomQuantity(difficulty)
        colorCode.quantity = quantity
    }
    return usedColorCodes
} 

const getRandomQuantity = ( difficulty: DifficultyOptions ) => {
    switch(difficulty) {
        case "easy-low":
            return 1
        case "easy":
            return Math.floor(Math.random() * 2) + 1;
        case "easy-medium":
            return Math.floor(Math.random() * 3) + 1;
        case "medium":
            return Math.floor(Math.random() * 4) + 1;
        case "medium-hard":
            return Math.floor(Math.random() * 5) + 1;
        case "hard":
            return Math.floor(Math.random() * 6) + 1;
        case "hard-high":
            return Math.floor(Math.random() * 8) + 1;
        case "hard-super":
            return Math.floor(Math.random() * 9) + 1;
        case "hard-extreme":
            return Math.floor(Math.random() * 10) + 1;
        case "custom":
            return Math.floor(Math.random() * 5) + 1; // TODO: add ui for this so the user can set the max and min
    }
}

export const generateOutput = async (data: Omit<MazeData, "maze">): Promise<Maze> => {
    const mazeText = "";
    let usedColorCodes: ColorCode[] = [];
    usedColorCodes = COLOR_CODES.filter(code => 
  code.difficulties.includes(data.difficulty.split('-')[0] ?? data.difficulty)
);
    usedColorCodes = getColorCodeQuantity(usedColorCodes, data.difficulty)
    const grid = generateGrid(data.pageSize, "landscape", 5)
    let maze
    const colorCodeQuantities: Record<string, number> = {};
    if (data.mazeType === "ozobot_maze" || data.mazeType === "ozobot_road_challenge") maze = await generateMaze(usedColorCodes, grid, data)
                        
    // Limit the number of color codes if totalCommands is specified
    if (data.totalCommands > 0 && data.totalCommands < usedColorCodes.length) {
        usedColorCodes = usedColorCodes.slice(0, data.totalCommands);
    }

    // Assign quantities for each color code used
    usedColorCodes.forEach(code => {
        colorCodeQuantities[code.name] = code.quantity ?? 0;
    });
    
    return {
        mazeText,
        usedColorCodes,
        colorCodeQuantities,
        grid,
        maze
    } as Maze;
};
