// This will be the node Express server that will serve up your app
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3030;
const path = require('path');
// these are some of the libraries you will need

// Array to store names and emails
let users = [];

app.use(bodyParser.urlencoded({ extended: true }));

// Serve the web page with the form
app.get('/', function(req, res) {
    let userList = users.map(user => `<li>${user.name}</li>`).join('');
    
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Add a Reaction Time</title>
            <style>
                button {
                    background-color: red;
                    color: white;
                }
            </style>
        </head>
        <body>
            <h1>Add a Reaction Time</h1>
            <form action="/input" method="POST">
            <input type="text" id="name" name="name" required>
                <button type="submit">Start</button>
                <button type="submit">Stop</button>                
            </form>
            <h2>Times:</h2>
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

// Start the server
app.listen(3030);
console.log("Running on port 3030");