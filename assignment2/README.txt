Name: Robert Gillis
Student Number: 100900973

Source files: admin.html
			  admin.js
			  bobby.png
			  gamePage.html
			  gamePage.js
			  loadJoin.html
			  loadJoin.js
			  rsz_1rsz_check.png
			  rsz_2x.png
			  statsPage.html
			  statsPage.js
			  triviaServer.js
			  
To run the server: first install socket.io and request module using command line: npm install socket.io
															                      npm install request
															   
To then run the server, using command line: node triviaServer.js

Different web pages: 

Join Page
http://localhost:3000/

This is the join page for the trivia game. In order to join the trivia game, you must enter your 
name in the text box and click join game. No duplicate names are allowed, and current names 
being used are displayed in the box below.

Game Page
http://localhost:3000/gamePage.html
****This page does not handle refreshes. I increased the ping rate in order to get faster updates
on players leaving by closing their browser, but the drawback is that if a player refreshes, the 
player displays are not accurate,and it's hard too tell how many are playing.The player who
refreshed will also be out of the game. Also if a player quits the game after one player has
answered, the next set of questions will not load. The admin page can be used to restart the 
game in this situation*****

This is the page where the trivia game takes place. You had to have enetered your name on the home page 
to be registered as a user on this page. The players in the game are displayed in the who's playing 
box. When they answer a question, their text color in that box changes to green. The players scores are 
displayed in the upper right corner. Once the player answers their first question, they will be added to the 
scoreboard. The questions load in the middle of the page. There is a 2 second delay on question changes,
so the last player who answered can see if they got the answer before the question changes. The current
question number is displayed at the top. The winner of each round will be displayed in the lower right
portion of the page. The winner's display will be update after each round, but not present until
one round has been played. 

Add on for this page: Chat. Players can send public and private messages to each other. To send
							public message, enter text into the text box beside the send message
							button. Press the send button to send the message. 
							
							For private chat: add "@username" before the message with a space after							
							to send it to a specific user. Ex. "@phil You're losing" 
							The message will be displayed in blue on only that players chatbox.
							
Other Add Ons:

Admin Page
http://localhost:3000/admin.html

This is the admin page for the website. The current players in the game are displayed inside
the current player box. There is a next button question, to load a new question. The game will 
stay on the same question number. The restart game button, resets all players scores, and starts 
the game at question 1, with a new question. The kick player button works with the text box beside 
it. Enter the players name you want to kick and press the button. An alert saying they've been kicked
will be sent to them and they will be disconnected from the server. If you enter an invalid name, 
you'll get an alert. If you've successfully kicked out a player, a message will be displayed on the 
right side of the page.

Stats Page
http://localhost:3000/statsPage.html

This page displays various stats for any player who played while the server was running. If a player
name gets reused after they leave the game, their old stats will be thrown out and they will start back
at 0. Stats are updated after the completion of each round of trivia. There are buttons to sort by
wins and by total points.