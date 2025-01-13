import '@webreflection/channel/worker';

import { assign, isChannel, withResolvers } from './utils.js';
import Handler from './handler.js';

const ffi = {};
const { promise, resolve } = withResolvers();

addEventListener('channel', event => {
  if (isChannel(event)) {
    const [port] = event.ports;
    port.addEventListener('message', new Handler(ffi));
    resolve(port);
  }
});

export const broadcast = (...args) => {
  promise.then(port => port.postMessage([true, '', args]));
};

export const exports = bindings => assign(ffi, bindings);
