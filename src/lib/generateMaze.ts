import type { MazeData } from "~/components/MazeGeneratorOutput";

type ColorName = 'red' | 'green' | 'blue' | 'black';


export type ColorCode = {
    name: string,
    colors: string[],
    difficulties: string[],
}

export const COLORS: Record<ColorName, string> = {
    red: "#EC2027",
    green: "#49B749",
    blue: "#1183C6",
    black: "#000000",
  };
  
  export const COLOR_ABBREVIATIONS: Record<ColorName, string> = {
    red: "R",
    green: "G",
    blue: "B",
    black: "BK",
  };

export const COLOR_CODES: ColorCode[] = [
    {
        name: "Left at Intersection",
        colors: [COLORS.green, COLORS.black, COLORS.red],
        difficulties: ["easy"],
    },
    {
        name: "Straight at Intersection",
        colors: [COLORS.blue, COLORS.black, COLORS.red],
        difficulties: ["easy"],
    },
    {
        name: "Right at Intersection",
        colors: [COLORS.blue, COLORS.red, COLORS.green],
        difficulties: ["easy"],
    },
    {
        name: "Line Switch Left",
        colors: [COLORS.green, COLORS.red, COLORS.green],
        difficulties: ["easy", "medium"],
    },
    {
        name: "Line Switch Straight",
        colors: [COLORS.green, COLORS.blue, COLORS.green],
        difficulties: ["easy", "medium"],
    },
    {
        name: "Line Switch Right",
        colors: [COLORS.red, COLORS.green, COLORS.red],
        difficulties: ["easy", "medium"],
    },
    // {
    //     name: "U-Turn",
    //     colors: [COLORS.blue, COLORS.red, COLORS.blue],
    //     difficulties: ["easy", "medium", "hard"],
    // },
    // {
    //     name: "U-Turn (line end)",
    //     colors: [COLORS.blue, COLORS.red],
    //     difficulties: ["easy", "medium", "hard"],
    // },
]

export const getAbbreviation = (color: string) => {
    const entries = Object.entries(COLORS) as [ColorName, string][];
    const entry = entries.find(([_, value]) => value === color);
    return entry ? COLOR_ABBREVIATIONS[entry[0]] : '';
  };
  

export const generateMaze = (data: MazeData) => {
    let maze = "";
    switch (data.difficulty) {
      case "easy":
        maze = "🟩🟩🟩\n🟩🟦🟩\n🟩🟩🟩";
        break;
      case "medium":
        maze = "🟩🟩🟩🟩\n🟩🟦🟦🟩\n🟩🟩🟩🟩";
        break;
      case "hard":
        maze = "🟩🟩🟩🟩🟩\n🟩🟦🟦🟦🟩\n🟩🟩🟩🟩🟩";
        break;
      case "custom":
        maze = "🟩🟩🟦🟦🟩🟩🟩\n🟩🟩🟦🟦🟦🟩🟩\n🟩🟩🟩🟦🟦🟩🟩"
        break;
      default:
        maze = "Default Maze";
    }
    return maze;
  };