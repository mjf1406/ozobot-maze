// src/components/MazeForm.tsx

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
import type { PaperSize } from "~/lib/printingFunctions";
import { useI18n } from "locales/client";
import {
  COLOR_CODES,
  type Cell,
  generateOutput,
  getAbbreviation,
} from "~/lib/generateOutput";

export type TranslationKey =
  | "form_title"
  | "form_title_placeholder"
  | "form_clear_title"
  | "form_page_size"
  | "form_page_size_A4"
  | "form_page_size_A3"
  | "form_page_size_Letter"
  | "form_page_size_Legal"
  | "form_page_size_alert"
  | "form_page_size_desc"
  | "form_difficulty"
  | "difficulty_very_easy"
  | "difficulty_easy"
  | "difficulty_easy_medium"
  | "difficulty_medium"
  | "difficulty_medium_hard"
  | "difficulty_hard"
  | "difficulty_very_hard"
  | "difficulty_super_hard"
  | "difficulty_extreme"
  | "difficulty_custom"
  | "form_difficulty_alert"
  | "form_difficulty_desc"
  | "form_difficulty_custom"
  | "form_difficulty_custom_total_codes"
  | "form_reveal_color_codes"
  | "form_reveal_color_codes_none"
  | "form_usable_color_codes"
  | "form_used_color_codes"
  | "form_choose_reveal_color_codes"
  | "form_hint"
  | "form_color_code_quantities"
  | "form_reveal_color_codes_enable_checkbox"
  | "form_display_quantity_next_to_color_code"
  | "form_generate_maze"
  | "form_type"
  | "form_type_ozobot_maze"
  | "form_type_ozobot_city_challenge" // Updated TranslationKey
  | "form_type_ozobot_road_challenge" // Added TranslationKey
  | "form_type_alert"
  | "form_type_desc"; // Added TranslationKey for description

const PaperSizeOptions: Array<{ value: PaperSize; labelKey: TranslationKey }> =
  [
    { value: "A4", labelKey: "form_page_size_A4" },
    { value: "A3", labelKey: "form_page_size_A3" },
    { value: "Letter", labelKey: "form_page_size_Letter" },
    { value: "Legal", labelKey: "form_page_size_Legal" },
  ];

export type DifficultyOptions =
  | "easy-low"
  | "easy"
  | "easy-medium"
  | "medium"
  | "medium-hard"
  | "hard"
  | "hard-high"
  | "hard-super"
  | "hard-extreme"
  | "custom";

// Updated MazeTypeOptions to include new types
export type MazeTypeOptions =
  | "ozobot_maze"
  | "ozobot_city_challenge"
  | "ozobot_road_challenge";

export type Maze = {
  mazeText: string;
  colorCodeQuantities: Record<string, number>;
  usedColorCodes?: typeof COLOR_CODES;
  grid: Cell[][];
};

const difficultyOptions: Array<{
  value: DifficultyOptions;
  labelKey: TranslationKey;
}> = [
  { value: "easy-low", labelKey: "difficulty_very_easy" },
  { value: "easy", labelKey: "difficulty_easy" },
  { value: "easy-medium", labelKey: "difficulty_easy_medium" },
  { value: "medium", labelKey: "difficulty_medium" },
  { value: "medium-hard", labelKey: "difficulty_medium_hard" },
  { value: "hard", labelKey: "difficulty_hard" },
  { value: "hard-high", labelKey: "difficulty_very_hard" },
  { value: "hard-super", labelKey: "difficulty_super_hard" },
  { value: "hard-extreme", labelKey: "difficulty_extreme" },
  { value: "custom", labelKey: "difficulty_custom" },
];

// Updated mazeTypeOptions array to include new types with corresponding labelKeys
const mazeTypeOptions: Array<{
  value: MazeTypeOptions;
  labelKey: TranslationKey;
}> = [
  { value: "ozobot_maze", labelKey: "form_type_ozobot_maze" },
  {
    value: "ozobot_city_challenge",
    labelKey: "form_type_ozobot_city_challenge",
  }, // Added
  {
    value: "ozobot_road_challenge",
    labelKey: "form_type_ozobot_road_challenge",
  }, // Added
];

type RevealColorCodesOptions = "none" | "usable" | "used";

type RevealHintsOptions = {
  revealColorCodes: RevealColorCodesOptions;
  quantities: boolean;
};

const MazeForm = () => {
  const t = useI18n();
  const [title, setTitle] = useState("");
  const [pageSize, setPageSize] = useState<PaperSize>("A4");
  const [difficulty, setDifficulty] = useState<DifficultyOptions>("easy");
  const [customCommands, setCustomCommands] = useState<string[]>([]);
  const [totalCommands, setTotalCommands] = useState(0);
  const [revealHints, setRevealHints] = useState<RevealHintsOptions>({
    revealColorCodes: "none",
    quantities: false,
  });
  const [mazeType, setMazeType] = useState<MazeTypeOptions>("ozobot_maze"); // Updated default state
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Updated outputData type to include the new mazeType
  const [outputData, setOutputData] = useState<{
    title: string;
    pageSize: PaperSize;
    difficulty: DifficultyOptions;
    customCommands: string[];
    totalCommands: number;
    revealHints: RevealHintsOptions;
    mazeType: MazeTypeOptions; // Include the type in the output
    maze: Maze; // Include the maze in the type
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    setIsFormSubmitted(false);

    const mazeData = {
      title,
      pageSize,
      difficulty,
      customCommands,
      totalCommands,
      revealHints,
      mazeType,
    };

    const maze = await generateOutput(mazeData);
    console.log("🚀 ~ handleSubmit ~ maze:", maze);

    setTimeout(() => {
      setOutputData({
        ...mazeData,
        maze,
      });

      setIsLoading(false);
      setIsFormSubmitted(true);
    }, 0);
  };

  // Scroll to output when form is submitted
  useEffect(() => {
    if (isFormSubmitted) {
      const outputElement = document.getElementById("generate");
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

  // Updated effect to handle new maze types
  useEffect(() => {
    if (
      mazeType === "ozobot_city_challenge" ||
      mazeType === "ozobot_road_challenge"
    ) {
      setRevealHints({
        revealColorCodes: "used",
        quantities: true,
      });
    } else if (mazeType === "ozobot_maze") {
      setRevealHints({
        revealColorCodes: "none",
        quantities: false,
      });
    }
  }, [mazeType]);

  return (
    <div className="flex max-w-xl flex-col items-center justify-center gap-10">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium">{t("form_title")}</label>
          <div className="relative">
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 pr-10"
              placeholder={t("form_title_placeholder")}
            />
            {title && (
              <Button
                size={"icon"}
                variant={"ghost"}
                onClick={() => setTitle("")}
                className="absolute inset-y-0 right-0 flex items-center"
                aria-label={t("form_clear_title")}
              >
                <X size={20} />
              </Button>
            )}
          </div>
        </div>

        {/* Updated Maze Type RadioGroup */}
        <div>
          <label className="block text-sm font-medium">{t("form_type")}</label>
          <RadioGroup
            value={mazeType}
            className="mt-1"
            onValueChange={(value) => setMazeType(value as MazeTypeOptions)}
          >
            {mazeTypeOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={`type-${option.value}`}
                />
                <Label htmlFor={`type-${option.value}`}>
                  {t(option.labelKey)}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {/* Alert if mazeType has changed after maze generation */}
          {isFormSubmitted &&
            outputData &&
            mazeType !== outputData.mazeType && (
              <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
                <AlertTriangle size={16} /> {t("form_type_alert")}
              </div>
            )}
          <div className="mt-1 text-sm text-muted-foreground">
            {t("form_type_desc")}{" "}
            {/* Ensure this key exists in your translations */}
          </div>
        </div>

        {/* Page Size Select */}
        <div>
          <label className="block text-sm font-medium">
            {t("form_page_size")}
          </label>
          <RadioGroup
            value={pageSize}
            className="mt-1"
            onValueChange={(value) => setPageSize(value as PaperSize)}
          >
            {PaperSizeOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={`page-size-${option.value}`}
                />
                <Label htmlFor={`page-size-${option.value}`}>
                  {t(option.labelKey)}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {/* Alert if pageSize has changed after maze generation */}
          {isFormSubmitted &&
            outputData &&
            pageSize !== outputData.pageSize && (
              <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
                <AlertTriangle size={16} /> {t("form_page_size_alert")}
              </div>
            )}
          <div className="mt-1 text-sm text-muted-foreground">
            {t("form_page_size_desc")}
          </div>
        </div>

        {/* Difficulty RadioGroup */}
        <div>
          <label className="block text-sm font-medium">
            {t("form_difficulty")}
          </label>
          <RadioGroup
            value={difficulty}
            className="mt-1 flex flex-wrap"
            onValueChange={(value) => setDifficulty(value as DifficultyOptions)}
          >
            {difficultyOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={`difficulty-${option.value}`}
                />
                <Label htmlFor={`difficulty-${option.value}`}>
                  {t(option.labelKey)}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {/* Alert if difficulty has changed after maze generation */}
          {isFormSubmitted &&
            outputData &&
            difficulty !== outputData.difficulty && (
              <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
                <AlertTriangle size={16} /> {t("form_difficulty_alert")}
              </div>
            )}
          <div className="mt-1 text-sm text-muted-foreground">
            {t("form_difficulty_desc")}
          </div>

          {/* Custom Commands Selection */}
          {difficulty === "custom" && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium">
                  {t("form_difficulty_custom")}
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
                  {t("form_difficulty_custom_total_codes")}
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
                {t("form_reveal_color_codes")}
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
                  <Label htmlFor="reveal-color-codes-none">
                    {t("form_reveal_color_codes_none")}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="usable"
                    id="reveal-color-codes-usable"
                  />
                  <Label htmlFor="reveal-color-codes-usable">
                    {t("form_usable_color_codes")}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="used" id="reveal-color-codes-used" />
                  <Label htmlFor="reveal-color-codes-used">
                    {t("form_used_color_codes")}
                  </Label>
                </div>
              </RadioGroup>
              <div className="mt-1 text-sm text-muted-foreground">
                {t("form_choose_reveal_color_codes")}
              </div>
            </div>

            {/* Color Code Quantities Checkbox */}
            <div>
              <label className="block text-sm font-medium">
                {t("form_hint")}
              </label>
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
                  <label htmlFor="quantities">
                    {t("form_color_code_quantities")}
                  </label>
                </div>
                {revealHints.revealColorCodes === "none" && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertTriangle size={16} />{" "}
                    {t("form_reveal_color_codes_enable_checkbox")}
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  {t("form_display_quantity_next_to_color_code")}
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
          id="generate"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex">
              <Dices className="mr-2 animate-spin" /> {t("form_generate_maze")}
            </div>
          ) : (
            <div className="flex">
              <Dices className="mr-2" /> {t("form_generate_maze")}
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
