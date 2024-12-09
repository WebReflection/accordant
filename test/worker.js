import exports from '../src/worker.js';

exports({
  multiple: 'bindings',
});

exports({
  random: () => ({ Worker: Math.random() }),
});
