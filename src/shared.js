import '@webreflection/channel/shared';

import { isChannel, withResolvers } from './utils.js';
import { references, send } from './references.js';
import { exports, ffi } from './ffi.js';
import Handler from './handler.js';

const fr = new FinalizationRegistry(wr => {
  references.delete(wr);
  notify(false);
});

const { promise, resolve } = withResolvers();

const notify = connected => {
  const type = `port:${connected ? 'connected' : 'disconnected'}`;
  dispatchEvent(new Event(type));
}

addEventListener('connect', ({ ports }) => {
  for (const port of ports) {
    port.addEventListener('channel', function channel(event) {
      if (isChannel(event, channel)) {
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

const broadcast = (...args) => {
  promise.then(() => send('', args));
};

export { broadcast, exports };
