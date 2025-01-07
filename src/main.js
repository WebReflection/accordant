import { broadcast, isArray, stop, withResolvers } from './utils.js';
export { broadcast };

const { SharedWorker: $SharedWorker, Worker: $Worker } = globalThis;

const references = new WeakMap;

const proxyHandler = {
  get(port, name) {
    return async (...args) => {
      const channel = await this.init, id = this.uid++;
      const { promise, resolve, reject } = withResolvers();
      this.ids.set(id, r => (r instanceof Error ? reject : resolve)(r));
      port.postMessage([channel, id, name, args]);
      return promise;
    };
  },
  has: () => false,
  ownKeys: () => [],
};

const asModule = options => ({
  ...options, type: 'module'
});

const bootstrap = (port, broadcast) => {
  let uid = 0;
  const { promise: init, resolve } = withResolvers();
  const channel = crypto.randomUUID();
  const ids = new Map([[uid++, resolve]]);
  const proxy = new Proxy(port, { ...proxyHandler, ids, init, uid });
  port.addEventListener('message', event => {
    const { data } = event;
    if (isArray(data) && data.at(0) === channel) {
      stop(event);
      const [_, id, result, ...rest] = data;
      if (rest.length && id === 0 && channel === result)
        broadcast?.(...rest[0]);
      else {
        const resolveOrReject = ids.get(id);
        delete ids.get(id);
        resolveOrReject(result);
      }
    }
  });
  port.postMessage([channel, 0, channel]);
  references.set(proxy, port);
  return proxy;
};

export const proxied = proxy => references.get(proxy);

export function SharedWorker(url, options) {
  const sw = new $SharedWorker(url, asModule(options));
  const { port } = sw;
  if (options?.error)
    sw.addEventListener('error', options.error);
  port.start();
  return bootstrap(port, options?.[broadcast]);
}

export function Worker(url, options) {
  return bootstrap(new $Worker(url, asModule(options)), options?.[broadcast]);
}
