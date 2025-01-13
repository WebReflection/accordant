import * as channel from '@webreflection/channel/main';

import { broadcast, withResolvers } from './utils.js';
export { broadcast };

const references = new WeakMap;

const proxyHandler = {
  get(channel, name) {
    return async (...args) => {
      if (name === broadcast)
        channel.postMessage([true, this.uuid, args]);
      else {
        const id = this.id++;
        const { promise, resolve, reject } = withResolvers();
        this.ids.set(id, r => (r instanceof Error ? reject : resolve)(r));
        channel.postMessage([id, name, args]);
        return promise;
      }
    };
  },
  has: () => false,
  ownKeys: () => [],
};

const createProxy = (port, broadcast) => {
  const ids = new Map;
  const uuid = crypto.randomUUID();
  const channel = port.createChannel();
  channel.addEventListener('message', ({ data }) => {
    const [id, result] = data;
    if (typeof id === 'number') {
      ids.get(id)(result);
      delete ids.get(id);
    }
    else if (result !== uuid) {
      broadcast?.(...data.at(2));
    }
  });
  return new Proxy(channel, { ...proxyHandler, uuid, ids, id: 0 });
};

const create = (Class, url, options) => {
  const w = new Class(url, options);
  const port = Class === channel.Worker ? w : w.port;
  const proxy = createProxy(port, options?.[broadcast]);
  references.set(proxy, w);
  return proxy;
};

export const proxied = proxy => references.get(proxy);

export function SharedWorker(url, options) {
  return create(channel.SharedWorker, url, options);
}

export function Worker(url, options) {
  return create(channel.Worker, url, options);
}
