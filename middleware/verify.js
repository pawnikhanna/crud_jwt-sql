const jwt = require('jsonwebtoken');
require('dotenv').config();

let salt = process.env.salt;

const auth = async (req, res, next) => {
    let token = req.headers.authorization;
    token = token.split(' ')[1];
    let data;
    try {
        data = jwt.verify(token, salt);
    } catch (error) {
        return res.status(401).send({ data: null, error: "Invalid Token" });
    }
    req.password = data.password;
    next();
};

module.exports = auth;