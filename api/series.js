const express = require('express');
const sqlite3 = require('sqlite3');
const issuesRouter = require('./issues.js');

const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');
seriesRouter = express.Router();

seriesRouter.get('/', (req, res, next) => {
  db.all(`SELECT * FROM Series`, (err, rows) => {
    if(err){
      next(err);
    } else{
      res.json({series: rows});
    }
  });
});

seriesRouter.param('seriesId', (req, res, next, seriesId) => {
  db.get(`SELECT * FROM Series WHERE id = ${seriesId}`, (err, row) => {
    if(err){
      next(err);
    } else if(row){
      req.series = row;
      next();
    } else{
      res.status(404).send();
    }
  });
});

seriesRouter.use('/:seriesId/issues', issuesRouter);

seriesRouter.get('/:seriesId', (req, res, next) => {
  res.json({series: req.series});
});

seriesRouter.post('/', (req, res, next) => {
  let series = req.body.series;

  if(series.name && series.description){
    let sql = `INSERT INTO Series (name, description)
    VALUES ($name, $description)`;
    let values = {
      $name: series.name,
      $description: series.description
    };

    db.run(sql, values, function(err){
      if(err){
        next(err);
      } else{
        db.get(`SELECT * FROM Series WHERE id = ${this.lastID}`, (err, row) =>{
          res.status(201).json({series: row});
        });
      }
    });
  }
  else{
    res.status(400).send();
  }
});

seriesRouter.put('/:seriesId', (req, res, next) => {

  //check that request body has needed data
  if(req.body.series.name && req.body.series.description){

    sql = `UPDATE Series
    SET name = $name, description = $description
    WHERE id = $id`;

    values = {
      $id: req.params.seriesId,
      $name: req.body.series.name,
      $description: req.body.series.description
    };

    //update data base entry
    db.run(sql, values, function(err) {
      if(err){
        next(err);
      }
      //respond
      else{
        db.get(`SELECT * FROM Series WHERE id = ${req.params.seriesId}`, (err, row) => {
          if(err){
            next(err);
          }
          else{
            res.json({series: row});
          }
        });
      }
    });
  }
  else{
    res.status(400).send();
  }

});



module.exports = seriesRouter;
