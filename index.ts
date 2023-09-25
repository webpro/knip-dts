import ts from 'typescript';
import { resolve } from 'node:path';
import { createHosts } from './createHosts';

const cwd = resolve('./fixture');
const entry = resolve('./fixture/index.ts');
const dts = resolve('./fixture/assets.d.ts');

// I'd rather not even include `assets.d.ts` here yet, but find it like ts/c does
const entryPaths = [entry, dts];

const compilerOptions = {
  esModuleInterop: true,
  skipDefaultLibCheck: true,
  skipLibCheck: true,
  target: ts.ScriptTarget.Latest,
  module: ts.ModuleKind.NodeNext,
  moduleResolution: ts.ModuleResolutionKind.NodeNext,
  allowNonTsExtensions: true
};

const { compilerHost } = createHosts({
  cwd,
  compilerOptions,
  entryPaths
});

let program = ts.createProgram(entryPaths, compilerOptions, compilerHost);

// bind files/symbols
program.getTypeChecker();

console.log(program.getSourceFiles().map(s => s.fileName));

const sourceFile = program.getSourceFileByPath(entry);

// OK: resolvedModule
console.log(sourceFile?.resolvedModules?.get('./normal', /* mode */ undefined));

// NOK: resolvedModule
console.log(sourceFile?.resolvedModules?.get('./block.html?raw', /* mode */ undefined));

const dtsSourceFile = program.getSourceFileByPath(dts);
// console.log(dtsSourceFile); // OK: isDeclarationFile: true
