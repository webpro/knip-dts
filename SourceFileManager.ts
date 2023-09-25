import ts from 'typescript';

const isInternal = (p: string) => true;

export class SourceFileManager {
  sourceFileCache: Map<string, ts.SourceFile | undefined> = new Map();
  snapshotCache: Map<string, ts.IScriptSnapshot | undefined> = new Map();

  createSourceFile(filePath: string, contents: string) {
    const setParentNodes = isInternal(filePath);
    const sourceFile = ts.createSourceFile(filePath, contents, ts.ScriptTarget.Latest, setParentNodes);
    this.sourceFileCache.set(filePath, sourceFile);
    return sourceFile;
  }

  getSourceFile(filePath: string) {
    if (this.sourceFileCache.has(filePath)) return this.sourceFileCache.get(filePath);
    const contents = ts.sys.readFile(filePath);
    if (typeof contents !== 'string') {
      if (isInternal(filePath)) throw new Error(`Unable to read ${filePath}`);
      return this.createSourceFile(filePath, '');
    }
    const compiled = contents;
    return this.createSourceFile(filePath, compiled);
  }

  getSnapshot(filePath: string) {
    if (this.snapshotCache.has(filePath)) return this.snapshotCache.get(filePath);
    const sourceFile = this.getSourceFile(filePath);
    if (!sourceFile) return undefined;
    const snapshot = ts.ScriptSnapshot.fromString(sourceFile.text);
    this.snapshotCache.set(filePath, snapshot);
    return snapshot;
  }
}
