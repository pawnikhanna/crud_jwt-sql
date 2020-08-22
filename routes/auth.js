const express = require('express');
const app = express.Router();
const bcrypt  = require('bcrypt');
const {to} = require('await-to-js');
const jwt = require('jsonwebtoken');
const fs = require('fs');
var validator = require("email-validator");
const db = require('./../data/db');

let salt = 'mysalt';
const generateToken = (password, salt) => {

    let token = jwt.sign(password, salt);
    return token;
}

const passwordHash = async (password) => {
    const saltRounds = 12;
    const [err, passwordHash] = await to(bcrypt.hash(password, saltRounds));
    if (err) {
        return res.send('Error while generating password hash')
    }
    return passwordHash;
};

app.post('/signup', async function (req, res) {
    const email = req.body.email;
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;

    if(!name || !email ||!password ||!validator.validate(email) ||!username){
        return res.status(400).send({ error: "Invalid Payload" });
    }

    let [err, result] = await to(db.executeQuery(`select * from students`));
    studentId = result.length+1;
   
    [err, result] = await to(db.executeQuery(`select  * from students where username = ${username}`));
    if(result[0]){
        res.json({
        message: `Student with username: ${username} already exists`
        });
    }
    
    let encryptedPassword = await  passwordHash(password);
    [err, result] = await to(
        db.executeQuery(`insert into students values( ${studentId}, "${email}", "${name}", "${username}", "${encryptedPassword}" )`)
    );
    if(!err){
        res.json({
            "msg": "Sign up successful"
        });
    } else{
        return res.json({"data":null, "error": err})
    }
});

app.post('/login', async function (req, res) {
    let email = req.body.email;
    let password = req.body.password;

    if(!email){
        return res.json({"error": "email is required "})
    }
    if(!password){
        return res.json({"error": "Password is required "})
    }

    let [err, result] = await to(db.executeQuery(`select  * from students`));
    student = result[0]
    if(student.email != email){
        res.json({
        "error": "Incorrect email"
        });
    }
    
    let [error, isValid] = await to(
        bcrypt.compare(password, student.password )
    );
    if(!isValid){
        return res.status(400).json({ "error": "Incorrect Password"});
    }
    else{
        return res.json({
            token: generateToken(student.password, salt)
        }) 
    }
});
module.exports = app;