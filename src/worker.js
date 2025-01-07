import { assign, broadcast, forIt, withResolvers } from './utils.js';
import accordant from './accordant.js';

const { promise, resolve } = withResolvers();

const ffi = {};

const eh = accordant(self, promise);

const $broadcast = async (...args) => {
  while (!eh[broadcast]) await forIt();
  postMessage([eh[broadcast], 0, eh[broadcast], args]);
};

const exports = bindings => resolve(assign(ffi, bindings));
export { $broadcast as broadcast, exports };
