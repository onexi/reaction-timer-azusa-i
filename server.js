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
    let userList = users.map(user => `<li>Name: ${user.name} - Time: ${user.reactionTime} ms</li>`).join('');
    
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
                    background-color: gray;
                    color: white;
                }
            </style>
        </head>
        <body>
            <h1>Reaction Timer</h1>
            <form id="reactionForm" action="/input" method="POST">
                <input type="text" id="name" name="name" placeholder="Enter your name" required>
                <input type="hidden" name="reactionTime" id="reactionTime">    
                <button id="startButton" class="start-button" type="button">Start Challenge</button>
                <button id="stopButton" disabled class="stop-button" type="button">Stop</button> 
            </form>
            <h2>Records</h2>
            <ul id="recordsList">
                ${userList}
            </ul> 

            <script>
                let startTime;
                const startButton = document.getElementById('startButton');
                const stopButton = document.getElementById('stopButton');
                const reactionTimeInput = document.getElementById('reactionTime');
                const form = document.getElementById('reactionForm');  // Correctly reference the form                

                startButton.addEventListener('click', function() {    
                    // Generate a random delay between 0 and 10 seconds
                    const randomDelay = Math.floor(Math.random() * 10000);

                    stopButton.disabled = true;  // Disable stop button until the color change happens
                    stopButton.style.backgroundColor = 'gray';  // Set to gray initially

                    // Set a timeout to change the color after a random delay
                    setTimeout(function() {       
                        stopButton.style.backgroundColor = 'darkred';  // Change to darkred after random delay  
                        startButton.disabled = true;  // Disable the start button
                        stopButton.disabled = false;  // Enable the stop button 
                        startTime = new Date().getTime();  // Start the timer
                    }, randomDelay);
                });

                stopButton.addEventListener('click', function() {                
                    let stopTime = new Date().getTime();
                    let reactionTime = stopTime - startTime;  
                    reactionTimeInput.value = reactionTime;   // Set the reaction time in hidden field                 
                    startButton.disabled = false;  // Enable the start button again for the next round
                    stopButton.disabled = true;   // Disable the stop button after stopping
                    console.log("Reaction time:", reactionTime, "ms");  // Debugging log
                    form.submit();  // Submit the form
                });                               
            </script>
        </body>
        </html>
    `);
});

// Handle the form submission
app.post('/input', function(req, res){
    const name = escape(req.body.name);
    const reactionTime = req.body.reactionTime;

    // Debugging log to check the form data received
    console.log("Form submission received. Name:", name, "Reaction Time:", reactionTime, "ms");

    // Add the new user to the array
    users.push({ name: name, reactionTime: reactionTime });

    // Debugging log to check the current users array
    console.log("Current users array:", users);


    // If you were to make alphabetical, add here

    // Redirect back to the home page
    res.redirect('/');
});

// Start the server
app.listen(3030);
console.log("Running on port 3030");
