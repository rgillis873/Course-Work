Student Name: Robert Gillis

Student Number: 100900973

Source files:	
		public folder
		js folder
		requestmaker.js
		index.html
		questions folder
		500 question.txt files
		sessions folder 
		triviaAPI.js 

Before running the server, install express and uuid modules: 
Enter to command line: 
	
	npm install express
	npm install uuid
															 
															 
To run server, enter to command line: node triviaServer.js 

Navigate to : http://localhost:3000/

To use the A3 request maker, use the drop down selector to choose which type of request you want 
to send and add your desired url to the textbox. Then press submit and it will simulate the response
for each type of request.


Design Choices:

For GET/questions

If no query parameters are added, 10 randomly chosen questions are sent. If an invalid parameter
key is entered (ex. cereal=2&difficulty=2) that parameter is ignored and response can still be 
status 0. If an invalid value is entered for parameter (ex. category = -1)a status 1 response 
is sent. The limit parameter accepts only positive values. If the limit is not specified, then 
10 questions are expected to be sent back. Certain categories don't have 10 questions,so without
a limit specified,the response will be status 1.If a query parameter is specified twice (ex. 
difficulty=1&difficulty=2) a status 1 response will be sent.

**** Special Case for limit: 

If limit is 0,then any parameter values for difficulty and category will return a status 0 response
since that amount of questions can be generated for those parameters.


Session data storage:

Session data gets stored as json files in the sessions folder.
							
Other changes:

Added route handler for invalid urls. 404 page not found is displayed in the body, with a status 
of 404.							

															 