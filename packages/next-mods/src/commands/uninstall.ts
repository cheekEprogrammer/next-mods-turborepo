import { Command } from "commander";
import { logger } from "../utils/logger";
import { getFunctionByName, getInstalledFunctions } from "../utils/fs";
import { getConfig, removeFunction } from "../utils/get-config";

// Main uninstall command
export const uninstall = new Command()
  .name("uninstall")
  .description("Uninstalls a function from your Next.js project.")
  .argument("<function>", "Name of the function to uninstall")
  .action(async (functionName) => {
    // Check if config exists
    const config = getConfig();
    if (!config) {
      logger.error("Next Mods is not initialized.");
      logger.warn("Please run 'npx next-mods init' first.");
      return;
    }

    const functions = getInstalledFunctions() || [];

    // Check if the function is already installed
    if (functions?.includes(functionName)) {
      const func = await getFunctionByName(functionName);
      if (func && func.uninstall) {
        try {
          logger.info(`> Uninstalling ${functionName}`);
          await func.uninstall();
          removeFunction(functionName);
          logger.info(`> ${functionName} has been successfully uninstalled.`);
        } catch (error) {
          logger.error(`> Failed to uninstall ${functionName}: ${error}`);
        }
      } else {
        logger.error(`> Uninstall script for ${functionName} not found.`);
      }
    } else {
      logger.error(`> ${functionName} is not installed.`);
      logger.break();
      logger.info(
        `> Installed functions: ${functions.length > 0 ? functions.join(", ") : "none"}`
      );
    }
  });
