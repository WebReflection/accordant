import { assign, withResolvers } from './utils.js';
import accordant from './accordant.js';

const { promise, resolve } = withResolvers();

const ffi = {};

accordant(self, promise);

export default bindings => resolve(assign(ffi, bindings));
