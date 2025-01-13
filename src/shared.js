import '@webreflection/channel/shared';

import { assign, isChannel, withResolvers } from './utils.js';
import { references, send } from './references.js';
import Handler from './handler.js';

const fr = new FinalizationRegistry(wr => {
  references.delete(wr);
  notify(false);
});

const ffi = {};
const { promise, resolve } = withResolvers();

const notify = connected => {
  const type = `port:${connected ? 'connected' : 'disconnected'}`;
  dispatchEvent(new Event(type));
}

addEventListener('connect', ({ ports }) => {
  for (const port of ports) {
    port.addEventListener('channel', event => {
      if (isChannel(event)) {
        const [port] = event.ports;
        const wr = new WeakRef(port);
        port.addEventListener('message', new Handler(ffi));
        fr.register(port, wr);
        references.add(wr);
        notify(true);
        resolve();
      }
    });
  }
});

export const broadcast = (...args) => {
  promise.then(() => send('', args));
};

export const exports = bindings => assign(ffi, bindings);
