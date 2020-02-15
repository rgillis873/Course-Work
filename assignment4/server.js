//Create express app
const express = require('express');
let app = express();

//Database variables
let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let db;

//View engine
app.set("view engine", "pug");

//Set up the routes
app.use(express.static("public"));
app.use(express.static(__dirname));

app.use(express.json());

//Handle get requests to main page
app.get("/",function(req,res){
	res.status(200).render("main");
})


//Handle get requests to /questions
app.get("/questions", function(req,res){
	
	//Search questions collection for max of 25 questions based on query parameters
	db.collection("questions").find(req.query).limit(25).toArray(function(err,result){
		if(err){
			res.status(500).send("Error reading database");
			return;
		}
		
		//Format response based on requested content type
		res.format({
			'application/json': function(){
				res.status(200).send({"questions":result});
			},		
			'text/html':function(){
				res.status(200).render("list",{
					questions: result
				});
			}
		})
	})
})	

//Handle get requests for /questions/:qID
app.get("/questions/:qID",function(req,res){
	//Try to create new object ID
	let oid;
	try{
		oid = new mongo.ObjectID(req.params.qID);
	}catch{
		res.status(404).send("Error: Unknown Question ID");
		return;
	}
	
	//Search collection for matching id
	db.collection("questions").findOne({"_id":oid},function(err,question){
		if(err){
			res.status(500).send("Error reading database");
			return;
		}
		
		if(!question){
			res.status(404).send("Error: Unknown Question ID");
			return;
		}
		
		//Fix uri encoding for incorrect answers array
		let fixIncorrect = question.incorrect_answers.map(function(answer){
			return answer.replace(/&quot;/g,'"').replace(/&#039;/g,"'").replace(/&amp;/g,"&");
		})
		
		//Format response based on client's request
		res.format({
			'application/json': function(){
				res.status(200).send(question);
			},		
			'text/html':function(){
				res.status(200).render("question", {
					questions:question.question,
					category:question.category,
					difficulty:question.difficulty,
					correct:question.correct_answer,
					incorrect:fixIncorrect,
					id: question._id
				});
			}
		})
	})
})

//Handle get request to /createquiz
app.get("/createquiz",function(req,res){
	
	//Find all categories in questions collection
	db.collection("questions").distinct("category",function(err,catList){
		if(err){
			res.status(500).send("Error reading database");
			return;
		}
		
		//Find all difficulty options in questions collection
		db.collection("questions").distinct("difficulty",function(err,difList){
			if(err){
				res.status(500).send("Error reading database");
				return;
			}
	
			//Render pug template for createQuiz page
			res.status(200).render("createQuiz",{
				category:catList,
				difficulty:difList
			})
		})
	})
})

//Handle post requests to /quizzes
app.post("/quizzes", function(req,res){
	let checkList = req.body;
	let messageBuilder = "";
	let splitTags = [];
	
	
	//Verify that quiz has a creator.If no creator,
	//add to the error response message
	if(checkList.hasOwnProperty("creator")){
		if(checkList.creator.length == 0){
			messageBuilder+="No name was entered for the quiz.";
		}
	}else{
		messageBuilder+="No name was entered for the quiz.";
	}
	
	//Verify tags were included. If no tags included,update
	//error response message
	if(checkList.hasOwnProperty("tags")){
		if(checkList.tags.length == 0){
			messageBuilder+="No tags were entered for the quiz.";
		
		//If tags were included
		}else{
			
			//Split tags into an array and remove any duplicate values
			splitTags = checkList.tags.split(" ");
			let noDuplicates = splitTags.filter(function(item, index){ return splitTags.indexOf(item) == index});
			checkList.tags = noDuplicates;
		}
	}else{
		messageBuilder+="No tags were entered for the quiz.";
	}
	
	//Verify that questions were added for the quiz, if not
	//update error response message and send response
	if(checkList.hasOwnProperty("questions")){
		
		//If questions property exists but there are no questions
		if(checkList.questions.length == 0){
			messageBuilder+="No questions were added to the quiz.";
			res.status(404).send("Error: Quiz not added. " + messageBuilder);
			return;
		
		//If questions were added
		}else{
			
			//Try to create ObjectID for each question in database using question id
			//and add them to questionID array
			let questionID = [];
			for(let i = 0;i<checkList.questions.length;i++){
				
				try{
					questionID.push(new mongo.ObjectId(checkList.questions[i]._id));
				}
				
				//If id is invalid format then send error that question not in database
				catch{
					messageBuilder+="One or more questions not in database.";
					res.status(404).send("Error: Quiz not added. " + messageBuilder);
					return;
				}
			}
			
			//If successfully created ObjectID for each question,search for the questions
			if(questionID.length == checkList.questions.length){
			
				//Search database for each question id from the potential quiz
				db.collection("questions").countDocuments({_id:{"$in":questionID}},function(err,result){
					
					//If there are not enough questions found in database, add to error response message
					if(result < checkList.questions.length){
						messageBuilder+="One or more questions not in database.";
					}
					
					//If all questions found in database and all other requirements met
					if(messageBuilder.length == 0){
						
						//Add quiz to quizzes database
						db.collection("quizzes").insertOne(checkList,function(err,results){
							if(err){
								res.status(500).send("Error inserting quiz into database");
								return;
							}
							
							//Send quiz id to client
							res.status(200).send(results.insertedId.toString());
						})
						
					//Otherwise, alert client that quiz could not be added and why	
					}else{
						res.status(404).send("Error: Quiz not added. "+ messageBuilder);
						return;
					}
				})
			}
		}
	
	//Otherwise, alert client that quiz could not be added and why
	}else{
		messageBuilder+="No questions were added to the quiz.";
		res.status(404).send("Error: Quiz not added. "+ messageBuilder);
	}
	
})


//Handle get requests to /quizzes route
app.get("/quizzes",function(req,res){
	
	//Add to query object if parameter is provided
	let buildParam = {};
	
	//If query included creator parameter
	if(req.query.hasOwnProperty("creator")){
		
		//Use regex with case insensitivity to search for creator matches in database
		buildParam["creator"]= {"$regex": req.query.creator,"$options":"i"};
	}
	//If query included tag parameter
	if(req.query.hasOwnProperty("tag")){
		
		//Split tags into an array
		let listTags = req.query.tag.split(" ");
		
		//Make all tags into regex with exact matching and case insensitivity
		let exactMatches = listTags.map(function(tag){
			return RegExp("^"+tag+"$","i");
		})
		
		//Set parameter to include array of tags
		buildParam["tags"] = {"$in":exactMatches};
		
	}
		
	//Search for all quizzes in database matching parameters
	db.collection("quizzes").find(buildParam).toArray(function(err,result){
		if(err){
			res.status(500).send("Error reading database");
			return;
		}
		
			
		//Format response based on client request
		//else{
		res.format({
			'application/json': function(){
				res.status(200).send(JSON.stringify({"quizzes":result}));
			},		
			'text/html':function(){
				res.status(200).render("quizList", {
					quiz:result
				});
			}
		})
	})
})

//Handle get requests to the quiz/:quizID route
app.get("/quiz/:quizID",function(req,res){
	//Try to create new object ID
	let oid;
	try{
		oid = new mongo.ObjectID(req.params.quizID);
	}catch{
		res.status(404).send("Error: Unknown Quiz ID");
		return;
	}
	
	//Search database for quiz matching the id specified
	db.collection("quizzes").find({"_id":oid}).toArray(function(err,result){
		if(err){
			res.status(500).send("Error searching database");
			return;
		}
		
		//If quiz id cannot be found in database
		if(result.length == 0){
			res.status(404).send("Error: Unknown quiz id");
		}
		
		else{
			//Format response based on client request type
			res.format({
				"application/json":function(){
					res.status(200).send(result[0]);
				},
				"text/html": function(){
					res.status(200).render("quizDisplay",{
						quiz:result[0]
					})
				}
			})
		}
	})
})

// Initialize database connection
MongoClient.connect("mongodb://localhost:27017/", function(err, client) {
  if(err) throw err;

  //Get the a4 database
  db = client.db('a4');
  
  // Start server once Mongo is initialized
  app.listen(3000);
  console.log("Listening on port 3000");
});