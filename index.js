const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/auth",require("./routes/auth"));
app.use("/courses", require("./routes/courses"));
app.use("/students", require("./routes/students"));

app.listen(3001, () =>
    console.log("Server started")
)