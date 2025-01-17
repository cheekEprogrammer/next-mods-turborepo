import { Command } from "commander";
import { logger } from "../utils/logger";
import { getFunctions } from "../utils/fs";
import { printLogo } from "../utils/logo";

// Main add command
export const add = new Command()
  .name("add")
  .description("Add a function to your Next.js project.")
  .argument("<function>", "Name of the function to add")
  .action(async (functionName) => {
    const functions = await getFunctions();

    // Check if the function exists
    if (functions.has(functionName)) {
      const func = functions.get(functionName)!;
      logger.info(`> Adding ${functionName}...`);
      await func.execute();
    } else {
      logger.error(`Function '${functionName}' not found.`);
      logger.break();
      logger.info(
        `Available functions: ${Array.from(functions.keys()).join(", ")}`
      );
    }
  });
