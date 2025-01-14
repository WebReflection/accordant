import Transferable from './transferable.js';
import { send } from './references.js';

const post = ($, id, result, ...rest) => $.postMessage([id, result], ...rest);

export default class Handler {
  #ffi;
  constructor(ffi) { this.#ffi = ffi }
  async handleEvent({ currentTarget: port, data: [id, name, args] }) {
    if (typeof id === 'number') {
      try {
        const result = await this.#ffi[name](...args);
        if (result instanceof Transferable) {
          post(port, id, result.data, result.options);
        }
        else {
          post(port, id, result);
        }
      }
      catch (error) {
        post(port, id, error);
      }
    }
    else {
      send(name, args);
    }
  }
}
