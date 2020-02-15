Student Name: Robert Gillis

Source Files:	

public folder
	js folder	
		quiz.js
		userPage.js

views folder
	pages folder
		header.pug
		index.pug
		quiz.pug
		unauthorized.pug
		userList.pug
		userPage.pug
				
database-initializer.js
package.json
package-lock.json
QuestionModel.js
server.js
UserModel.js

Before running server, run mongoDB daemon in a seperate terminal and specify a database folder for 
mongoDB daemon to utilize.
				
Before running server or database-initializer,install all necessary npm packages by entering to 
command line: npm install

Initialize the database by using the command: node database-initializer.js

To run the server,enter to the command line: node server.js			

Use of Website:

Page Header:
Every page on the site has links in the header to the home page, to the quiz page and to a list of users page.
If the user is not logged in,a login form is also found in the header. To login,enter a username and password 
and press the submit button.If the user is successfully logged in,they will be redirected to their profile
page. If unsuccessful,they will be redirected to the home page. If the user is logged in,the login form in 
the header will be replaced by a message in the header saying "Currently logged in as: user".The user part 
of the message will be the name of the user as a link that goes to that user's profile page.

Home Page:
http://localhost:3000/

Main page for the website. Has a Get a quiz link that goes to the quiz page.

Quiz Page:
http://localhost:3000/quiz

Quiz page allows user to answer 10 random trivia questions. To finish the quiz and submit your answers,
press the submit button at the bottom of the page. An alert will appear displaying your score for the quiz.
If the user is logged in, the quiz info is sent to the database and updated and the user is redirected to 
their profile page that will show their newly updated quiz count and average score. If the user is not logged
in, they will be redirected to the home page.

List Of Users Page:
http://localhost:3000/users

This page shows a list of current users on the website that have their privacy set to off. Each username
is displayed as a link to that user's profile page.

Profile Pages:
http://localhost:3000/users/:userID

This page is a profile page for each indivdual user. The user's name,total quizzes and average quiz 
score are displayed on the page. If the user is logged in and viewing their own page, the user's page
will also have a drop down selector,save privacy change button and a logout button. The drop down 
selector will display the user's current privacy setting(either on or off). To change the privacy
setting,use the selector to choose your desired privacy setting and then press the save privacy change
button. The user will remain on their profile page. If the user wishes to logout,press the logout button 
on the page.The user will be logged out and the site will redirect to the home page.

If a certain user's profile is set to private,it can only be viewed by that certain user if they are logged
in (Ex. If erich has his profile set to privacy on,only a logged in erich can view it). In all other cases, 
the profile will not be accessable and a message will be displayed saying that the profile cannot be 
accessed. 
				
