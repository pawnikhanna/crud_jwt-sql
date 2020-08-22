const express = require('express');
const fs = require('fs');
const app = express.Router();
const db = require('./../data/db');

app.get("/", async(req, res) => {
  let sql = 'select * from students';
  let [err, result] = await to(db.executeQuery(sql));
  if (err){
    return res.json({"Data":null, "Error": err});
  }
  else{
    return res.json({ result });
  }
});

app.get("/:id", async(req, res) => {
  let sql = `select  * from students where id = ${req.params.id}`;
  let [err, result] = await to(db.executeQuery(sql));
  if(!err) {
    if(result && result.length > 0) {
        res.json({ result });
    } else {
        res.json({
            message: `No course with id:${req.params.id}`
        });
    }
  } else {
    res.json({
      'Data':null,
      'Error': err
    })
  }
});

module.exports = app;