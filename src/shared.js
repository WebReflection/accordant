import { withResolvers } from './utils.js';
import accordant from './accordant.js';

const { promise, resolve } = withResolvers();

addEventListener('connect', async ({ ports }) => {
  for (const port of ports) {
    accordant(port, promise);
    port.start();
  }
});

export default resolve;