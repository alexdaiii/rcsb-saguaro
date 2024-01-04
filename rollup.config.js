import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import del from "rollup-plugin-delete";
import {dts} from "rollup-plugin-dts";
import postcss from "rollup-plugin-postcss";
import svg from "rollup-plugin-svg";

// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const pkg = require("./package.json");

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: pkg.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      del({targets: "dist/*"}),
      resolve(),
      postcss({
        extract: false,
        modules: true,
        use: ["sass"],
      }),
      svg(),
      commonjs(),
      typescript(),
      terser(),
    ],
    external: ["boxicons", "react", "react-dom"],
  },
  {
    input: "src/index.ts",
    output: [{file: "dist/types.d.ts", format: "es"}],
    plugins: [dts()],
  },
];
