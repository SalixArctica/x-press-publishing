const express = require('express');
const sqlite3 = require('sqlite3');

const artistRouter = express.Router();
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

artistRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Artist WHERE Artist.is_currently_employed = 1', (err, artists) => {
    if (err) {
      next(err);
    } else {
      res.status(200).json({artists: artists});
    }
  });
});

artistRouter.param('artistId', (req, res, next, artistId) => {
  db.get(`SELECT * FROM Artist WHERE id = ${artistId}`, (err, artist) => {
    if(err){
      next(err);
    } else if(artist) {
      req.artist = artist;
      next();
    } else{
      res.status(404).send();
    }
  });
});

artistRouter.get('/:artistId', (req, res, next) => {
  res.status(200).json({artist: req.artist});
});

artistRouter.post('/', (req, res, next) => {
  let artist = req.body.artist;
  if(artist.name && artist.dateOfBirth && artist.biography){
    const sql = 'INSERT INTO Artist (name, date_of_birth, biography) VALUES ($name, $dateOfBirth, $biography)';
    const values = {
      $name: artist.name,
      $dateOfBirth: artist.dateOfBirth,
      $biography: artist.biography
    };
    db.run(sql, values, function(err) {
      if(err){
        next(err);
      }
      else {
        db.get(`SELECT * FROM Artist WHERE Artist.id = ${this.lastID}`,
        (error, artist) => {
            res.status(201).json({artist: artist});
        });
      }
    });
  }
  else{ //if it wasnt a valid artist object
    res.status(400).send();
  }
});

artistRouter.put('/:artistId', (req, res, next) => {
  let artist = req.body.artist;
  if(artist.name && artist.dateOfBirth && artist.biography){
    sql = `UPDATE Artist SET
    name = $name,
    date_of_birth = $dateOfBirth,
    biography = $biography,
    is_currently_employed = $isCurrentlyEmployed
    WHERE Artist.id = $artistId`;
    values = {
      $name: artist.name,
      $dateOfBirth: artist.dateOfBirth,
      $biography: artist.biography,
      $isCurrentlyEmployed: artist.isCurrentlyEmployed,
      $artistId: req.params.artistId
    };
    db.run(sql, values, (err) => {
      if(err){
        next(err);
      }
      else{
        db.get(`SELECT * FROM Artist WHERE Artist.id = ${req.params.artistId}`,
        (error, artist) => {
            res.status(200).json({artist: artist});
        });
      }
    });
  }
  else{
    res.status(400).send();
  }
});

artistRouter.delete('/:artistId', (req, res, next) => {
  let values = {$artistId: req.params.artistId};
  db.run(`UPDATE Artist SET is_currently_employed = 0 WHERE Artist.id = $artistId`, values, (err) => {
    if(err){
      next(err);
    }
    else{
      db.get(`SELECT * FROM Artist WHERE Artist.id = ${req.params.artistId}`,
      (error, artist) => {
          res.status(200).json({artist: artist});
      });
    }
  });
});

module.exports = artistRouter;
