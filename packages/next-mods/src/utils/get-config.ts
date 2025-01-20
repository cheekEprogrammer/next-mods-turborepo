import fs from "fs-extra";
import path from "path";
import { logger } from "./logger";

export interface NextModsConfig {
  packageManager: string;
  envFilename: string;
  isSrcProject: boolean;
  functions: string[];
}

export const getConfig = (): NextModsConfig | null => {
  try {
    const projectRoot = process.cwd();
    const configPath = path.join(projectRoot, "next-mods.json");

    if (!fs.existsSync(configPath)) {
      return null;
    }

    const config = fs.readJsonSync(configPath);
    return config as NextModsConfig;
  } catch (error: any) {
    logger.error(`* Failed to read next-mods.json: ${error.message}`);
    return null;
  }
};

export const saveConfig = (options: Partial<NextModsConfig>): boolean => {
  try {
    const projectRoot = process.cwd();
    const configPath = path.join(projectRoot, "next-mods.json");

    // Ensure a config exists
    let config: NextModsConfig;
    if (fs.existsSync(configPath)) {
      config = fs.readJsonSync(configPath);
    } else {
      logger.info("next-mods.json not found.");
      return false;
    }

    // Update existing configuration with provided options
    const updatedConfig = { ...config, ...options };

    // Write updated configuration back to the file
    fs.writeJsonSync(configPath, updatedConfig, { spaces: 2 });
    return true;
  } catch (error: any) {
    logger.error(`* Failed to save next-mods.json: ${error}`);
    return false;
  }
};

// Utility to add a function to the config
export const addFunction = (funcName: string): boolean => {
  const config = getConfig();
  if (!config) return false;

  if (!config.functions.includes(funcName)) {
    config.functions.push(funcName);
    return saveConfig({ functions: config.functions });
  } else {
    logger.warn(`Function "${funcName}" is already installed.`);
    return false;
  }
};

// Utility to delete a function from the config
export const removeFunction = (funcName: string): boolean => {
  const config = getConfig();
  if (!config) return false;

  const functionIndex = config.functions.indexOf(funcName);
  if (functionIndex > -1) {
    config.functions.splice(functionIndex, 1);
    return saveConfig({ functions: config.functions });
  } else {
    logger.info(`Function "${funcName}" not found in the installed functions.`);
    return false;
  }
};

// Utility to check if a function is installed
export const isFunctionInstalled = (funcName: string): boolean => {
  const config = getConfig();
  if (!config) return false;

  return config.functions.includes(funcName);
};
