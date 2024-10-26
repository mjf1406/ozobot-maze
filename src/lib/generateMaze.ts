// lib/generateMaze.ts

import type { DifficultyOptions, Maze } from "~/components/MazeGeneratorForm";
import type { MazeData } from "~/components/MazeGeneratorOutput";

type ColorName = 'red' | 'green' | 'blue' | 'black' | 'white';

// Units in millimeters
export const LINE_THICKNESS = 5
export const PARALLEL_LINES_GAP = 25
export const COLOR_CODE_WIDTH = 5
export const COLOR_CODE_GAP = 51
export const CORNER_INTERSECTION_GAP = 25
export const SAFE_AREA_DIAMETER = 20
export const CALIBRATION_CIRCLE_DIAMETER = 39
export const CURVE_DIAMETER = 25
export const LINE_SIDE_WHITE_SPACE = 12
export const ZIGZAG_BACKWALK_COLOR_CODE_GAP = 64

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

export const MODIFIERS = {
  A4: { height: 0.86, width: 1.15 },       
  A3: { height: 0.98, width: 1.19 },
  Letter: { height: 0.93, width: 1.2 },       
  Legal: { height: 0.93, width: 1.21 },
}

export type PaperSize = 'A4' | 'A3' | 'Letter' | 'Legal';

// Define the dimensions of common paper sizes in millimeters
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

function getRandomQuantity( difficulty: DifficultyOptions ) {
    switch(difficulty) {
        case "easy":
            return Math.floor(Math.random() * 3) + 1; // Random between 1 and 5
            break;
        case "medium":
            return Math.floor(Math.random() * 5) + 1; // Random between 1 and 5
            break;
        case "hard":
            return Math.floor(Math.random() * 7) + 1; // Random between 1 and 5
            break;
        case "custom":
            return Math.floor(Math.random() * 9) + 1; // Random between 1 and 5
            break;
    }
}

export const generateMaze = async (data: Omit<MazeData, "maze">): Promise<Maze> => {
    console.log("🚀 ~ generateMaze ~ data:", data)
    let mazeText = "";
    let usedColorCodes: ColorCode[] = [];
    const grid = generateGrid(data.pageSize, "landscape", 5)
    const colorCodeQuantities: Record<string, number> = {};
    // for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
    //     const row = grid[rowIndex];
    //     if (!row) break
    //     // eslint-disable-next-line @typescript-eslint/prefer-for-of
    //     for (let colIndex = 0; colIndex < row.length; colIndex++) {
    //         const cell = row[colIndex];
    //         if (cell) {
    //             cell.x = rowIndex
    //             cell.y = colIndex
    //         }
    //     }
    // }
    
    // Generate maze text based on difficulty
    switch (data.difficulty) {
        case "easy":
            mazeText = "🟩🟩🟩\n🟩🟦🟩\n🟩🟩🟩";
            usedColorCodes = COLOR_CODES.filter(code => code.difficulties.includes(data.difficulty));
            // Randomly determine how many of each color code to use
            usedColorCodes = getColorCodeQuantity(usedColorCodes, data.difficulty)
            // Randomly place all the color codes based on their quantities
            // connect them with black lines
            // add erroneous black lines to misdirect the user
            break;
        case "medium":
            mazeText = "🟩🟩🟩🟩\n🟩🟦🟦🟩\n🟩🟩🟩🟩";
            usedColorCodes = COLOR_CODES.filter(code => code.difficulties.includes(data.difficulty));
            // Randomly determine how many of each color code to use
            usedColorCodes = getColorCodeQuantity(usedColorCodes, data.difficulty)
            // Randomly place all the color codes based on their quantities
            // connect them with black lines
            // add erroneous black lines to misdirect the user
            break;
        case "hard":
            mazeText = "🟩🟩🟩🟩🟩\n🟩🟦🟦🟦🟩\n🟩🟩🟩🟩🟩";
            usedColorCodes = COLOR_CODES.filter(code => code.difficulties.includes(data.difficulty));
            // Randomly determine how many of each color code to use
            usedColorCodes = getColorCodeQuantity(usedColorCodes, data.difficulty)
            // Randomly place all the color codes based on their quantities
            // connect them with black lines
            // add erroneous black lines to misdirect the user
            break;
        case "custom":
            mazeText = "🟩🟩🟦🟦🟩🟩🟩\n🟩🟩🟦🟦🟦🟩🟩\n🟩🟩🟩🟦🟦🟩🟩";
            usedColorCodes = COLOR_CODES.filter(code => data.customCommands.includes(code.name));
            // Randomly determine how many of each color code to use
            usedColorCodes = getColorCodeQuantity(usedColorCodes, data.difficulty)
            // Randomly place all the color codes based on their quantities
            // connect them with black lines
            // add erroneous black lines to misdirect the user
            break;
        default:
            mazeText = "Default Maze";
    }
                        
    // Limit the number of color codes if totalCommands is specified
    if (data.totalCommands > 0 && data.totalCommands < usedColorCodes.length) {
        usedColorCodes = usedColorCodes.slice(0, data.totalCommands);
    }

    // Assign quantities for each color code used
    usedColorCodes.forEach(code => {
        colorCodeQuantities[code.name] = code.quantity ?? 0;
    });
    
    console.log("🚀 ~ generateMaze ~ grid:", grid)
    return {
        mazeText,
        usedColorCodes,
        colorCodeQuantities,
        grid
    } as Maze;
};
