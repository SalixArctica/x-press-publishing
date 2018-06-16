const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./database.sqlite');

db.run(`CREATE TABLE IF NOT EXISTS Artist(
  id INTEGER PRIMARY KEY,
  name STRING NOT NULL,
  date_of_birth STRING NOT NULL,
  biography STRING NOT NULL,
  is_currently_employed INTEGER DEFAULT 1
)`);

db.run(`CREATE TABLE IF NOT EXISTS Series(
  id INTEGER PRIMARY KEY,
  name STRING NOT NULL,
  description STRING NOT NULL
)`);

db.run(`CREATE TABLE IF NOT EXISTS Issue(
  id INTEGER PRIMARY KEY,
  name STRING NOT NULL,
  issue_number INTEGER NOT NULL,
  publication_date STRING NOT NULL,
  artist_id INTEGER NOT NULL,
  series_id INTEGER NOT NULL,
  FOREIGN KEY (artist_id) REFERENCES Artist(id),
  FOREIGN KEY (series_id) REFERENCES Series(id)
)`);
