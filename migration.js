const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./database.sqlite');

db.run(`CREATE TABLE IF NOT EXISTS Artist(
  id INTEGER PRIMARY KEY,
  name STRING NOT NULL,
  date_of_birth STRING NOT NULL,
  biography STRING NOT NULL,
  is_currently_employed INTEGER DEFAULT 1
)`);
