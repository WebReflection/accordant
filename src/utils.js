const { isArray } = Array;
const { assign } = Object;
export { assign, isArray };

export const broadcast = Symbol();

export const stop = event => {
  event.stopImmediatePropagation();
  event.preventDefault();
};

export const forIt = () => new Promise($ => setTimeout($, 0));

export const withResolvers = () => Promise.withResolvers();
