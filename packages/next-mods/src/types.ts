// Define the structure for an option
interface CommandOption {
  flags: string; // The CLI flag (e.g., '--no-middleware')
  description: string; // Description of what the option does
}

// Update the FunctionModule to include options
export interface FunctionModule {
  name: string; // Name of the function/command
  description: string; // Description of the command
  options?: CommandOption[]; // Array of available options/flags
  install: (options?: Record<string, any>) => Promise<void>; // Function to execute, accepting parsed options
  uninstall: (options?: Record<string, any>) => Promise<void>; // Function to execute, accepting parsed options
}
