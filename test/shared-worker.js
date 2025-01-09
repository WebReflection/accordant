import { broadcast, exports } from '../src/shared.js';

const SharedWorker = Math.random();
let ports = 0;

import initSQLite from 'https://cdn.jsdelivr.net/npm/@webreflection/sql.js/database.js';
const Database = await initSQLite('accordant');

const db = new Database('test.db');

db.run('CREATE TABLE IF NOT EXISTS hello (a int, b char)');

db.each('SELECT COUNT(*) AS fields FROM hello', null, async row => {
  if (!row.fields) {
    db.run(`INSERT INTO hello VALUES (0, 'hello')`);
    db.run(`INSERT INTO hello VALUES (1, 'world')`);
    await db.save();
  }
  db.each('SELECT * FROM hello', null, console.log);
});

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
