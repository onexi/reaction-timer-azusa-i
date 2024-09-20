[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/e__G6ZpK)
[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=15856535)
Starter Code for Reaction Timer 
Run npm install to install all dependencies 
The above uses package.json to build the project
Note .gitignore is set to ignore node_modules


[GOAL]
  - Create a reaction timer app that records the fastest reaction time
  - Implement a mechanism that avoids user trying to cheat by randomly clicking buttons

[IMPLEMENTED FEATURES]
  - After user inputs name and clicks "Start Challenge", "Stop" button will turn red
    after a random number of seconds (between 5 and 10 sec)
  - When the user clicks the "Stop" button after it turns red, a reaction time 
    will be measured and printed on the browser. Fastest reaction time and history 
    of all reaction times will be shown
  - User cannot start this challenge unless user enters their name.
    If the user clicks "Start Challenge" button without entering their name,
    user will be notified by an error message 
  - User should not click "Stop" button until it turns red (i.e. should not be cheating).
    If the user clicks "Stop" button before it turns red, the user will be disqualified

[HOW IT WORKS]
1. A web page is served with the following form using app.get('/', function(req, res) {}
   a. HTML is sent from server to client using res.send(). HTML specifies the content and
      formatting of web page
   b. JavaScript in <script> defines the calculations for reaction time.
      Clicking "Start Challenge" button triggers the "Stop" button to change color from 
      gray to red, after a random number of seconds (between 5 and 10 sec).
      Reaction time is calculated as the lag between the moment "Stop" button turns red
      to when it is clicked by the user
   c. If name is empty when "Start Challenge" is clicked, an error message will appear
   d. If "Stop" button is clicked before it turns red, user will be disqualified.
      This is done by monitoring the color of "Stop" button and disqualifying the user
      if "Stop" button is clicked when it is still gray
   e. Finally, after the reaction time has been calculated, the form is submitted to 
      the server using form.submit() 

2. Server handles form submission using app.post('/input', function(req, res){
   a. Name and reaction time are added to array "users" stored on server
   b. Once appending is done, it redirects back to the root URL

3. Root URL reloads with appended name and reaction time
   a. Using array "users", the fastest reaction time is calculated and stored in 
      another array "topUsers", which will also be on the server
   b. The web page is again served with the form, but this time displaying the fastest 
      reaction time and the history of reaction times