import exports from '../src/shared.js';

exports({
  random: () => ({ SharedWorker: Math.random() }),
});
