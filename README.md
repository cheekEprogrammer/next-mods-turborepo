# Next Mods

Add useful functions to your existing Next.JS application. Open source and free.

```
 _____         _      _____       _
|   | |___ _ _| |_   |     |___ _| |___
| | | | -_|_'_|  _|  | | | | . | . |_ -|
|_|___|___|_,_|_|    |_|_|_|___|___|___|
```

## Using Next Mods

Run the following command:

```sh
npx next-mods
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `packages/next-mods`: The cli tool for Next Mods
- `web`: a [Docusaurus](https://docusaurus.io/) document app
- `nextjs-demo`: [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `nextjs-demo` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Develop

To run the Turborepo in development mode, run the following commnands:

```
git clone https://github.com/next-mods/next-mods-turborepo.git
cd next-mods-turborepo
npm install
npm run dev
```
