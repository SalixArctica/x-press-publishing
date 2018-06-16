const express = require('express');
const sqlite3 = require('sqlite3');

const issuesRouter = express.Router({mergeParams: true});
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

issuesRouter.get('/', (req, res, next) => {

  db.all(`SELECT * FROM Issue WHERE series_id = ${req.params.seriesId}`, (err, rows) =>{
    if(err){
      next(err);
    }
    else{
      res.json({issues: rows});
    }
  });
});

issuesRouter.post('/', (req, res, next) => {

  let issue = req.body.issue;

  db.get(`SELECT * FROM Artist WHERE id = ${issue.artistId}`, (err, row) =>{
    if(!row){
      res.status(400).send();
    }
  });

  if(issue.name && issue.publicationDate && issue.artistId && issue.issueNumber){
    let sql = `INSERT INTO issue
    (name, publication_date, issue_number, artist_id, series_id)
    VALUES($name, $publicationDate, $issueNumber, $artistId, $seriesId)`;

    let values = {
      $name: issue.name,
      $publicationDate: issue.publicationDate,
      $issueNumber: issue.issueNumber,
      $artistId: issue.artistId,
      $seriesId: req.params.seriesId
    };

    db.run(sql, values, function(err) {
      if(err){
        next(err);
      }
      else{
        db.get(`SELECT * FROM Issue WHERE id = ${this.lastID}`, (err, row) => {
          if(err){
            next(err);
          }
          else{
            res.status(201).json({issue: row});
          }
        });
      }
    });
  }
  else {
    res.status(400).send();
  }
});

issuesRouter.param('issueId', (req, res, next, issueId) => {
  db.get(`SELECT * FROM Issue WHERE id = ${issueId}`, (err, row) => {
    if(err){
      next(err);
    }
    else if(row){
      req.issue = row;
      next();
    }
    else{
      res.status(404).send();
    }
  });
});

issuesRouter.put('/:issueId', (req, res, next) => {
  let issue = req.body.issue;
  if(issue.name && issue.issueNumber && issue.publicationDate && issue.artistId){
    sql = `UPDATE Issue
    SET name = $name,
    issue_number = $issueNumber,
    publication_date = $publicationDate,
    artist_id = $artistId
    WHERE id = $issueId`;

    values = {
      $name: issue.name,
      $issueNumber: issue.issueNumber,
      $publicationDate: issue.publicationDate,
      $artistId: issue.artistId,
      $issueId: req.params.issueId
    };

    db.run(sql, values, (err) => {
      if(err){
        next(err);
      }
      else{
        db.get(`SELECT * FROM Issue WHERE id = req.params.issueId`, (err, row) => {
          res.status(200).json({issue: row});
        });
      }
    });
  }
  else{
    res.status(400).send();
  }
});

module.exports = issuesRouter;
