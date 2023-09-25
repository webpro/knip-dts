# Knip DTS

```
npx tsx index.ts
```

## Issues

See [index.ts](./index.ts):

- How to make sure `'./block.html?raw'` is resolved from `fixture/index.ts` using
  `sourceFile.resolvedModules?.get('./block.html?raw')`?
- How to add DTS files (`assets.d.ts`) to the program like e.g. `tsc` does implicitly?
