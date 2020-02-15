
//Setup required modules
const mongoose = require("mongoose");
const express = require('express');
const Question = require("./QuestionModel");
const User = require("./UserModel");
const session = require("express-session");
const bodyParser = require("body-parser");
const MongoDBStore = require("connect-mongodb-session")(session);

//Create mongodb store to store session info
const store = new MongoDBStore({
	uri:'mongodb://localhost/quiztracker',
	collection:"sessions"
})

//Create express app
const app = express();

//View Engine
app.set("view engine", "pug");

//Setup routes
app.use(express.static("public"));

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

//Use session with max age of 1 hour
app.use(session({secret:"info",store:store,cookie:{maxAge:60*60*1000}}));

//Handle get requests for index page
app.get('/', function(req, res, next) {
	
	//If the session user is logged in, send logged in info to the index page
	//and render the index page
	if(req.session.loggedin == true){
		res.status(200).render("pages/index",{
			loggedin:req.session.loggedin,
			user:{username:req.session.username,url:req.session.url}
		});
	
	//Otherwise send info that there are no logged is no logged in user and 
	//render the page
	}else{
		res.render("pages/index",{loggedin:req.session.loggedin});
		return;
	}
});

//Returns a page with a new quiz of 10 random questions
app.get("/quiz", function(req, res, next){
	
	//Get 10 random questions from the database
	Question.getRandomQuestions(function(err, results){
		if(err) throw err;
		
		if(results){
			
			//If the user is logged in, render to the quiz page all logged in 
			//info of the user and the quiz questions
			if(req.session.loggedin == true){
				res.status(200).render("pages/quiz",{questions:results,
					loggedin:req.session.loggedin,
					user:{username:req.session.username,url:req.session.url}
				});
			
			//Otherwise render the questions to the page and the info that the user 
			//is not logged in
			}else{
				res.status(200).render("pages/quiz", {questions: results,loggedin:req.session.loggedin});
				return;
			}
		}
	});
})

//The quiz page posts the results here
//Extracts the JSON containing quiz IDs/answers
//Calculates the correct answers and replies
app.post("/quiz", function(req, res, next){
	let ids = [];
	try{
		//Try to build an array of ObjectIds
		for(id in req.body){
			ids.push(new mongoose.Types.ObjectId(id));
		}
		
		//Find all questions with Ids in the array
		Question.findIDArray(ids, function(err, results){
			if(err)throw err; //will be caught by catch below
		
			//Count up the correct answers
			let correct = 0;
			for(let i = 0; i < results.length; i++){
				if(req.body[results[i]._id] === results[i].correct_answer){
					correct++;
				}
			}
				
			//If the user is logged in,update the user's number of quizzes completed and 
			//total score in the database and send a url to page so it can redirect to that 
			//user's profile page as well as number of correct questions
			if(req.session.loggedin == true){
				db.collection("users").updateOne({"username":req.session.username},{"$inc":{"total_quizzes":1,"total_score":correct}});
					
				//Send response
				res.json({url: "/users/"+req.session.url, correct: correct});
				return;
			}
			
			//If the user is not logged in, send the homepage url and number of correct 
			//answers back to the client side
			else{
				res.json({url:"/",correct: correct});
			}
		});
	}catch(err){
		//If any error is thrown (casting Ids or reading database), send 500 status
		console.log(err);
		res.status(500).send("Error processing quiz data.");
		return;
	}
});

//Handle get requests to the /users route
app.get("/users",function(req,res,next){
	
	//Static function to find all users in database with 
	//privacy set to false
	User.findNonPrivate(function(err,results){
		if(err)throw err;
		
		//If users are found
		if(results){
			
			//If the client is logged in, render to the userList page the 
			//logged in status, list of users,and logged in user's info,
			//with url to link to their profile
			if(req.session.loggedin == true){
				res.status(200).render("pages/userList",{
					users:results,
					loggedin:req.session.loggedin,
					user:{username:req.session.username,url:req.session.url},
				});
				
			//Otherwise send list of users and info that the user is not 
			//logged in
			}else{
				res.status(200).render("pages/userList",{
					users:results,
					loggedin:req.session.loggedin
				});
			}
		}
	})
})

//Handle login requests for the site
app.post("/login",function(req,res,next){
	
	//Get username and password
	let username = req.body.username;
	let password = req.body.password;
	
	//Search database to find a user with matching username and password
	db.collection("users").find({"username":username,"password":password}).toArray(function(err,result){
		if(err){
			res.status(500).send("Error reading the database");
			return;
		}
		
		//If a user is found set the session info for logged in,username and url 
		//and redirect to that user's profile page
		if(result.length>0){
				req.session.loggedin = true;
				req.session.username = username;
				req.session.url = result[0]._id;
				res.redirect("/users/"+result[0]._id);
		
		//If the username and password combination was not found in the database
		//redirect to the home page
		}else{
			res.redirect("/");
			return;
		}
		
	})
	
})

//Handle requests for individual user's profile pages
app.get("/users/:userID",function(req,res,next){
	//Try to create new object ID
	let oid;
	try{
		oid = new mongoose.mongo.ObjectID(req.params.userID);
	}catch{
		res.status(404).send("Error: Unknown User ID");
		return;
	}
	
	//Search the database for a user with a matching id
	db.collection("users").find({_id:oid}).toArray(function(err,result){
		if(err) throw err;
		
		//If user is found 
		if(result){
			
			//Calculate average score of the user
			let averageScore = result[0].total_score/result[0].total_quizzes;
			
			if(result[0].total_quizzes == 0){
				averageScore = 0;
			}
			
			//If the user is logged in and viewing their own profile page,send info allowing 
			//for management of privacy and logged in status
			if(req.session.username === result[0].username && req.session.loggedin == true){
					res.status(200).render("pages/userPage",{
					individual:result[0],
					loggedin:req.session.loggedin,
					currentUser:true,
					user:{username:req.session.username,url:req.session.url},
					score:averageScore
				})
			}
			
			//If user is not logged in and viewing their own page,or viewing another user's page
			else{
				
				//If the page is set to private, send message letting user know the page can't 
				//be accessed
				if(result[0].privacy == true){
					res.status(403).render("pages/unauthorized",{
						loggedin:req.session.loggedin,
						user:{username:req.session.username,url:req.session.url}
					})
				}
				
				//Otherwise send necessary user info to the profile page and the logged in status 
				//of the client
				else{
					res.status(200).render("pages/userPage",{
						individual:result[0],
						currentUser:false,
						score:averageScore,
						loggedin:req.session.loggedin,
						user:{username:req.session.username,url:req.session.url},
						quizzes:result[0].total_quizzes
					})	
				}
			}
		}
	})
	
})

//Handle privacy changes by logged in users
app.post("/privacy",function(req,res,next){
	
	//Update the user's privacy setting in the database
	db.collection("users").updateOne({"username":req.session.username},{"$set":{"privacy":req.body.setting}});
})

//Handle log out requests from logged in users
app.post("/logout",function(req,res,next){
	
	//Make sure username of user being logged out matches the username 
	//of the current session
	if(req.session.username === req.body.username){
		
		//Change logged in status and destroy the session
		req.session.loggedin = false;
		req.session.destroy();
		
		//Send url for homepage back to the client so they can redirect
		res.json({url: "/"});
		return;
	}
})



//Connect to database
mongoose.connect('mongodb://localhost/quiztracker', {useNewUrlParser: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	app.listen(3000);
	console.log("Server listening on port 3000");
});