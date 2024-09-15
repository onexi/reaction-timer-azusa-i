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
    let userList = users.map(user => `<li>Name: ${user.name} Time: ${user.reactionTime}</li>`).join('');
    
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reaction Timer</title>
            <style>
                .start-button {
                    background-color: green;
                    color: white;
                }
                .stop-button {
                    background-color: darkred;
                    color: white;
                }
            </style>
        </head>
        <body>
            <h1>Reaction Timer</h1>
            <form action="/input" method="POST">
            <input type="text" id="name" name="name" required>
                <button id="startButton" class="start-button">Start</button>
                <button id="stopButton" disabled class="stop-button">Stop</button>                
            </form>
            <h2>Times</h2>
            <ul>${userList}</ul>   

            <script>
                let startTime;
                let endTime;

                const startButton = document.getElementById('startButton');
                const stopButton = document.getElementById('stopButton');
                const resultDisplay = document.getElementById('result');

                startButton.addEventListener('click', function() {
                    startTime = new Date();
                    startButton.disabled = true;
                    stopButton.disabled = false;
                    resultDisplay.textContent = 'Timer started... Click stop to get the reaction time.';
                });

                stopButton.addEventListener('click', function() {
                    endTime = new Date();
                    const reactionTime = endTime - startTime; // Calculate the reaction time in milliseconds
                    resultDisplay.textContent = `Reaction time: ${reactionTime} ms`;
                    startButton.disabled = false;
                    stopButton.disabled = true;
                });
                </script>
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