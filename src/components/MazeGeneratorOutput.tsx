// components/MazeGeneratorOutput.tsx

"use client";

import React, { useMemo, useRef, useState } from "react";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Download, Square, Loader2 } from "lucide-react"; // Import Loader2 for the spinner
import { Button } from "./ui/button";
import { pixelifySans } from "~/app/fonts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  createScalingObject,
  DPI,
  type PaperSize,
} from "~/lib/printingFunctions";
import type {
  DifficultyOptions,
  Maze,
  MazeTypeOptions,
  TranslationKey,
} from "./MazeGeneratorForm";
import { COLOR_CODES, getAbbreviation, COLORS } from "~/lib/generateOutput";
import { useI18n } from "locales/client";
import { GRID_CELL_SIZE } from "~/lib/generateMaze";
import "~/lib/stringExtensions";

export type RevealColorCodesOptions = "none" | "usable" | "used";

export type RevealHintsOptions = {
  revealColorCodes: RevealColorCodesOptions;
  quantities: boolean;
};

export type MazeData = {
  title: string;
  pageSize: PaperSize;
  difficulty: DifficultyOptions;
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

const MazeGeneratorOutput = React.memo(({ data }: { data: MazeData }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const t = useI18n();

  const difficultyKey = `difficulty_${data.difficulty.replaceAll("-", "_")}`;

  const handleDownloadPDF = async () => {
    if (cardRef.current) {
      setIsLoading(true); // Start loading

      try {
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

        const checkboxDivs = cardRef.current.querySelectorAll(".checkboxes");
        checkboxDivs.forEach((div) => {
          div.classList.add("mt-1");
        });

        const coordinatesDivs =
          cardRef.current.querySelectorAll(".coordinates");
        coordinatesDivs.forEach((div) => {
          div.classList.add(
            "flex",
            "items-center",
            "justify-center",
            "w-full",
            "-mt-2",
          );
        });

        const coordinateDivs =
          cardRef.current.querySelectorAll(".coordinate-label");
        coordinateDivs.forEach((div) => {
          div.classList.add(
            "flex",
            "items-center",
            "justify-center",
            "w-full",
            "-mt-2",
          );
        });

        const coordinateDivsTop = cardRef.current.querySelectorAll(
          ".coordinate-label-top",
        );
        coordinateDivsTop.forEach((div) => {
          div.classList.add(
            "flex",
            "items-center",
            "justify-center",
            "w-full",
            "-mt-1",
            "-ml-1",
          );
        });

        const coordinateDivsBottom = cardRef.current.querySelectorAll(
          ".coordinate-label-bottom",
        );
        coordinateDivsBottom.forEach((div) => {
          div.classList.add(
            "flex",
            "items-center",
            "justify-center",
            "w-full",
            "-ml-1",
          );
        });

        // Wait for the DOM to update
        await new Promise((resolve) => setTimeout(resolve, 0));

        // Generate the canvas
        const canvas = await html2canvas(cardRef.current, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");

        // Remove 'pb-2' and 'mt-1' classes after generating the canvas
        abbreviationDivs.forEach((div) => {
          div.classList.remove("pb-2");
        });
        iconDivs.forEach((div) => {
          div.classList.remove("mt-1");
        });

        checkboxDivs.forEach((div) => {
          div.classList.remove("mt-1");
        });

        coordinatesDivs.forEach((div) => {
          div.classList.remove(
            "flex",
            "items-center",
            "justify-center",
            "w-full",
            "-mt-2",
          );
        });

        coordinateDivs.forEach((div) => {
          div.classList.remove(
            "flex",
            "items-center",
            "justify-center",
            "w-full",
            "-mt-2",
          );
        });

        coordinateDivsTop.forEach((div) => {
          div.classList.remove(
            "flex",
            "items-center",
            "justify-center",
            "w-full",
            "-mt-1",
            "-ml-1",
          );
        });

        coordinateDivsBottom.forEach((div) => {
          div.classList.remove(
            "flex",
            "items-center",
            "justify-center",
            "w-full",
            "-ml-1",
          );
        });

        const scaling = createScalingObject(data.pageSize, DPI.PRINT_MEDIUM);

        // Continue with PDF generation
        const pageFormat =
          pageFormatMap[data.pageSize as PageSizeFormat] || "a4";

        const pdf = new jsPDF({
          orientation: "landscape", // Ensure landscape orientation
          unit: "pt",
          format: pageFormat,
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);

        const title = data.mazeType.replaceAll("_", " ");

        pdf.save(
          `${data.title ? data.title + " - " : ""}${title.toTitleCase()} (${data.difficulty}).pdf`,
        );
      } catch (error) {
        console.error("Error generating PDF:", error);
        // Optionally, you can add error handling UI here
      } finally {
        setIsLoading(false); // End loading
      }
    }
  };

  const { maze } = data;

  // Get dimensions from pageSizes
  const [width, height] = (
    pageSizes[data.pageSize as PageSizeFormat]?.pixels || ""
  )
    .split("×")
    .map((dim) => parseInt(dim.trim()));

  const scale = 0.5;
  const scaledWidth = width ? `${Math.round(width * scale)}px` : "auto";
  const scaledHeight = height ? `${Math.round(height * scale)}px` : "auto";

  const hasRevealedHints =
    data.revealHints.revealColorCodes !== "none" || data.revealHints.quantities;

  const hints = [];

  const aggregatedPlacedColorCodes = useMemo(() => {
    if (data?.revealHints?.revealColorCodes !== "used") {
      return [];
    }

    const map: Record<string, number> = {};

    maze?.maze?.placedColorCodes?.forEach((code) => {
      if (code?.name) {
        map[code.name] = (map[code.name] ?? 0) + 1;
      }
    });

    return Object.entries(map).map(([name, quantity]) => ({
      name,
      quantity,
      colors: COLOR_CODES.find((code) => code.name === name)?.colors ?? [],
    }));
  }, [data?.revealHints?.revealColorCodes, maze?.maze?.placedColorCodes]);

  if (data.revealHints.revealColorCodes !== "none") {
    let colorCodesToDisplay:
      | typeof COLOR_CODES
      | typeof aggregatedPlacedColorCodes = COLOR_CODES.filter((code) =>
      code.difficulties.includes(data.difficulty),
    );

    if (data.revealHints.revealColorCodes === "usable") {
      colorCodesToDisplay = COLOR_CODES.filter((code) =>
        code.difficulties.includes(data.difficulty.split("-")[0] ?? ""),
      );
    } else if (data.revealHints.revealColorCodes === "used") {
      colorCodesToDisplay = aggregatedPlacedColorCodes ?? [];
    }

    hints.push(
      <div
        key="color-codes"
        className="text-5xs flex items-center justify-center gap-2"
      >
        {colorCodesToDisplay.map((command) => (
          <div
            key={command.name}
            className="flex items-center space-x-3 rounded-lg bg-gray-100 p-1"
          >
            <div className="flex flex-col flex-wrap items-center justify-center">
              <div>{command.name}</div>
              <div className="checkboxes flex items-center gap-0.5">
                {data.revealHints.revealColorCodes &&
                  Array.from({
                    length: command.quantity ?? 0,
                  }).map(
                    (_, i) =>
                      data.revealHints.quantities && (
                        <Square key={i} size={8} />
                      ),
                  )}
              </div>

              <div className="mt-0.5 flex">
                <div
                  className="flex h-2 w-2 items-center justify-center text-xs font-medium"
                  style={{
                    backgroundColor: "#130c0e",
                  }}
                ></div>
                {command.colors.map((color, index) => (
                  <div
                    key={`${command.name}-${color}-${index}`}
                    className="abbreviation-div flex h-2 w-2 items-center justify-center text-center font-medium"
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
                    className="flex h-2 w-2 items-center justify-center font-medium"
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

  const mazeGridElement = useMemo(() => {
    if (maze.grid && maze.grid.length > 0) {
      const numRows = maze.grid.length;
      const numCols = maze.grid[0]?.length ?? 0;

      // Function to determine if a label should be shown (every 5 cells)
      const shouldShowLabel = (index: number) => (index + 1) % 5 === 0;

      // Generate column labels for top and bottom
      const columnLabelsTop = Array.from({ length: numCols }).map((_, col) =>
        shouldShowLabel(col) ? (
          <div
            key={`col-top-${col}`}
            className="text-5xs coordinate-label-top h-full w-full text-left"
          >
            {col + 1}
          </div>
        ) : (
          <div
            key={`col-top-${col}`}
            className="coordinate-label-top h-full w-full"
          />
        ),
      );

      const columnLabelsBottom = Array.from({ length: numCols }).map(
        (_, col) =>
          shouldShowLabel(col) ? (
            <div
              key={`col-bottom-${col}`}
              className="text-5xs coordinate-label-bottom h-full w-full text-left"
            >
              {col + 1}
            </div>
          ) : (
            <div
              key={`col-bottom-${col}`}
              className="coordinate-label-bottom h-full w-full"
            />
          ),
      );

      // Generate row labels for left and right
      const rowLabelsLeft = Array.from({ length: numRows }).map((_, row) =>
        shouldShowLabel(row) ? (
          <div
            key={`row-left-${row}`}
            className="text-5xs coordinate-label flex h-full w-full items-center justify-center"
          >
            {row + 1}
          </div>
        ) : (
          <div
            key={`row-left-${row}`}
            className="coordinate-label h-full w-full"
          />
        ),
      );

      const rowLabelsRight = Array.from({ length: numRows }).map((_, row) =>
        shouldShowLabel(row) ? (
          <div
            key={`row-right-${row}`}
            className="text-5xs coordinate-label flex h-full w-full items-center justify-center"
          >
            {row + 1}
          </div>
        ) : (
          <div
            key={`row-right-${row}`}
            className="coordinate-label h-full w-full"
          />
        ),
      );

      return (
        <div className="relative">
          {/* Top Column Labels */}
          <div
            className="grid grid-cols-1 gap-0"
            style={{
              gridTemplateColumns: `repeat(${numCols}, ${GRID_CELL_SIZE * scale}mm)`,
            }}
          >
            <div key={`col-bottom-x`} className="h-full w-full" />
            {columnLabelsTop}
          </div>

          {/* Main Grid with Side Labels */}
          <div className="flex">
            {/* Left Row Labels */}
            <div className="mr-0.5 flex flex-col gap-0">{rowLabelsLeft}</div>

            {/* Maze Grid */}
            <div
              className="grid gap-0"
              style={{
                gridTemplateColumns: `repeat(${numCols}, ${GRID_CELL_SIZE * scale}mm)`,
                width: `${numCols * GRID_CELL_SIZE * scale}mm`,
                height: `${numRows * GRID_CELL_SIZE * scale}mm`,
              }}
            >
              {maze.grid.flat().map((cell, index) => {
                const row = Math.floor(index / numCols);
                const col = index % numCols;
                const cellKey = `${row}-${col}`;

                // Determine if labels should be shown inside the cell
                const showRowLabel = shouldShowLabel(row);
                const showColLabel = shouldShowLabel(col);

                // Cell styling based on mazeType and cell color
                let cellClasses = "flex items-center justify-center";
                if (!cell.color) cellClasses += " border-b border-r opacity-50";
                if (row === 0) cellClasses += " border-t";
                if (col === 0) cellClasses += " border-l";

                return (
                  <div
                    key={cellKey}
                    className={cellClasses}
                    style={{
                      width: `${GRID_CELL_SIZE * scale}mm`,
                      height: `${GRID_CELL_SIZE * scale}mm`,
                      backgroundColor: cell.color ?? COLORS.white,
                    }}
                  >
                    {/* Conditionally render coordinates if the cell has no color */}
                    {!cell.color && (
                      <div className="text-6xs coordinates flex items-center justify-center text-center text-black">
                        {showRowLabel && showColLabel
                          ? `${row + 1},${col + 1}`
                          : null}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Row Labels */}
            <div className="ml-0.5 flex flex-col gap-0">{rowLabelsRight}</div>
          </div>

          {/* Bottom Column Labels */}
          <div
            className="grid grid-cols-1 gap-0"
            style={{
              gridTemplateColumns: `repeat(${numCols}, ${GRID_CELL_SIZE * scale}mm)`,
            }}
          >
            <div key={`col-bottom-x`} className="h-full w-full" />
            {columnLabelsBottom}
          </div>
        </div>
      );
    }
    return null;
  }, [maze.grid, data.mazeType, scale]);

  return (
    <>
      <Card
        ref={cardRef}
        className={`${
          hasRevealedHints ? "col-span-4" : "col-span-5"
        } ${data.pageSize === "A3" ? "p-2" : "p-0"} relative border-none bg-white`}
        id="output"
        style={{
          width: scaledHeight,
          height: scaledWidth,
          minHeight: "400px", // Fallback minimum height
          aspectRatio: width && height ? `${width} / ${height}` : "auto",
        }}
      >
        <CardContent className="p-2">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <div className="text-xs font-semibold">
                {data.mazeType === "ozobot_city_challenge"
                  ? "🏙️"
                  : data.mazeType === "ozobot_road_challenge"
                    ? "🛣️"
                    : "🧩"}{" "}
                {data.title} Ozobot{" "}
                {data.mazeType === "ozobot_city_challenge"
                  ? "City Challenge"
                  : data.mazeType === "ozobot_road_challenge"
                    ? "Road Challenge"
                    : "Maze"}{" "}
                <span className="text-2xs">
                  ({t(difficultyKey as TranslationKey)})
                </span>
              </div>
              <div className="text-4xs text-muted-foreground">
                {data.mazeType === "ozobot_city_challenge"
                  ? "Create a path for Ozobot in the city using all the Color Codes below! Plan your path in pencil first, then double and triple check it!"
                  : data.mazeType === "ozobot_road_challenge"
                    ? "Navigate Ozobot through each Color Code on the grid! Ensure your path is well-planned in pencil before coloring in the black lines."
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
              } rounded-lg font-mono`}
            >
              {/* <pre>{maze.mazeText}</pre> */}
              {mazeGridElement}
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
      {maze.maze.failedToPlaceColorCodes.length > 0 && (
        <div>
          <div className="mb-2 text-center text-lg">
            Failed to Place {maze.maze.failedToPlaceColorCodes.length} Color
            Codes
          </div>
          <div className="flex w-full items-center justify-center">
            <div className="mb-2 max-w-md text-center text-xs">
              If you want to ensure all or more of the Color Codes get placed,
              try selecting a lower difficulty or a larger page size.
            </div>
          </div>
          <div className="text-2xs grid grid-cols-5 items-center justify-center gap-2">
            {maze.maze.failedToPlaceColorCodes.map((code) => (
              <div className="bg-secondary/50 p-1 text-center" key={code}>
                {code}
              </div>
            ))}
          </div>
        </div>
      )}
      <Button
        className={`${pixelifySans.className} flex items-center justify-center text-2xl`}
        type="button" // Changed to "button" to prevent form submission
        size={"lg"}
        onClick={handleDownloadPDF}
        disabled={isLoading} // Disable the button when loading
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 animate-spin" /> {/* Spinner Icon */}
            {t("downloading_pdf")}
          </>
        ) : (
          <>
            <Download className="mr-2" /> {t("download_pdf")}
          </>
        )}
      </Button>
    </>
  );
});

MazeGeneratorOutput.displayName = "MazeGeneratorOutput";

export default MazeGeneratorOutput;
