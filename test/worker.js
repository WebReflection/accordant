import { broadcast, exports } from '../src/worker.js';

exports({
  multiple: () => 'bindings',
});

exports({
  random: () => ({ Worker: Math.random() }),
});

broadcast('worker:connected');
