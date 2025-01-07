import { broadcast, exports } from '../../src/shared.js';

const items = new Set;

exports({
  add(value) {
    items.add(value);
    broadcast(...items);
  },
  delete(value) {
    items.delete(value);
    broadcast(...items);
  },
  tasks() {
    broadcast(...items);
  }
});
