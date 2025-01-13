import { broadcast, exports } from '../dist/shared.js';
import initSQLite from 'https://cdn.jsdelivr.net/npm/@webreflection/sql.js/database.js';
const SQLite = initSQLite('accordant');

const SharedWorker = Math.random();
let ports = 0;
let db;

exports({
  random: () => ({ SharedWorker }),
  someSQLite: async () => {
    if (!db) {
      const Database = await SQLite;
      db = new Database('test.db');
    }

    db.run('CREATE TABLE IF NOT EXISTS hello (a int, b char)');

    db.each('SELECT COUNT(*) AS fields FROM hello', null, async row => {
      if (!row.fields) {
        db.run(`INSERT INTO hello VALUES (0, 'hello')`);
        db.run(`INSERT INTO hello VALUES (1, 'world')`);
        await db.save();
      }
      db.each('SELECT * FROM hello', null, console.log);
    });
  }
});

addEventListener('port:connected', ({ type }) => {
  broadcast(type, ++ports);
});

addEventListener('port:disconnected', ({ type }) => {
  broadcast(type, --ports);
});
