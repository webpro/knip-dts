import { EOL } from 'node:os';
import path from 'node:path';
import ts from 'typescript';
import { createCustomModuleResolver } from './resolveModuleNames.js';
import { SourceFileManager } from './SourceFileManager.js';
import { createCustomSys } from './sys.js';

const libLocation = path.dirname(ts.getDefaultLibFilePath({}));

type CreateHostsOptions = {
  cwd: string;
  compilerOptions: ts.CompilerOptions;
  entryPaths: string[];
};

const fileManager = new SourceFileManager();

export const createHosts = ({ cwd, compilerOptions, entryPaths }: CreateHostsOptions) => {
  const sys = createCustomSys(cwd, []);
  const resolveModuleNames = createCustomModuleResolver(sys, compilerOptions, []);

  const languageServiceHost: ts.LanguageServiceHost = {
    getCompilationSettings: () => compilerOptions,
    getScriptFileNames: () => Array.from(entryPaths),
    getScriptVersion: () => '0',
    getScriptSnapshot: (fileName: string) => fileManager.getSnapshot(fileName),
    getCurrentDirectory: sys.getCurrentDirectory,
    getDefaultLibFileName: ts.getDefaultLibFilePath,
    readFile: sys.readFile,
    fileExists: sys.fileExists,
    resolveModuleNames
  };

  const compilerHost: ts.CompilerHost = {
    writeFile: () => undefined,
    getDefaultLibLocation: () => libLocation,
    getDefaultLibFileName: languageServiceHost.getDefaultLibFileName,
    getSourceFile: (fileName: string) => fileManager.getSourceFile(fileName),
    getCurrentDirectory: languageServiceHost.getCurrentDirectory,
    getCanonicalFileName: (fileName: string) => fileName,
    useCaseSensitiveFileNames: () => true,
    getNewLine: () => EOL,
    readFile: languageServiceHost.readFile,
    fileExists: languageServiceHost.fileExists,
    resolveModuleNames: languageServiceHost.resolveModuleNames
  };

  return { fileManager, languageServiceHost, compilerHost };
};
