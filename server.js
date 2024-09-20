// This will be the node Express server that will serve up your app
const express = require('express');  // Load the Express framework
const bodyParser = require('body-parser');  // Parses incoming request bodies
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
            <p>
                1. Enter you name and click "Start Challenge" <br>
                2. Click "Stop" as soon as it turns red <br><br>
                <i>Note: You will be disqualified if you click "Stop" before it turns red</i>
            </p>
            <form id="reactionForm" action="/input" method="POST">
                <input type="text" id="name" name="name" placeholder="Enter your name" required>
                <input type="hidden" name="reactionTime" id="reactionTime">    
                <button id="startButton" class="start-button" type="button">Start Challenge</button>
                <button id="stopButton" disabled class="stop-button" type="button">Stop</button> 
                <!-- Placeholder for the disqualification message -->
                <div id="messageContainer"></div>
            </form>
            <br>
            <h2>Fastest Reaction Time</h2>
            <ul id="topUsersList">
                ${topUsers || "<li>No reactions recorded yet</li>"}
            </ul>
            <h2>Reaction Time History</h2>
            <ul id="recordsList">
                ${userList || "<li>No reactions recorded yet</li>"}
            </ul> 

            <script>
                let startTime;
                let buttonTurnedRed = false; // Flag to track if the button has turned red
                let prematureClick = false;  // Flag to track if the user clicked prematurely
                const startButton = document.getElementById('startButton');
                const stopButton = document.getElementById('stopButton');
                const reactionTimeInput = document.getElementById('reactionTime');
                const nameInput = document.getElementById('name');  // Get the name input field
                const form = document.getElementById('reactionForm');  // Correctly reference the form  
                const messageContainer = document.getElementById('messageContainer');  // Reference the message container

                startButton.addEventListener('click', function() {  
                    // Check if the name input is empty
                    if (nameInput.value.trim() === '') {
                        // Display error message if the name is not provided
                        const errorMessage = document.createElement('p');
                        errorMessage.id = 'errorMessage';
                        errorMessage.textContent = "You need to fill in your name to begin";
                        errorMessage.style.color = 'blue';
                        errorMessage.style.fontWeight = 'bold';  // Make the message bold
            
                        // Clear any existing error message
                        messageContainer.innerHTML = '';
                        messageContainer.appendChild(errorMessage);  // Add the error message to the DOM

                        return;  // Prevent starting the challenge if no name is provided
                    }    

                    // Clear previous disqualification message, if any
                    messageContainer.innerHTML = '';  // Clear the message container

                    // Generate a random delay 
                    // const randomDelay = Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000;  // 5 to 15 seconds
                    const randomDelay = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;  // 5 to 10 seconds

                    // Stop button initial conditions
                    // stopButton.disabled = true;  // Disable stop button until the color change happens  // Stop button will always be enabled
                    stopButton.disabled = false;  // Enable the stop button
                    stopButton.style.backgroundColor = 'gray';  // Set to gray initially
                    buttonTurnedRed = false;  // Reset the flag for each new attempt       
                    prematureClick = false;  // Reset premature click flag              

                    // Set a timeout to change the color after a random delay
                    setTimeout(function() {     
                        if (!prematureClick) {  // Only change color if no premature click occurred  
                            stopButton.style.backgroundColor = 'darkred';  // Change to darkred after random delay  
                            startButton.disabled = true;  // Disable the start button
                            // stopButton.disabled = false;  // Enable the stop button  // Stop button will always be enabled
                            startTime = new Date().getTime();  // Start the timer
                            buttonTurnedRed = true;  // Set the flag to indicate that the button has turned red   
                            console.log("Button turned red! Timer started.");  
                        } else {
                            console.log("Premature click occurred, not turning the button red.");
                        }
                    }, randomDelay);
                });

                stopButton.addEventListener('click', function() {                
                    let stopTime = new Date().getTime();
                    let reactionTime;

                    // Check if the button was clicked prematurely (before it turned red)
                    if (!buttonTurnedRed) {
                        console.log("Premature click! You have been disqualified.");
                        prematureClick = true;  // Set the premature click flag

                        // Create a disqualification message element and add it to the DOM
                        const disqualifiedMessage = document.createElement('p');
                        disqualifiedMessage.id = 'disqualifiedMessage';  // Assign an ID to easily find it later
                        disqualifiedMessage.textContent = "You have been disqualified!";
                        disqualifiedMessage.style.color = 'red';  // Add some styling for emphasis
                        disqualifiedMessage.style.fontWeight = 'bold';  // Make the message bold                        
                        messageContainer.appendChild(disqualifiedMessage);  // Display the message in the message container

                        return;  // Prevent form submission if disqualified
                    } else {
                        reactionTime = stopTime - startTime;  // Calculate the reaction time
                        console.log("Button was red. No penalty.");
                    }

                    reactionTimeInput.value = reactionTime;   // Set the reaction time in hidden field                 
                    startButton.disabled = false;  // Enable the start button again for the next round
                    // stopButton.disabled = true;   // Disable the stop button after stopping  // Stop button will always be enabled
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
    const reactionTime = escape(req.body.reactionTime);

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
