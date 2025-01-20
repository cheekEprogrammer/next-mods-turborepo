import { logger } from "../utils/logger";
import packageJson from "../../package.json";
import { highlighter } from "../utils/highlighter";

// Define the ASCII logo
const logoLines = [
  " _____         _      _____       _       ",
  "|   | |___ _ _| |_   |     |___ _| |___   ",
  "| | | | -_|_'_|  _|  | | | | . | . |_ -|  ",
  "|_|___|___|_,_|_|    |_|_|_|___|___|___|  ",
];

// Function to apply colors using highlighter
const colorizeLogo = (lines: string[]): string => {
  return lines
    .map((line, index) => {
      // Alternate colors for each line (example pattern)
      switch (index % 4) {
        case 0:
          return highlighter.info(line);
        case 1:
          return highlighter.success(line);
        case 2:
          return highlighter.warn(line);
        case 3:
          return highlighter.error(line);
        default:
          return line;
      }
    })
    .join("\n");
};

// Log the colored logo
export const printLogo = () => {
  logger.info(colorizeLogo(logoLines));
  logger.info(`Next Mods v${packageJson.version}\n`);
};
