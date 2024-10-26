// components/MazeGeneratorOutput.tsx

import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Download, Square } from "lucide-react";
import { Button } from "./ui/button";
import { pixelifySans } from "~/app/fonts";
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { COLOR_CODES, COLORS, getAbbreviation } from "~/lib/generateMaze";
import {
  createScalingObject,
  DPI,
  type PaperSize,
} from "~/lib/printingFunctions";
import type { Maze, MazeTypeOptions } from "./MazeGeneratorForm";

export type RevealColorCodesOptions = "none" | "usable" | "used";

export type RevealHintsOptions = {
  revealColorCodes: RevealColorCodesOptions;
  quantities: boolean;
};

export type MazeData = {
  title: string;
  pageSize: PaperSize;
  difficulty: string;
  customCommands: string[];
  totalCommands: number;
  revealHints: RevealHintsOptions;
  maze: Maze; // Include maze in MazeData type
  mazeType: MazeTypeOptions; // Include the type in the output
};

const pageSizes = {
  A3: {
    pixels: "1400 × 1980",
    mm: "297 × 420",
    inches: "11.69 × 16.54",
  },
  A4: {
    pixels: "980 × 1400",
    mm: "210 × 297",
    inches: "8.27 × 11.69",
  },
  A5: {
    pixels: "700 × 980",
    mm: "148 × 210",
    inches: "5.83 × 8.27",
  },
  B4: {
    pixels: "1200 × 1700",
    mm: "250 × 353",
    inches: "9.84 × 13.90",
  },
  Letter: {
    pixels: "1056 × 1368",
    mm: "216 × 279",
    inches: "8.5 × 11",
  },
  Legal: {
    pixels: "1056 × 1728",
    mm: "216 × 356",
    inches: "8.5 × 14",
  },
  "Ledger/Tabloid": {
    pixels: "1368 × 2112",
    mm: "279 × 432",
    inches: "11 × 17",
  },
} as const;

type PageSizeFormat = keyof typeof pageSizes;

const pageFormatMap = {
  A3: "a3",
  A4: "a4",
  A5: "a5",
  B4: "b4",
  Letter: "letter",
  Legal: "legal",
  "Ledger/Tabloid": "ledger",
};

const MazeGeneratorOutput = ({ data }: { data: MazeData }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (cardRef.current) {
      // Select all abbreviation divs within cardRef.current
      const abbreviationDivs =
        cardRef.current.querySelectorAll(".abbreviation-div");
      abbreviationDivs.forEach((div) => {
        div.classList.add("pb-2");
      });

      const iconDivs = cardRef.current.querySelectorAll(".icons-div");
      iconDivs.forEach((div) => {
        div.classList.add("mt-1");
      });

      // Wait for the DOM to update
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Generate the canvas
      const canvas = await html2canvas(cardRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      // Remove 'pb-2' class after generating the canvas
      abbreviationDivs.forEach((div) => {
        div.classList.remove("pb-2");
      });
      iconDivs.forEach((div) => {
        div.classList.remove("mt-1");
      });

      const scaling = createScalingObject(data.pageSize, DPI.PRINT_MEDIUM);

      // Continue with PDF generation
      const pageFormat = pageFormatMap[data.pageSize as PageSizeFormat] || "a4";

      const pdf = new jsPDF({
        orientation: "landscape", // Ensure landscape orientation
        unit: "pt",
        format: pageFormat,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
      pdf.save(`${data.title || "maze"}.pdf`);
    }
  };

  const { maze } = data;
  console.log("🚀 ~ MazeGeneratorOutput ~ maze:", maze);

  // Get dimensions from pageSizes
  const [width, height] = (
    pageSizes[data.pageSize as PageSizeFormat]?.pixels || ""
  )
    .split("×")
    .map((dim) => parseInt(dim.trim()));

  // Scale down the dimensions for screen display (e.g., 1/2 scale)
  const scale = 0.5;
  const scaledWidth = width ? `${Math.round(width * scale)}px` : "auto";
  const scaledHeight = height ? `${Math.round(height * scale)}px` : "auto";

  // Determine if any hints are revealed
  const hasRevealedHints =
    data.revealHints.revealColorCodes !== "none" || data.revealHints.quantities;

  // Generate hints based on revealHints
  const hints = [];

  // Generate the list of color codes based on the selection
  if (data.revealHints.revealColorCodes !== "none") {
    let colorCodesToDisplay: typeof COLOR_CODES = COLOR_CODES.filter((code) =>
      code.difficulties.includes(data.difficulty),
    );

    if (data.revealHints.revealColorCodes === "usable") {
      // Display all possible color codes
      colorCodesToDisplay = COLOR_CODES.filter((code) =>
        code.difficulties.includes(data.difficulty),
      );
    } else if (data.revealHints.revealColorCodes === "used") {
      // Display only the color codes used in the maze
      colorCodesToDisplay = maze.usedColorCodes ?? [];
    }

    hints.push(
      <div
        key="color-codes"
        className="text-4xs flex items-center justify-center gap-2"
      >
        {colorCodesToDisplay.map((command) => (
          <div
            key={command.name}
            className="flex items-center space-x-3 rounded-lg bg-gray-100 p-1"
          >
            <div className="flex flex-col flex-wrap items-center justify-center">
              <div>{command.name}</div>
              <div className="mt-1">
                {data.revealHints.quantities && (
                  <div className="flex items-center gap-0.5">
                    {Array.from({
                      length: maze.colorCodeQuantities[command.name] ?? 0,
                    }).map((_, i) => (
                      <Square key={i} size={10} />
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-1 flex">
                <div
                  className="flex h-3 w-3 items-center justify-center text-xs font-medium"
                  style={{
                    backgroundColor: "#130c0e",
                  }}
                ></div>
                {command.colors.map((color, index) => (
                  <div
                    key={`${command.name}-${color}-${index}`}
                    className="abbreviation-div flex h-3 w-3 items-center justify-center text-center font-medium"
                    style={{
                      backgroundColor: color,
                      color: color === "#000000" ? "white" : "black",
                    }}
                  >
                    {getAbbreviation(color)}
                  </div>
                ))}

                {command.name !== "U-Turn (line end)" && (
                  <div
                    className="flex h-3 w-3 items-center justify-center font-medium"
                    style={{
                      backgroundColor: "#130c0e",
                    }}
                  ></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>,
    );
  }

  return (
    <>
      <Card
        ref={cardRef}
        className="relative border-none bg-white"
        id="output"
        style={{
          width: scaledHeight,
          height: scaledWidth,
          minHeight: "400px", // Fallback minimum height
          aspectRatio: width && height ? `${width} / ${height}` : "auto",
        }}
      >
        <CardContent className="p-3">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <div className="text-sm font-semibold">
                {data.title} Ozobot{" "}
                {data.mazeType === "ozobot_challenge" ? "Challenge" : "Maze"}
              </div>
              <div className="text-4xs text-muted-foreground">
                {data.mazeType === "ozobot_challenge"
                  ? "Create a path for Ozobot using all the Color Codes below! Plan your path in pencil first, then double and triple check it!"
                  : "Help Ozobot collect all the ⭐! Plan your Color Codes in pencil first, then double and triple check them!"}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-3xs text-muted-foreground">
                {new Date().toLocaleDateString()}
              </div>
              <div className="text-2xs flex gap-2">
                <div className="flex items-center gap-1">
                  <div>Name:</div>
                  <div>______________</div>
                </div>
                <div className="flex items-center gap-1">
                  <div>Number:</div>
                  <div>____</div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-5">
            <div
              className={`${
                hasRevealedHints ? "col-span-4" : "col-span-5"
              } rounded-lg p-4 font-mono`}
            >
              {/* <pre>{maze.mazeText}</pre> */}
              {maze.grid && maze.grid.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${maze.grid[0]?.length ?? 0}, ${5 * scale}mm)`,
                    width: `${maze.grid[0]?.length ?? 0 * 5 * scale}mm`,
                    height: `${maze.grid.length * 5 * scale}mm`,
                  }}
                >
                  {maze.grid.flat().map((cell, index) => {
                    const numColumns = maze.grid[0]?.length ?? 0; // Number of columns in the grid
                    const numRows = maze.grid.length; // Number of rows in the grid
                    const row = Math.floor(index / numColumns); // Current row
                    const col = index % numColumns; // Current column

                    // Determine the key for each cell to ensure unique identification
                    const cellKey = `${row}-${col}`;

                    // Conditional rendering based on mazeType
                    if (data.mazeType === "ozobot_challenge") {
                      return (
                        <div
                          key={cellKey}
                          style={{
                            width: `${5 * scale}mm`,
                            height: `${5 * scale}mm`,
                            backgroundColor: cell.color ?? COLORS.white,
                          }}
                          className={`flex items-center justify-center border-b border-r ${
                            row === 0 ? "border-t" : ""
                          } ${col === 0 ? "border-l" : ""}`}
                        >
                          {/* Render cell content specific to Ozobot Challenge */}
                          <div
                            className={`text-7xs ${cell.color ? "text-white" : "text-black"}`}
                          >
                            {row}, {col}
                          </div>
                        </div>
                      );
                    } else if (data.mazeType === "ozobot_maze") {
                      return (
                        <div
                          key={cellKey}
                          style={{
                            width: `${5 * scale}mm`,
                            height: `${5 * scale}mm`,
                            backgroundColor: cell.color ?? COLORS.white,
                          }}
                          className={`flex items-center justify-center border-b border-r ${
                            cell.color === COLORS.white && "border"
                          }`}
                        >
                          {/* Render cell content specific to Ozobot Maze */}
                          {/* You can customize this section as needed */}
                          <span className="text-xs">
                            {/* Optional Content */}
                          </span>
                        </div>
                      );
                    } else {
                      // Fallback rendering if mazeType is neither 'ozobot_challenge' nor 'ozobot_maze'
                      return (
                        <div
                          key={cellKey}
                          style={{
                            width: `${5 * scale}mm`,
                            height: `${5 * scale}mm`,
                            backgroundColor: cell.color ?? COLORS.white,
                          }}
                          className={`flex items-center justify-center border-b border-r ${
                            row === 0 ? "border-t" : ""
                          } ${col === 0 ? "border-l" : ""}`}
                        >
                          {/* Default cell content */}
                          <span className="text-xs">
                            {/* Optional Content */}
                          </span>
                        </div>
                      );
                    }
                  })}
                </div>
              )}
            </div>
          </div>
          <CardFooter className="text-5xs absolute -bottom-5 flex w-full flex-col items-center justify-center">
            {hasRevealedHints && <div className="text-2xs">{hints}</div>}
            <div className="text-center">
              Generated at https://ozobot-maze.vercel.app/
            </div>
          </CardFooter>
        </CardContent>
      </Card>
      <Button
        className={`${pixelifySans.className} text-2xl`}
        type="submit"
        size={"lg"}
        onClick={handleDownloadPDF}
      >
        <Download className="mr-2" /> Download PDF
      </Button>
    </>
  );
};

export default MazeGeneratorOutput;
