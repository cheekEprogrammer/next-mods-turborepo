import { FunctionModule } from "../types";
import { logger } from "../utils/logger";

export const test: FunctionModule = {
  name: "test",
  description: 'Echoes "hello world" to the console.',
  execute: async () => {
    logger.success("Hello world");
  },
};
