import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const plugins = [
  nodeResolve(),
  terser(),
];

if (process.env.NO_MIN) plugins.pop();

export default [
  {
    plugins,
    input: './src/main.js',
    output: {
      esModule: true,
      file: './dist/main.js',
    }
  },
  {
    plugins,
    input: './src/transferable.js',
    output: {
      esModule: true,
      file: './dist/transferable.js',
    }
  },
  {
    plugins,
    input: './src/shared.js',
    output: {
      esModule: true,
      file: './dist/shared.js',
    }
  },
  {
    plugins,
    input: './src/worker.js',
    output: {
      esModule: true,
      file: './dist/worker.js',
    }
  },
];
