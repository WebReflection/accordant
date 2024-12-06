import { isArray, stop } from './utils.js';

class EventHandler {
  #channel = '';
  #promise;
  constructor(promise) {
    this.#promise = promise;
  }
  async handleEvent(event) {
    const { currentTarget, data } = event;
    if (isArray(data)) {
      if (this.#channel) {
        if (data.at(0) === this.#channel) {
          stop(event);
          const [channel, id, name, args] = data;
          const response = [channel, id];
          const proxy = await this.#promise;
          if (name in proxy) {
            try {
              response.push(await proxy[name](...args));
            }
            catch (error) {
              response.push(error);
            }
          }
          else {
            response.push(new Error(`Unknown method ${name}`));
          }
          currentTarget.postMessage(response);
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

export default (port, promise) => port.addEventListener(
  'message',
  new EventHandler(promise),
);