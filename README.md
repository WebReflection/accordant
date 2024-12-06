# accordant

One way shared/worker async bindings to simply export bindings, as callbacks, from a *Worker* or a *SharedWorker*'s port.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <script type="module">
    import { SharedWorker, Worker, proxied } from 'accordant/main';
    const sw = new SharedWorker('./shared-worker.js');
    const w = new Worker('./worker.js');
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
// shared-worker.js
import exports from 'accordant/shared-worker';

exports({
  random: () => ({ SharedWorker: Math.random() }),
});
```

```js
// worker.js
import exports from 'accordant/worker';

exports({
  random: () => ({ Worker: Math.random() }),
});
```
