const { isArray } = Array;
export { isArray };

export const stop = event => {
  event.stopImmediatePropagation();
  event.preventDefault();
};

export const withResolvers = () => Promise.withResolvers();
