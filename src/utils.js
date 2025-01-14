const { isArray } = Array;

/**
 * @param {Event} event
 * @param {(event:Event) => void} callback
 * @returns
 */
export const isChannel = (event, callback) => {
  const { data, ports } = /** @type {MessageEvent<any>} */(event);
  if (data === 'accordant' && isArray(ports) && ports.at(0) instanceof MessagePort) {
    event.stopImmediatePropagation();
    event.currentTarget.removeEventListener(event.type, callback);
    return true;
  }
  return false;
};

export const withResolvers = () => Promise.withResolvers();
