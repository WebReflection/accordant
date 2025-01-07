# accordant

One way shared/worker async bindings to simply export bindings, as callbacks, from a *Worker* or a *SharedWorker*'s port.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <script type="module">
    import { SharedWorker, Worker, broadcast, proxied } from 'accordant/main';
    const sw = new SharedWorker('./shared-worker.js', {
      // invoked per each broadcast
      [broadcast](...args) {
        console.log('SharedWorker', ...args);
      }
    });
    const w = new Worker('./worker.js', {
      // invoked per each broadcast
      [broadcast](...args) {
        console.log('Worker', ...args);
      }
    });
    // both workers export a `random` method
    console.log(await sw.random());
    console.log(await w.random());
    console.log(proxied(sw)); // MessagePort
    console.log(proxied(w));  // Worker
  </script>
</head>
</html>
```

```js
// shared-worker.js - multiple ports
import { broadcast, exports } from 'accordant/shared-worker';

const sameValue = Math.random();

exports({
  random: () => ({ SharedWorker: sameValue }),
});

let ports = 0;

// using the broadcast utility to notify all ports
addEventListener('port:connected', () => {
  broadcast('connected ports', ++ports);
});

addEventListener('port:disconnected', () => {
  broadcast('disconnected port, now there are', --ports, 'ports');
});
```

```js
// worker.js - single "port"
import { broadcast, exports } from 'accordant/worker';

exports({
  random: () => ({ Worker: Math.random() }),
});

// just invoke the broadcast symbol option
broadcast('current', 'worker');
```
