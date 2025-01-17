import { Command } from "commander";
import fs from "fs-extra";
import path from "path";
import { logger } from "../utils/logger";

export const init = new Command()
  .name("init")
  .description("Initialize next-mods configuration in your Next.js project.")
  .action(async () => {
    try {
      const projectRoot = process.cwd();
      const packageJsonPath = path.join(projectRoot, "package.json");
      const nextModsConfigPath = path.join(projectRoot, "next-mods.json");
      const appDirectory = path.join(projectRoot, "app");
      const srcAppDirectory = path.join(projectRoot, "src", "app");

      // Check if package.json exists
      if (!fs.existsSync(packageJsonPath)) {
        logger.error(
          "No package.json found in the current directory. Make sure you are in the root of your Next.js project."
        );
        return;
      }

      // Read package.json
      const packageJson = fs.readJsonSync(packageJsonPath);

      // Check for Next.js dependency
      const { dependencies, devDependencies } = packageJson;
      const hasNextDependency = dependencies?.next || devDependencies?.next;

      if (!hasNextDependency) {
        logger.error(
          "Next.js is not listed as a dependency in your package.json."
        );
        logger.warn("Please run this command in a Next.js project.");
        return;
      }

      // Check for the presence of the app directory
      if (!fs.existsSync(appDirectory) && !fs.existsSync(srcAppDirectory)) {
        logger.error(
          "The project does not contain an app or src/app directory. Make sure your Next.js project uses the App Router."
        );
        return;
      }

      // Create or update next-mods.json
      const defaultConfig = {
        initialized: true,
        mods: [],
      };

      if (!fs.existsSync(nextModsConfigPath)) {
        logger.info("Creating next-mods.json configuration file.");
        fs.writeJsonSync(nextModsConfigPath, defaultConfig, { spaces: 2 });
      } else {
        logger.info("next-mods.json already exists. Skip creating.");
      }

      logger.success("Project successfully initialized with next-mods.");
    } catch (error) {
      logger.error("An error occurred during initialization:", error);
    }
  });
