import { Command } from "commander";
import { logger } from "../utils/logger";
import { getFunctions } from "../utils/fs";
import { getConfig, saveConfig } from "../utils/get-config";

// Install command
export const install = new Command()
  .name("install")
  .description("Installs a function into your Next.js project.")
  .argument("<function>", "Name of the function to install")
  .argument("[options...]", "Options for the function (optional)")
  .action(async (functionName, options) => {
    const functions = await getFunctions();
    // Check if the function exists
    if (functions.has(functionName)) {
      // Check if function is already added to next-mods config
      const config = getConfig();

      if (!config) {
        logger.error("Next Mods is not initialized.");
        logger.warn("Please run 'npx next-mods init' first.");
        return;
      }

      if (
        config &&
        config.functions.includes(functionName) &&
        !options.includes("repair")
      ) {
        logger.error(`Function '${functionName}' is already installed.`);
        logger.warn(
          `If you want to repair it, please run 'npx next-mods install ${functionName} repair'.`
        );
        return;
      }

      if (
        !config.functions.includes(functionName) &&
        options.includes("repair")
      ) {
        logger.error(
          `Unable to repair '${functionName}'. It's not installed yet.`
        );
        logger.warn(
          `Please run 'npx next-mods install ${functionName}' instead.`
        );
        return;
      }

      const func = functions.get(functionName)!;
      logger.info(
        `> ${options.includes("repair") ? "Repairing" : "Installing"} ${functionName}...`
      );

      try {
        await func.install(options);

        if (!options.includes("repair")) {
          config?.functions.push(functionName);
          saveConfig(config);
        }

        logger.success(
          `Function '${functionName}' ${options.includes("repair") ? "repaired" : "installed"} successfully.`
        );
      } catch (error) {
        logger.error(`Failed to install ${functionName}: ${error}`);
      }
    } else {
      logger.error(`Function '${functionName}' not found.`);
      logger.break();
      logger.info(
        `Available functions: ${Array.from(functions.keys()).join(", ")}`
      );
    }
  });
