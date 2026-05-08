import esbuild from "esbuild";
import process from "process";

const watchesSource = process.argv.slice(2).includes("watch");

const ctx = await esbuild.context({
  entryPoints: ["src/main.ts"],
  outfile: "main.js",

  bundle: true,
  external: ["obsidian"],
  format: "cjs",
  minify: !watchesSource,
  sourcemap: watchesSource ? "inline" : false,
  target: "es2022",
  logLevel: "info",
  treeShaking: true,
});

if (watchesSource) {
  await ctx.watch();
} else {
  await ctx.rebuild();
  process.exit(0);
}
