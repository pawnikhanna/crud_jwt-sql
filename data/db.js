let mysql = require('mysql');
require('dotenv').config();

let connection = mysql.createConnection({
    host     : process.env.HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DATABASE
  });

const connect = () =>{
    return new Promise((resolve, reject) =>{
        connection.connect((err, res) =>{
            if (err){
                return reject(new Error('Error connecting to DB'));
            }
            return resolve('Successfully connected to DB');
        });
    });
};

const executeQuery = (query) =>{
    return new Promise((resolve, reject) =>{
        connection.query(query, function (error, results, fields) {
            if (error){
                return reject(error)
            }
            return resolve(results)
        })
    })
}

module.exports = {
    connect, executeQuery
}
