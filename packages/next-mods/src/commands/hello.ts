import { Command } from "commander";
import { logger } from "../utils/logger";

export const hello = new Command()
  .name("hello")
  .description("a simple hello world command")
  // .option(
  //   "-c, --cwd <cwd>",
  //   "the working directory. defaults to the current directory.",
  //   process.cwd()
  // )
  .action(async (opts) => {
    logger.info("> Hello, world!");
    console.log("console.log run here...");
    // logger.break();
    // logger.info("> components.json");
    // console.log("console.log run here...");
    // console.log(cwd);
    // logger.info(`CWD: ${cwd}`);
    // console.log(await getConfig(opts.cwd));
  });
