let mysql = require('mysql');

let connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Pawni@123',
    database : 'CRUD'
  });

const connect = () =>{
    return new Promise((resolve, reject) =>{
        // connection = mysql.createConnection({
        //     host     : 'localhost',
        //     user     : 'root',
        //     password : 'Pawni@123',
        //     database : 'crud'
        //   });
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