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
import { Dices } from "lucide-react";
import NumberInput from "./ui/number-input";
import { COLOR_CODES, getAbbreviation } from "~/lib/generateMaze";

type PageSizeOptions = "A4" | "A3" | "US Letter" | "Legal";

const pageSizeOptions = [
  { value: "A4", label: "A4" },
  { value: "A3", label: "A3" },
  { value: "US Letter", label: "US Letter" },
  { value: "Legal", label: "Legal" },
];

type DifficultyOptions = "easy" | "medium" | "hard" | "custom";

const difficultyOptions = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
  { value: "custom", label: "Custom" },
];

type RevealHintsOptions = {
  colorCodes: boolean;
  quantities: boolean;
  commands: boolean;
};

const MazeForm = () => {
  const [title, setTitle] = useState("");
  const [pageSize, setPageSize] = useState<PageSizeOptions>("A4");
  const [difficulty, setDifficulty] = useState<DifficultyOptions>("easy");
  const [customCommands, setCustomCommands] = useState<string[]>([]);
  const [totalCommands, setTotalCommands] = useState(0);
  const [revealHints, setRevealHints] = useState<RevealHintsOptions>({
    colorCodes: false,
    quantities: false,
    commands: false,
  });
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New state variable

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsFormSubmitted(false);

    // Simulate a delay of 2 seconds
    setTimeout(() => {
      setIsLoading(false);
      setIsFormSubmitted(true);
    }, 2000);
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

  return (
    <div className="flex max-w-xl flex-col items-center justify-center gap-10">
      {/* <div></div> */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium">Title</label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Page Size Select */}
        <div>
          <label className="block text-sm font-medium">Page Size</label>
          <RadioGroup
            defaultValue="A4"
            className="mt-1"
            onValueChange={(value) => setPageSize(value as PageSizeOptions)}
          >
            {pageSizeOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
          <div className="mt-1 text-sm text-muted-foreground">
            Larger pages ease the constraints on the maze generation algorithm,
            generally resulting in more challenging mazes.
          </div>
        </div>

        {/* Difficulty RadioGroup */}
        <div>
          <label className="block text-sm font-medium">Difficulty</label>
          <RadioGroup
            defaultValue="medium"
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
                          {command.colors.map((color, index) => (
                            <>
                              {index === 0 && (
                                <div
                                  className="flex h-6 w-6 items-center justify-center text-xs font-medium"
                                  style={{
                                    backgroundColor: "#130c0e",
                                  }}
                                ></div>
                              )}
                              <div
                                key={`${command.name}-${color}-${index}`}
                                className="flex h-6 w-6 items-center justify-center text-xs font-medium"
                                style={{
                                  backgroundColor: color,
                                  color: ["#130c0e"].includes(color)
                                    ? "white"
                                    : "black",
                                }}
                              >
                                {getAbbreviation(color)}
                              </div>
                            </>
                          ))}
                          {command.name != "U-Turn (line end)" && (
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

        {/* Reveal Hints Checkboxes */}
        <div>
          <label className="block text-sm font-medium">Reveal Hints</label>
          <div className="mt-1 space-y-2">
            <div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="colorCodes"
                  checked={revealHints.colorCodes}
                  onCheckedChange={(checked) =>
                    setRevealHints((prev) => ({
                      ...prev,
                      colorCodes: !!checked,
                    }))
                  }
                />
                <label htmlFor="colorCodes">Usable Color Codes</label>
              </div>
              <div className="text-sm text-muted-foreground">
                Displays a list of all possible color codes used
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="commands"
                  checked={revealHints.commands}
                  onCheckedChange={(checked) =>
                    setRevealHints((prev) => ({
                      ...prev,
                      commands: !!checked,
                    }))
                  }
                />
                <label htmlFor="commands">Used Color Codes</label>
              </div>
              <div className="text-sm text-muted-foreground">
                Displays only necessary color codes that are used in the maze
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="quantities"
                  checked={revealHints.quantities}
                  onCheckedChange={(checked) =>
                    setRevealHints((prev) => ({
                      ...prev,
                      quantities: !!checked,
                    }))
                  }
                />
                <label htmlFor="quantities">Color Code Quantities</label>
              </div>
              <div className="text-sm text-muted-foreground">
                Displays the quantity next to each color code that is used
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
      {isLoading && <MazeLoading />} {/* Render MazeLoading during loading */}
      {isFormSubmitted && !isLoading && (
        <MazeGeneratorOutput
          data={{
            title,
            pageSize,
            difficulty,
            customCommands,
            totalCommands,
            revealHints,
          }}
        />
      )}
    </div>
  );
};

export default MazeForm;
