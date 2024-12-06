import exports from '../src/worker.js';

exports({
  random: () => ({ Worker: Math.random() }),
});
