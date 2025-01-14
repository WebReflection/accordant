import '@webreflection/channel/worker';

import { isChannel, withResolvers } from './utils.js';
import { exports, ffi } from './ffi.js';
import Handler from './handler.js';

const { promise, resolve } = withResolvers();

addEventListener('channel', function channel(event) {
  if (isChannel(event, channel)) {
    const [port] = event.ports;
    port.addEventListener('message', new Handler(ffi));
    resolve(port);
  }
});

const broadcast = (...args) => {
  promise.then(port => port.postMessage([true, '', args]));
};

export { broadcast, exports };
