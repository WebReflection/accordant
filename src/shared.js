import { assign, broadcast , forIt, withResolvers } from './utils.js';
import accordant from './accordant.js';

const { promise, resolve } = withResolvers();

const ffi = {};
const references = new Map;
const notify = connected => {
  const type = `port:${connected ? 'connected' : 'disconnected'}`;
  dispatchEvent(new Event(type));
}
const fr = new FinalizationRegistry(wr => {
  references.delete(wr);
  notify(false);
});

const $broadcast = async (...args) => {
  for (const [wr, eh] of [...references]) {
    while (!eh[broadcast]) await forIt();
    wr.deref()?.postMessage([eh[broadcast], 0, eh[broadcast], args]);
  }
};

addEventListener('connect', ({ ports }) => {
  for (const port of ports) {
    const wr = new WeakRef(port);
    fr.register(port, wr);
    references.set(wr, accordant(port, promise));
    port.start();
    promise.then(() => notify(true));
  }
});

const exports = bindings => resolve(assign(ffi, bindings));
export { $broadcast as broadcast, exports };
