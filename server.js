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

    // Sort users by reaction time in ascending order and get the top 3
    let topUsers = [...users]
        .sort((a, b) => a.reactionTime - b.reactionTime)
        .slice(0, 1)  // Only get the fastest
        .map(user => `<li>Name: ${user.name} - Time: ${user.reactionTime} ms</li>`)
        .join('');
        
    // Generate the list of reaction times
    let userList = users
        .map(user => `<li>Name: ${user.name} - Time: ${user.reactionTime} ms</li>`)
        .join('');
    
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
            <p>1. Enter you name and click "Start Challenge"</p>
            <p>2. Click "Stop" as soon as it turns red</p>
            <form id="reactionForm" action="/input" method="POST">
                <input type="text" id="name" name="name" placeholder="Enter your name" required>
                <input type="hidden" name="reactionTime" id="reactionTime">    
                <button id="startButton" class="start-button" type="button">Start Challenge</button>
                <button id="stopButton" disabled class="stop-button" type="button">Stop</button> 
            </form>
            <h2>Fastest Reaction Time</h2>
                ${topUsers || "<li>No reactions recorded yet</li>"}
            </ul>
            <h2>Reaction Time History</h2>
            <ul id="recordsList">
                ${userList || "<li>No reactions recorded yet</li>"}
            </ul> 


            <script>
                let startTime;
                let buttonTurnedRed = false; // Flag to track if the button has turned red
                const startButton = document.getElementById('startButton');
                const stopButton = document.getElementById('stopButton');
                const reactionTimeInput = document.getElementById('reactionTime');
                const form = document.getElementById('reactionForm');  // Correctly reference the form                

                startButton.addEventListener('click', function() {    
                    // Generate a random delay between 0 and 10 seconds
                    // const randomDelay = Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000;  // 5 to 15 seconds
                    const randomDelay = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;  // 5 to 10 seconds

                    stopButton.disabled = true;  // Disable stop button until the color change happens
                    stopButton.style.backgroundColor = 'gray';  // Set to gray initially
                    buttonTurnedRed = false;  // Reset the flag for each new attempt                    

                    // Set a timeout to change the color after a random delay
                    setTimeout(function() {       
                        stopButton.style.backgroundColor = 'darkred';  // Change to darkred after random delay  
                        startButton.disabled = true;  // Disable the start button
                        stopButton.disabled = false;  // Enable the stop button 
                        startTime = new Date().getTime();  // Start the timer
                        buttonTurnedRed = true;  // Set the flag to indicate that the button has turned red   
                        console.log("Button turned red! Timer started.");                                             
                    }, randomDelay);
                });

                stopButton.addEventListener('click', function() {                
                    let stopTime = new Date().getTime();
                    let reactionTime;
                    reactionTime = stopTime - startTime;  // Calculate the reaction time

                    // Check if the button was clicked prematurely (before it turned red)
                    if (!buttonTurnedRed) {
                        console.log("Premature click! Adding a 3-second penalty.");
                        reactionTime += 3000;  // Add a 3-second (3000 ms) penalty
                    } else {
                        console.log("Button was red. No penalty.");
                    }

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
