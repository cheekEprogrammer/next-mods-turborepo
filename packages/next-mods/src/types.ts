export interface FunctionModule {
  name: string;
  description: string;
  execute: () => Promise<void>;
}
