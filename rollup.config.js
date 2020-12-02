import babel from "@rollup/plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve";

const extensions = [".ts", ".js"];

export default {
  // Entry point for transpiled code
  input: "src/lambdas/add.ts",
  // Do not bundle these libraries (aws-sdk is included in all lambda runtimes)
  external: ["aws-sdk"],
  output: {
    // Folder to dump output
    dir: "dist",
    // Transpile to CommonJS
    format: "cjs",
    // Include sourcemaps in the output files
    sourcemap: "inline",
  },
  plugins: [
    // Plugin to in-line all dependency libraries. This is expecially useful
    //   for lambdas because we can essentially make all-in-one executables.
    nodeResolve({
      // Ensure that ts and js files are included
      extensions,
    }),
    // Plugin to run babel transpiler on code. Will take our babel config
    //   into account.
    //
    // The babel config will transpile typescript to javascript and package
    //   the project assuming a Node 12 execution environment.
    babel({
      // In-line babel helper functions and more
      babelHelpers: "bundled",
      // Ensure that ts and js files are included
      extensions,
    }),
  ],
};
