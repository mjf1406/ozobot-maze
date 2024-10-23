import { Card, CardContent } from "~/components/ui/card";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { InfoIcon, Download } from "lucide-react";
import { Button } from "./ui/button";
import { pixelifySans } from "~/app/fonts";
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { COLOR_CODES, generateMaze } from "~/lib/generateMaze";

export type MazeData = {
  title: string;
  pageSize: string;
  difficulty: string;
  customCommands: string[];
  totalCommands: number;
  revealHints: {
    colorCodes: boolean;
    quantities: boolean;
    commands: boolean;
  };
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
  "US Letter": {
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

type PageSizes = typeof pageSizes;
type PageSizeFormat = keyof typeof pageSizes;

const pageFormatMap = {
  A3: "a3",
  A4: "a4",
  A5: "a5",
  B4: "b4",
  "US Letter": "letter",
  Legal: "legal",
  "Ledger/Tabloid": "ledger",
};

type Props = {
  data: MazeData;
};

const MazeGeneratorOutput = ({ data }: Props) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const hasRevealedHints = Object.values(data.revealHints).some(
    (value) => value === true,
  );

  const handleDownloadPDF = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pageFormat = pageFormatMap[data.pageSize as PageSizeFormat] || "a4";

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: pageFormat,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
      pdf.save(`${data.title || "maze"}.pdf`);
    }
  };

  const maze = generateMaze(data);

  // Get dimensions from pageSizes
  const [width, height] = (
    pageSizes[data.pageSize as PageSizeFormat]?.pixels || ""
  )
    .split("×")
    .map((dim) => parseInt(dim.trim()));

  // Scale down the dimensions for screen display (e.g., 1/2 scale)
  const scale = 0.5;
  const scaledWidth = height ? `${Math.round(height * scale)}px` : "auto";
  const scaledHeight = width ? `${Math.round(width * scale)}px` : "auto";

  return (
    <>
      <Card
        ref={cardRef}
        className="relative border-none bg-white"
        id="output"
        style={{
          width: scaledWidth,
          height: scaledHeight,
          minHeight: "400px", // Fallback minimum height
          aspectRatio: width && height ? `${width} / ${height}` : "auto",
        }}
      >
        <CardContent className="p-3">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <div className="text-sm font-semibold">
                {data.title} Ozobot Maze
              </div>
              <div className="text-2xs text-muted-foreground">
                {new Date().toLocaleDateString()}
              </div>
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
          <div className="grid grid-cols-5">
            {hasRevealedHints && (
              <div className="col-span-1 h-full rounded-lg bg-gray-100 p-2">
                <div className="w-full text-center text-sm font-semibold">
                  Key
                </div>
                {Object.entries(data.revealHints).map(
                  ([key, isRevealed]) =>
                    isRevealed && (
                      <Alert
                        key={key}
                        variant="default"
                        className="bg-muted/50"
                      >
                        <InfoIcon className="h-4 w-4" />
                        <AlertDescription>
                          Hint:{" "}
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1),
                            )
                            .join(" ")}{" "}
                          Displayed
                        </AlertDescription>
                      </Alert>
                    ),
                )}
              </div>
            )}
            <div className="rounded-lg p-4 font-mono">
              <pre>{maze}</pre>
            </div>
          </div>
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
