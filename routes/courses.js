const express = require('express');
const fs = require('fs');
const app = express.Router();
const { to } = require("await-to-js");
const auth = require('./../middleware/verify');
const db = require('./../data/db');

app.get("/", async(req, res) => {
    let sql = 'select * from courses';
    let [err, result] = await to(db.executeQuery(sql));
    if (err){
      return res.json({"Data":null, "Error": err});
    }
    else{
      return res.json({ result });
    }
});

app.get("/:id", async(req, res) => {
    let sql = `select  * from courses where id = ${req.params.id}`;
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

app.post("/", async(req, res) => {
    let name = req.body.name;
    let slots = parseInt(req.body.slots);

    if (!name || !slots){
      return res.status(400).send({ 
        data: null, error: `Fill the required fields` 
      });
    } 

    let [err, result] = await to(db.executeQuery(`select * from courses`));

    courseId = result.length+1;

    if ((slots) > 0){
      let sql = `insert into courses values( "${courseId}", "${name}", ${(slots)})`; 
      let [err, result] = await to(db.executeQuery(sql));
      if (err){
        return res.json({"Data":null, "Error": err});
      }
      else{
        console.log(result);
        res.json({ success: true });
      } 
    }   
});

app.post("/:id/enroll", auth, async(req, res) => {
    const courseId = parseInt(req.params.id);
    const studentId = parseInt(req.body.studentId);

    let [err, result] = await to(db.executeQuery(`select  * from courses where id = ${courseId}`));
    if(result == null){
      res.json({
        message: `No course with id:${courseId}`
      });
    } 

    slots = result[0].slots;

    [err, result] = await to(db.executeQuery(`select  * from students where id = ${studentId}`));
    student = result[0];
    if(student == null){
      res.json({
        message: `No student with id:${studentId}`
      });
    } 
    
    [err, result] = await to( 
      db.executeQuery(`select  * from enrolled_students where course_id = ${courseId} and student_name = "${student.name}"`
    ));
    if (result.length > 0){
      res.json({ message : "Student already enrolled " })
    } else if(err){
      return res.status(500).send({ "data":null, error })
    }

    if (slots > 0 && result.length==0){
      [err, result] = await to(db.executeQuery(`insert into enrolled_students values( ${courseId}, "${student.name}")`));
      if(!err){
        slots -=1;
        db.executeQuery(`update courses set slots = ${slots} where id = ${courseId}`);
        res.json({ "Message": "Student enrolled successfully" })
      }
    } else{
      return res.json({ "data":null, error:"No slots available" })
    }
});

app.put("/:id/deregister", auth, async(req, res) => {
  const courseId = parseInt(req.params.id);
  const studentId = parseInt(req.body.studentId);

  let [err, result] = await to(db.executeQuery(`select  * from courses where id = ${courseId}`));
  course = result[0];
  if(course == null){
    res.json({
      message: `No course with id:${courseId}`
    });
  }
  
  [err, result] = await to(db.executeQuery(`select  * from students where id = ${studentId}`));
  student = result[0];
  if(student == null){
    res.json({
      message: `No student with id:${studentId}`
    });
  } 

  let slots = course.slots;

  [err, result] = await to( 
    db.executeQuery(`select  * from enrolled_students where course_id = ${courseId} and student_name = "${student.name}"`
  ));
  if (result.length == 0){
    return res.status(400).send({ 
      message: "No such student enrolled" 
    })
  } 
  if(err) {
    return res.status(500).send({ "data":null, error })
  }

  [err, result] = await to(
    db.executeQuery(
        `delete from enrolled_students WHERE course_id=${courseId} AND student_name= "${student.name}"`
  ));
  if(!err){
    slots +=1;
    db.executeQuery(`update courses set slots = ${slots} where id = ${courseId}`);
    res.json({ "Message": "Student deregistered successfully" })
  } else {
    return res.status(500).send({ data: null, err });
  }
});
module.exports = app;