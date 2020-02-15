Student Name: Robert Gillis

Source files:	

	views folder:
		createQuiz.pug
		list.pug			
		main.pug
		question.pug
		quizDisplay.pug
		quizList.pug
				
	database-initializer.js
	package.json
	package-lock.json
	quizCreation.js
	server.js

Before running anything, install all necessary npm packages using command: npm install
	
Before running the server, run mongod in a seperate terminal and specify a database folder for 
mongod to utilize. Run database-initializer program to setup the a4 database.

To run server, enter to command line: node server.js

Home Page:
http://localhost:3000/

Main page for website. Has the following links:	

Browse Questions: http://localhost:3000/questions/

Browse Quizzes: http://localhost:3000/quizzes/

Create Quiz: http://localhost:3000/createquiz/

GET/questions:
http://localhost:3000/questions/

Page displays links to up to 25 individual question pages.To narrow search for questions can
use parameters category and difficulty (ex. http://localhost:3000/questions/?category=Vehicles&difficulty=medium ).
If no questions can be found to match parameters, a blank page is returned.


GET/questions/:qid:
 
Page displays all info for an individual question in database. If qid is not found in database,
a 404 error is sent along with the message: "Error: Unknown Question ID"

GET/createquiz:
http://localhost:3000/createquiz/

Page allows user to create their own quiz and save it to the database. User must enter name,
atleast one quiz tag and add atleast one question in order to save their quiz. User can add 
questions to their quiz using the Search/Add Questions area of the page. Two drop down menus 
allow for filtering of questions. If no questions match the category and difficulty combination,
then no question pool will be displayed. Otherwise questions will appear below he two drop down bars.
Questions will appear as links, that when clicked on will open in a new window.

To add a question to the quiz, click the add button beside the question and it will appear under 
Current Quiz Questions with a remove button beside it. To remove a question from the quiz, click that
remove button. An alert will display if user tries to add duplicate questions.

To save a quiz click the save quiz button. If all quiz requirements are met and the server successfully 
adds the quiz to the database,the window will redirect to the new quiz page. If not, an alert 
will appear telling user what they need to fix.

If server can't validate the quiz,it will send a 404 error in response.


GET/quizzes
http://localhost:3000/quizzes

Page displays links to quizzes in the database. Each link's text has the quiz creator's name, a "|"
to seperate and the quiz's tags. The page supports the query parameter's creator and tag. Creator
parameter allows for case-insensitive partial word search (ex. http://localhost:3000/quizzes/?creator=aVe would 
return a quiz created by Dave).The tag parameter allows for case-insensitive exact word search 
(ex. http://localhost:3000/quizzes/?tag=ScIeNcE would return quizzes with tags science,Science,SCIENCE etc.).
The tag parameter also allows for multiple tag search. To do so,just use a space between each tag.
(ex. http://localhost:3000/quizzes/?tag=ScIeNcE%20MuSic%20arT would return quizzes with science,music or art tags).
If no quizzes are found, a blank page is displayed.


GET/quiz/:quizID

Page displays creator name,quiz tags, quiz id and all questions for a quiz. Each question is 
displayed as a link to that question's individual page. If an invalid quizID is used as a parameter
the page will display a 404 error.

 

