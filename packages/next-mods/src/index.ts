#!/usr/bin/env node
import { Command } from "commander";
import packageJson from "../package.json";
import { printLogo } from "./utils/logo";
import { init } from "./commands/init";
import { install } from "./commands/install";
import { uninstall } from "./commands/uninstall";

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

async function main() {
  const program = new Command();

  program
    .name("next-mods")
    .description("Add useful features to your Next.JS application.")
    .version(
      packageJson.version || "1.0.0",
      "-v, --version",
      "display the version number"
    )
    .hook("preAction", () => {
      // console.log(e, "E");
      // Print the logo before any command execution
      printLogo();
    });

  program.addCommand(init);
  program.addCommand(install);
  program.addCommand(uninstall);

  // Check if no arguments are provided, print logo and then help
  if (!process.argv.slice(2).length) {
    printLogo(); // Print the logo first
    program.outputHelp(); // Then output the help menu
  } else {
    // Parse user inputs
    program.parse(process.argv);
  }
}

main();
