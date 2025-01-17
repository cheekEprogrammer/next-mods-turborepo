#!/usr/bin/env node
import { Command } from "commander";
import packageJson from "../package.json";
import { hello } from "./commands/hello";

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

async function main() {
  const program = new Command();

  program
    .name("next-mods")
    .description("Add useful features to your next.js application...")
    .version(
      packageJson.version || "1.0.0",
      "-v, --version",
      "display the version number"
    );

  program.addCommand(hello);

  program.parse();
}

main();
