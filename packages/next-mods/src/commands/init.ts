import { Command } from "commander";
import fs from "fs-extra";
import path from "path";
import { logger } from "../utils/logger";
import { input, confirm } from "@inquirer/prompts";
import { initEnvFileWithBlock } from "../utils/fs";
import { getConfig, NextModsConfig } from "../utils/get-config";
import { execSync } from "child_process";

export const init = new Command()
  .name("init")
  .description("Initialize next-mods configuration in your Next.js project.")
  .action(async () => {
    try {
      const projectRoot = process.cwd();
      const packageJsonPath = path.join(projectRoot, "package.json");
      const nextModsConfigPath = path.join(projectRoot, "next-mods.json");
      const tsconfigPath = path.join(projectRoot, "tsconfig.json");
      const appDirectory = path.join(projectRoot, "app");
      const srcAppDirectory = path.join(projectRoot, "src", "app");

      // Check if package.json exists
      if (!fs.existsSync(packageJsonPath)) {
        logger.error(
          "No package.json found in the current directory. Make sure you are in the root of your Next.js project."
        );
        return;
      }

      const config = getConfig();
      if (config) {
        logger.warn("Configuration file already exists in the project.");
        const overwrite = await confirm({
          message:
            "Do you want to re-initialize next mods? This will overwrite your existing settings.",
          default: false,
        });

        if (!overwrite) {
          logger.info("Cancelling initialization...");
          return;
        }
      }

      // Determine package manager
      let packageManager = "npm"; // Default to npm
      if (fs.existsSync(path.join(projectRoot, "yarn.lock"))) {
        packageManager = "yarn";
      } else if (fs.existsSync(path.join(projectRoot, "pnpm-lock.yaml"))) {
        packageManager = "pnpm";
      } else if (fs.existsSync(path.join(projectRoot, "package-lock.json"))) {
        packageManager = "npm";
      }
      logger.info(`Detected package manager: ${packageManager}`);

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

      // Check for TypeScript
      // Check if tsconfig.json exists
      if (!devDependencies?.typescript) {
        logger.warn(
          "TypeScript is not installed for this Next.js project. Setting it up..."
        );

        let installCommand;
        if (packageManager === "yarn") {
          installCommand = "yarn add typescript -D";
        } else if (packageManager === "pnpm") {
          installCommand = "pnpm add typescript -D";
        } else {
          installCommand = "npm install typescript --save-dev";
        }

        // Install TypeScript package
        logger.info(`> Installing TypeScript using ${packageManager}...`);
        execSync(installCommand, { stdio: "ignore" });
        logger.success("TypeScript installed successfully.");
      }

      // Check if tsconfig.json exists
      if (!fs.existsSync(tsconfigPath)) {
        logger.warn("No tsconfig.json found in the project. Creating one...");
        // Create tsconfig.json file
        fs.writeJsonSync(
          tsconfigPath,
          {
            compilerOptions: {
              target: "ES2017",
              lib: ["dom", "dom.iterable", "esnext"],
              allowJs: true,
              skipLibCheck: true,
              strict: true,
              noEmit: true,
              esModuleInterop: true,
              module: "esnext",
              moduleResolution: "bundler",
              resolveJsonModule: true,
              isolatedModules: true,
              jsx: "preserve",
              incremental: true,
              plugins: [
                {
                  name: "next",
                },
              ],
              baseUrl: fs.existsSync(srcAppDirectory) ? "src/" : ".",
              paths: {
                "@/*": ["./*"],
              },
            },
            include: [
              "next-env.d.ts",
              "**/*.ts",
              "**/*.tsx",
              ".next/types/**/*.ts",
            ],
            exclude: ["node_modules"],
          },
          { spaces: 2 }
        );
        logger.success("tsconfig.json created successfully.");
      }

      // Check for the presence of the app directory
      if (!fs.existsSync(appDirectory) && !fs.existsSync(srcAppDirectory)) {
        logger.error(
          "The project does not contain an app or src/app directory. Make sure your Next.js project uses the App Router."
        );
        return;
      }

      // logger.info("> Installing dependencies...");
      // if (packageManager === "yarn") {
      //   execSync("yarn add @next-mods/core", { stdio: "ignore" });
      // } else if (packageManager === "pnpm") {
      //   execSync("pnpm add @next-mods/core", { stdio: "ignore" });
      // } else {
      //   execSync("npm install @next-mods/core", { stdio: "ignore" });
      // }

      // Ask user for .env filename
      const envFilename = await input({
        message: "Enter the filename for your environment variables file:",
        default: ".env.local",
        validate: (value) => {
          if (value.startsWith(".env")) {
            return true;
          } else {
            return "Please enter a valid .env filename.";
          }
        },
      });

      initEnvFileWithBlock(envFilename);

      // Create or update next-mods.json
      const defaultConfig: NextModsConfig = {
        packageManager,
        isSrcProject: fs.existsSync(srcAppDirectory),
        envFilename,
        functions: [],
      };

      logger.info("Creating next-mods.json configuration file.");
      fs.writeJsonSync(nextModsConfigPath, defaultConfig, { spaces: 2 });

      logger.success("Project successfully initialized with next-mods!!");
      logger.info(
        `You can now add functions by running 'npx next-mods install <function>'.`
      );
    } catch (error) {
      logger.error("An error occurred during initialization:", error);
    }
  });
