import { withResolvers } from './utils.js';
import accordant from './accordant.js';

const { promise, resolve } = withResolvers();

accordant(self, promise);

export default resolve;
