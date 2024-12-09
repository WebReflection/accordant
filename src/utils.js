const { isArray } = Array;
const { assign } = Object;
export { assign, isArray };

export const stop = event => {
  event.stopImmediatePropagation();
  event.preventDefault();
};

export const withResolvers = () => Promise.withResolvers();
