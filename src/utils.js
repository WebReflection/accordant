const { isArray } = Array;
const { assign } = Object;

export { assign };

export const broadcast = Symbol();

export const isChannel = event => {
  if ('ports' in event) {
    const { ports } = event;
    if (isArray(ports) && ports.at(0) instanceof MessagePort) {
      event.stopImmediatePropagation();
      return true;
    }
  }
  return false;
};

export const withResolvers = () => Promise.withResolvers();
