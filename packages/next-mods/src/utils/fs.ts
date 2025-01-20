import fs from "fs-extra";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { FunctionModule } from "../types";
import { getConfig } from "./get-config";
import { logger } from "./logger";

// For ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = process.cwd();

const BLOCK_START = "# NEXT_MODS_START";
const BLOCK_END = "# NEXT_MODS_END";

export function initEnvFileWithBlock(envFilePath: string) {
  let envFileContent = "";

  // Check if env file exists and read its content.
  if (fs.existsSync(envFilePath)) {
    envFileContent = fs.readFileSync(envFilePath, "utf8");
  }

  // Check if the managed block is already present.
  const blockRegex = new RegExp(`\n${BLOCK_START}[\\s\\S]*?${BLOCK_END}`, "gm");
  if (!blockRegex.test(envFileContent)) {
    // Append the block if not present.
    const initBlock = `\n${BLOCK_START}\n${BLOCK_END}\n`;
    envFileContent += initBlock;

    fs.writeFileSync(envFilePath, envFileContent, "utf8");
    // console.log("> Initialized .env.local with NEXT_MODS block.");
  }
}

export function getInstalledFunctions() {
  const config = getConfig();
  if (!config) return;

  return config.functions;
}

export function getEnvVariables() {
  const config = getConfig();
  if (!config) return;
  if (!fs.existsSync(config.envFilename)) return;

  const content = fs.readFileSync(config.envFilename, "utf8");
  const blockRegex = new RegExp(`${BLOCK_START}[\\s\\S]*?${BLOCK_END}`, "gm");
  const match = blockRegex.exec(content);

  let managedVariables: { [key: string]: string } = {};

  if (match) {
    const managedContent = match[0];
    const lines = managedContent.split("\n");
    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith("#")) {
        const keyValue = trimmedLine.split("=");
        if (keyValue.length === 2) {
          const [key, value] = keyValue;
          if (key) {
            if (value) {
              managedVariables[key.trim()] = value.replace(/"/g, "").trim();
            }
          }
        }
      }
    });
  }

  return managedVariables;
}

function saveEnvVariables(
  variables: { [s: string]: unknown } | ArrayLike<unknown>
) {
  let envFileContent = "";

  const config = getConfig();
  if (!config) return;

  if (fs.existsSync(config.envFilename)) {
    envFileContent = fs.readFileSync(config.envFilename, "utf8");
    envFileContent = envFileContent.replace(
      new RegExp(`${BLOCK_START}[\\s\\S]*?${BLOCK_END}`, "gm"),
      ""
    );
  }

  const newManagedBlock = [
    BLOCK_START,
    ...Object.entries(variables).map(([key, value]) => `${key}="${value}"`),
    BLOCK_END,
  ].join("\n");

  envFileContent += `${newManagedBlock}`;

  fs.writeFileSync(config.envFilename, envFileContent, "utf8");
}

export function addEnvVariable(key: string, value: string) {
  const envVariables = getEnvVariables();
  if (!envVariables) return;

  envVariables[key] = value;
  saveEnvVariables(envVariables);
}

export function removeEnvVariable(key: string) {
  const envVariables = getEnvVariables();
  if (!envVariables) return;

  delete envVariables[key];
  saveEnvVariables(envVariables);
}

// Function loader
export const getFunctions = async (): Promise<Map<string, FunctionModule>> => {
  const functionsDir = path.resolve(__dirname, "./functions");
  const functionFiles = await fs.readdir(functionsDir);
  const functions = new Map<string, FunctionModule>();

  for (const file of functionFiles) {
    if (file.endsWith(".js")) {
      // Convert the file path to a URL that the dynamic import can handle.
      const filePath = path.join(functionsDir, file);
      const fileUrl = pathToFileURL(filePath).href;

      const funcModule = (await import(fileUrl)) as {
        [key: string]: FunctionModule;
      };
      const func = Object.values(funcModule)[0];

      if (func && func.name) {
        functions.set(func.name, func);
      }
    }
  }

  return functions;
};

// Utility to get a specific function by name
export const getFunctionByName = async (
  functionName: string
): Promise<FunctionModule | null> => {
  try {
    const functions = await getFunctions();
    return functions.get(functionName) || null;
  } catch (error) {
    logger.error(
      `*** ERROR: Failed to get function by name "${functionName}":`,
      error
    );
    return null;
  }
};
