import asTemplateStringsArray from 'https://esm.run/template-strings-array';
import { broadcast, exports } from '../dist/worker.js';

exports({
  multiple: () => 'bindings',
});

exports({
  random: () => ({ Worker: Math.random() }),
  tag(template, ...values) {
    template = asTemplateStringsArray(template);
    console.log({ template, values });
  }
});

broadcast('worker:connected');
