const { assign } = Object;

export const ffi = {};

/**
 * @param {object} bindings
 * @returns {object}
 */
export const exports = bindings => assign(ffi, bindings);
