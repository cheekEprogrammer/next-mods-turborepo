import fs from "fs-extra";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { FunctionModule } from "../types";

// For ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
