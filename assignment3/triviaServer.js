//Get necessary modules
const express = require('express');
const fs = require('fs');
const uuidv4 = require('uuid/v4');
let app = express();

//Serve any static files in public folder
app.use(express.static("public"));


//Create arrays to hold all questions in database and all session id's
let allQuestions = [];
let sessionID = [];

//Read all files in directory and get all questions from the files
fs.readdir(__dirname+'/questions/',function(err,files){
	files.forEach(file =>{	
		fs.readFile(__dirname+'/questions/'+file,"utf8",function(err,data){
				
				//Add each question to the allQuestions array
				let addQuestion = JSON.parse(data);
				allQuestions.push(addQuestion);
		})
	})	
		
});

//Function to randomly shuffle an array
function randomShuffle(array){
	let size = array.length;
	let current;
	let index;
	
	//While not all items have been shuffled,pick a random element and swap it 
	//with the current element
	while(size){
		index = Math.floor(Math.random()*size--);
		current = array[size];
		array[size] = array[index];
		array[index] = current;
		
	}
	return array;
}


//Handle get requests for /questions
app.get("/questions",function(req,res){
	
	//Randomly shuffle the questions
	randomShuffle(allQuestions);
	
	//Create neceessary variables to filter questions
	let firstTen = allQuestions.slice(0,10);
	let filters = req.query;
	let sessionQuestions = [];
	let totalResponse = {};
	let currentStatus = 0;
	let useID = false;
	let noParam = false;
	
	//Filter out any incorrect query parameters
	let possibleQueries = ["difficulty","token","category","limit"];
	let filterQueries = Object.keys(filters);
	for(let i = 0;i<filterQueries.length;i++){
		if(!(possibleQueries.includes(filterQueries[i]))){
			delete filters[filterQueries[i]];
		}
	}
	
	//If no query parameters,send a random array of 10 questions and status of 0
	if(Object.keys(filters).length == 0){
		totalResponse["status"]= 0;
		totalResponse["results"] = firstTen;
		noParam = true;
		res.send(totalResponse);
	}
	//Start filtering questions
	let filteredQuestions = allQuestions;
	
	//Handle token query parameter
	if(filters.hasOwnProperty("token")){
		
		//If it is a valid session id,read the associated file
		if(sessionID.includes(filters.token)){
			sessionQuestions = JSON.parse(fs.readFileSync(__dirname +'/sessions/'+filters.token+'.json',"utf8"));
			filteredQuestions = sessionQuestions;
			useID = true;
			
			//If not enough questions available,change status to 1
			if(filteredQuestions.length == 0 && filters.hasOwnProperty("limit")==false){
				currentStatus=1;
			}
			//If limit is not specified and there are no other parameters,send 10 questions
			if(Object.keys(filters).length == 1){
				filteredQuestions = filteredQuestions.slice(0,10);
			}
		//If invalid id,change status to 2	
		}else{
			currentStatus=2;
		}
	}
	
	//Handle category query parameter
	if(filters.hasOwnProperty("category")){
		//Filter questions by specified category
		filteredQuestions = filteredQuestions.filter(function(question){
			return question.category_id == filters.category;
		})
		
		//If not enough questions change status to 1
		if(filteredQuestions.length == 0 && filters.hasOwnProperty("limit")==false && currentStatus!=2){
			currentStatus=1;
		}
		
	}
	
	//Handle difficulty query parameter
	if(filters.hasOwnProperty("difficulty")){
		
		//Filter questions for correct difficulty
		filteredQuestions = filteredQuestions.filter(function(question){
			return question.difficulty_id == filters.difficulty;	
		})
	
		//If not enough questions,change status to 1
		if(filteredQuestions.length == 0 && filters.hasOwnProperty("limit")==false && currentStatus!=2){
			currentStatus=1;
		}
	
	}
	
	
	//Handle limit query parameter
	if(filters.hasOwnProperty("limit")){
		
		//Check if there are enough questions to satisfy the request and if limit value is positive
		if(isNaN(filters.limit) == false && filteredQuestions.length >= filters.limit && filters.limit>=0 && filters.limit.length !=0){
			filteredQuestions = filteredQuestions.slice(0,filters.limit);
		
		//If not enough questions or limit is incorrect,change status to 1
		}else{
			if(currentStatus!=2){
				currentStatus = 1;
			}
		}
	//If no limit is specified,cut list to 10 questions if possible	
	}else{
		if(filteredQuestions.length >= 10){
			filteredQuestions = filteredQuestions.slice(0,10);
		
		//Otherwise send a status 1 response
		}else{
			if(currentStatus!=2){
				currentStatus = 1;
			}
		}
	}
	
	//If all parameters have been checked,generate response
	if(noParam == false){
		totalResponse["status"] = currentStatus;
		
		//If no errors in parameter requests,add questions to response
		if(currentStatus == 0){
			totalResponse["results"] = filteredQuestions;
		}
		
		//If parameter token was used,remove used questions from session data storage
		if(useID== true && currentStatus == 0){
			for(let i = 0;i<sessionQuestions.length;i++){
				for(let j = 0;j<filteredQuestions.length;j++){
					if(sessionQuestions[i].question_id == filteredQuestions[j].question_id){
						sessionQuestions.splice(i,1);
					}
				}
			}
			//Update the file with only unused questions
			fs.writeFileSync(__dirname +'/sessions/'+filters.token+'.json',JSON.stringify(sessionQuestions));
		}
		
		//Send response
		res.send(totalResponse);
	}
	
})

//Handle post requests to /sessions
app.post('/sessions',function(req,res){
	
	//Generate unique id and add it to id array
	let newSession = uuidv4();
	sessionID.push(newSession);
	
	//Create new file for the session and store all 500 questions
	fs.appendFile(__dirname +'/sessions/'+newSession+'.json',JSON.stringify(allQuestions),function(err){
		if(err) throw err;
	});
	
	//Send created status response and the session id
	res.status(201).send(newSession);
	
})

//Handle get requests to /sessions
app.get('/sessions',function(req,res){
	
	//Send correct status response and the array of all session id's
	res.status(200).send(sessionID);
})

//Handle delete requests for specific session id's
app.delete('/sessions/:sessionid',function(req,res){
	
	//Get the id to delete
	let idToDelete = req.params.sessionid;
	
	//If id is a valid id in use,remove it from the array and delete it's file
	//and send status code showing it was correctly deleted
	if(sessionID.includes(idToDelete)){
		sessionID.splice(sessionID.indexOf(idToDelete),1);
		fs.unlink(__dirname+req.url+'.json',function(err){
				if(err) throw err;
		})
		res.status(200).send();
			
	//Otherwise send a 404 status code
	}else{
		res.status(404).send();
	}
	
})

//Set up route for invalid page requests
app.use(function(req,res){
	res.status(404).send("404 page not found");
})

app.listen(3000);