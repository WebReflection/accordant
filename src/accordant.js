import { broadcast, isArray, stop } from './utils.js';
import Transferable from './transferable.js';

class EventHandler {
  #channel = '';
  #promise;
  constructor(promise) {
    this.#promise = promise;
  }
  get [broadcast]() {
    return this.#channel;
  }
  async handleEvent(event) {
    const { currentTarget, data } = event;
    if (isArray(data)) {
      if (this.#channel) {
        if (data.at(0) === this.#channel) {
          stop(event);
          const [channel, id, name, args] = data;
          const response = [channel, id];
          const send = [response];
          const proxy = await this.#promise;
          if (name in proxy) {
            try {
              const result = await proxy[name](...args);
              if (result instanceof Transferable) {
                response.push(result.data);
                send.push(result.options);
              }
              else
                response.push(result);
            }
            catch (error) {
              response.push(error);
            }
          }
          else {
            response.push(new Error(`Unknown method ${name}`));
          }
          currentTarget.postMessage(...send);
        }
      }
      else if (typeof data.at(0) === 'string' && data.at(1) === 0) {
        stop(event);
        this.#channel = data.at(0);
        currentTarget.postMessage(data);
      }
    }
  }
}

export default (port, promise) => {
  const eh = new EventHandler(promise);
  port.addEventListener('message', eh);
  return eh;
};
