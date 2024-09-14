// This will be the node Express server that will serve up your app
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3030;
const path = require('path');
// these are some of the libraries you will need

// Title of page
app.get('/', function(req, res) {
    res.send('<h1> Add a Reaction Time </h1>');
});

// Array to store names
let users = [];

// Serve the web page with the form
app.get('/', function(req, res) {
    let userList = users.map(user => `<li>${user.name} </li>`).join('');
    
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Submit Your Details</title>
        </head>
        <body>
            <h1>Enter Name</h1>
            <form action="/input" method="POST">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>
                <br><br>
                <button type="submit">Submit</button>
            </form>
            <h2>Submitted Users:</h2>
            <ul>${userList}</ul>
        </body>
        </html>
    `);
});

// Handle the form submission
app.post('/input', function(req, res){
    const name = escape(req.body.name);

    // Add the new user to the array
    users.push({ name: name });

    // If you were to make alphabetical, add here

    // Redirect back to the home page
    res.redirect('/');
});

app.listen(3000);
console.log("Running on port 3000");