export const references = new Set;

export const send = (name, args) => {
  for (const wr of references)
    wr.deref()?.postMessage([true, name, args]);
};
