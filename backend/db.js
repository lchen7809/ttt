const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./tictactoe.db', (err) => {
  if (err) {
    console.error('Failed to connect to the database:', err.message);
  } else {
    console.log('Connected to database.');
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS games (
      id TEXT PRIMARY KEY,
      board TEXT,
      isXNext INTEGER,
      winner TEXT,
      winningSquares TEXT
    )
  `);
});

module.exports = db;
