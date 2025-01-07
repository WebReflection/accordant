import { broadcast, exports } from '../src/shared.js';

const SharedWorker = Math.random();
let ports = 0;

exports({
  random: () => ({ SharedWorker }),
});


addEventListener('port:connected', ({ type }) => {
  ports++;
  broadcast(type, ports);
});

addEventListener('port:disconnected', ({ type }) => {
  ports--;
  broadcast(type, ports);
});
