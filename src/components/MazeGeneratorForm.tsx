// components/MazeForm.tsx

"use client";

import { useState, useEffect } from "react";
import MazeGeneratorOutput from "./MazeGeneratorOutput";
import MazeLoading from "./MazeLoading";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { pixelifySans } from "~/app/fonts";
import { AlertTriangle, Dices, X } from "lucide-react";
import NumberInput from "./ui/number-input";
import { COLOR_CODES, generateMaze, getAbbreviation } from "~/lib/generateMaze";
import type { PaperSize } from "~/lib/printingFunctions";

const PaperSize = [
  { value: "A4", label: "A4" },
  { value: "A3", label: "A3" },
  { value: "Letter", label: "Letter" },
  { value: "Legal", label: "Legal" },
];

type DifficultyOptions = "easy" | "medium" | "hard" | "custom";

export type Maze = {
  mazeText: string;
  colorCodeQuantities: Record<string, number>;
  usedColorCodes?: typeof COLOR_CODES;
  grid: number[][];
};

const difficultyOptions = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
  { value: "custom", label: "Custom" },
];

type RevealColorCodesOptions = "none" | "usable" | "used";

type RevealHintsOptions = {
  revealColorCodes: RevealColorCodesOptions;
  quantities: boolean;
};

const MazeForm = () => {
  const [title, setTitle] = useState("");
  const [pageSize, setPageSize] = useState<PaperSize>("A4");
  const [difficulty, setDifficulty] = useState<DifficultyOptions>("easy");
  const [customCommands, setCustomCommands] = useState<string[]>([]);
  const [totalCommands, setTotalCommands] = useState(0);
  const [revealHints, setRevealHints] = useState<RevealHintsOptions>({
    revealColorCodes: "none",
    quantities: false,
  });
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // New state to hold the data used to generate the output
  // components/MazeForm.tsx

  const [outputData, setOutputData] = useState<{
    title: string;
    pageSize: PaperSize;
    difficulty: DifficultyOptions;
    customCommands: string[];
    totalCommands: number;
    revealHints: RevealHintsOptions;
    maze: Maze; // Include the maze in the type
  } | null>(null);

  // components/MazeForm.tsx

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsFormSubmitted(false);

    const mazeData = {
      title,
      pageSize,
      difficulty,
      customCommands,
      totalCommands,
      revealHints,
    };

    const maze = await generateMaze(mazeData);

    setOutputData({
      ...mazeData,
      maze,
    });

    setIsLoading(false);
    setIsFormSubmitted(true);
  };

  // Scroll to output when form is submitted
  useEffect(() => {
    if (isFormSubmitted) {
      const outputElement = document.getElementById("output");
      if (outputElement) {
        outputElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [isFormSubmitted]);

  // Effect to uncheck and disable quantities when revealColorCodes is 'none'
  useEffect(() => {
    if (revealHints.revealColorCodes === "none" && revealHints.quantities) {
      setRevealHints((prev) => ({
        ...prev,
        quantities: false,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealHints.revealColorCodes]);

  return (
    <div className="flex max-w-xl flex-col items-center justify-center gap-10">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium">Title</label>
          <div className="relative">
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 pr-10"
            />
            {title && (
              <Button
                size={"icon"}
                variant={"ghost"}
                onClick={() => setTitle("")}
                className="absolute inset-y-0 right-0 flex items-center"
              >
                <X size={20} />
              </Button>
            )}
          </div>
        </div>

        {/* Page Size Select */}
        <div>
          <label className="block text-sm font-medium">Page Size</label>
          <RadioGroup
            defaultValue={pageSize}
            className="mt-1"
            onValueChange={(value) => setPageSize(value as PaperSize)}
          >
            {PaperSize.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
          {/* Alert if pageSize has changed after maze generation */}
          {isFormSubmitted &&
            outputData &&
            pageSize !== outputData.pageSize && (
              <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
                <AlertTriangle size={16} /> Page size has changed. Please
                generate a new maze.
              </div>
            )}
          <div className="mt-1 text-sm text-muted-foreground">
            Larger pages ease the constraints on the maze generation algorithm,
            generally resulting in more challenging mazes.
          </div>
        </div>

        {/* Difficulty RadioGroup */}
        <div>
          <label className="block text-sm font-medium">Difficulty</label>
          <RadioGroup
            defaultValue={difficulty}
            className="mt-1"
            onValueChange={(value) => setDifficulty(value as DifficultyOptions)}
          >
            {difficultyOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={`difficulty-${option.value}`}
                />
                <Label htmlFor={`difficulty-${option.value}`}>
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {/* Alert if difficulty has changed after maze generation */}
          {isFormSubmitted &&
            outputData &&
            difficulty !== outputData.difficulty && (
              <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
                <AlertTriangle size={16} /> Difficulty has changed. Please
                generate a new maze.
              </div>
            )}
          <div className="mt-1 text-sm text-muted-foreground">
            As the difficulty decreases, fewer color codes are required to solve
            the maze, and there are also fewer possible color code combinations.
          </div>

          {/* Custom Commands Selection */}
          {difficulty === "custom" && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium">
                  Select Commands to Use
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {COLOR_CODES.map((command) => (
                    <div
                      key={command.name}
                      className="flex items-center space-x-3"
                    >
                      <Checkbox
                        id={command.name}
                        checked={customCommands.includes(command.name)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setCustomCommands((prev) => [
                              ...prev,
                              command.name,
                            ]);
                          } else {
                            setCustomCommands((prev) =>
                              prev.filter((c) => c !== command.name),
                            );
                          }
                        }}
                      />
                      <div className="flex flex-1 items-center justify-between space-x-2">
                        <label htmlFor={command.name} className="text-sm">
                          {command.name}
                        </label>
                        <div className="flex">
                          <div
                            className="flex h-6 w-6 items-center justify-center text-xs font-medium"
                            style={{
                              backgroundColor: "#130c0e",
                            }}
                          ></div>
                          {command.colors.map((color, index) => (
                            <div
                              key={`${command.name}-${color}-${index}`}
                              className="flex h-6 w-6 items-center justify-center text-xs font-medium"
                              style={{
                                backgroundColor: color,
                                color: ["#000000"].includes(color)
                                  ? "white"
                                  : "black",
                              }}
                            >
                              {getAbbreviation(color)}
                            </div>
                          ))}
                          {command.name !== "U-Turn (line end)" && (
                            <div
                              className="flex h-6 w-6 items-center justify-center text-xs font-medium"
                              style={{
                                backgroundColor: "#130c0e",
                              }}
                            ></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Total number of color codes
                </label>
                <NumberInput
                  value={totalCommands}
                  onChange={(e) =>
                    setTotalCommands(parseInt(e.target.value, 10))
                  }
                  min={1}
                  max={10}
                  step={1}
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </div>

        {/* Additional Hints */}
        <div>
          <div className="mt-1 space-y-6">
            {/* Reveal Color Codes RadioGroup */}
            <div>
              <label className="block text-sm font-medium">
                Reveal Color Codes
              </label>
              <RadioGroup
                value={revealHints.revealColorCodes}
                onValueChange={(value) =>
                  setRevealHints((prev) => ({
                    ...prev,
                    revealColorCodes: value as RevealColorCodesOptions,
                  }))
                }
                className="mt-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="reveal-color-codes-none" />
                  <Label htmlFor="reveal-color-codes-none">None</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="usable"
                    id="reveal-color-codes-usable"
                  />
                  <Label htmlFor="reveal-color-codes-usable">
                    Usable Color Codes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="used" id="reveal-color-codes-used" />
                  <Label htmlFor="reveal-color-codes-used">
                    Used Color Codes
                  </Label>
                </div>
              </RadioGroup>
              <div className="mt-1 text-sm text-muted-foreground">
                Choose which color codes to reveal in the maze output.
              </div>
            </div>

            {/* Color Code Quantities Checkbox */}
            <div>
              <label className="block text-sm font-medium">Hints</label>
              <div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="quantities"
                    checked={revealHints.quantities}
                    disabled={revealHints.revealColorCodes === "none"}
                    onCheckedChange={(checked) =>
                      setRevealHints((prev) => ({
                        ...prev,
                        quantities: !!checked,
                      }))
                    }
                  />
                  <label htmlFor="quantities">Color Code Quantities</label>
                </div>
                {revealHints.revealColorCodes === "none" && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertTriangle size={16} /> Reveal Color Codes to enable
                    this checkbox.
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  Displays the quantity next to each color code that is used.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          className={`${pixelifySans.className} w-full text-2xl`}
          type="submit"
          size={"lg"}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex">
              <Dices className="mr-2 animate-spin" /> Generate Maze
            </div>
          ) : (
            <div className="flex">
              <Dices className="mr-2" /> Generate Maze
            </div>
          )}
        </Button>
      </form>
      {/* Conditional Rendering */}
      {isLoading && <MazeLoading />}
      {isFormSubmitted && !isLoading && outputData && (
        <MazeGeneratorOutput
          data={{
            ...outputData,
            title,
            revealHints,
          }}
        />
      )}
    </div>
  );
};

export default MazeForm;
