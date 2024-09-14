// This will be the node Express server that will serve up your app
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3030;
const path = require('path');
// these are some of the libraries you will need

app.get('/', function(req, res) {
    res.send('<h1> Add a Reaction Time </h1>');
});

app.listen(3000);
console.log("Running on port 3000");