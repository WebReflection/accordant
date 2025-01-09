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
      // invoked per each broadcast (except its own one)
      [broadcast](...args) {
        console.log('SharedWorker', ...args);
      }
    });

    const w = new Worker('./worker.js', {
      // invoked per each broadcast (from the worker.js only)
      [broadcast](...args) {
        console.log('Worker', ...args);
      }
    });

    // both workers export a `random` method
    console.log(await sw.random());
    console.log(await w.random());
    console.log(proxied(sw)); // MessagePort
    console.log(proxied(w));  // Worker

    // broadcast any data to other ports (but not sw)
    sw[broadcast](1, 2, 3);
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

## broadcast

This module offers the current possibilities:

  * on the **main thread**, it is possible to import the `broadcast` **symbol** to help avoiding conflicts with both exported functions (because *symbols* cannot survive a *postMessage* dance) and *SharedWorker* or *Worker* options (future proof, no name clashing). This function will be triggered when the counter *SharedWorker* or *Worker* code decides, arbitrarily, to reflect that invoke on each *main* thread/port, passing along any serializable argument
  * on the **SharedWorker** or **Worker** thread, it is possible to import the `broadcast` **function**, so that a call such as `broadcast(...args)` within the *worker* context will invoke, if defined, the *main thread* callback optionally passed during instantiation. In here it is a function because polluting the global worker context with a symbol didn't feel like the right thing to do

```js
// main thread
const sw = new SharedWorker('./shared-worker.js', {
  [broadcast](...args) {
    // invoked when shared-worker.js calls broadcast(...args)
  }
});
const w = new Worker('./worker.js', {
  [broadcast](...args) {
    // invoked when worker.js calls broadcast(...args)
  }
});
```

Still on the **main thread**, it is also possible to `sw[broadcast](...args)` so that all other ports still listening or available on the *Shared Worker* side of affairs will receive those serialized `args`.

Please note that for feature parity it is also possible to `w[broadcast](...args)` but this does practically nothing because a worker cannot have multiple ports attached so it will silently send data to nothing but it allow code to be portable across platforms and browsers' versions.
