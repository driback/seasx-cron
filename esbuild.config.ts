import { build } from "esbuild";

build({
  entryPoints: ["./src/index.ts"],
  minify: true,
  bundle: true,
  platform: "node",
  target: "node20.10.0",
  outdir: "./dist",
  banner: {
    js: "import { createRequire as topLevelCreateRequire } from 'module';\n const require = topLevelCreateRequire(import.meta.url);",
  },
});
