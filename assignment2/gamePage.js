let socket = null;

//Load up the page
function init(){
	socket = io();
	socket.emit("startmeup");
	socket.on("displayName",function(name){
		displayName(name);
	});
	
	//Get questions from the server
	socket.on("initialize",function(questions){
		loadQuestions(questions);
	});
	
	//Load the chat
	socket.on("loadChat",function(messages){
		chat(messages);
	});
	
	//Diplay the player's name
	socket.on("yourname",function(name){
		document.getElementById("playername").innerHTML = "Username: " + name;
	})
	
	//Load new message from player
	socket.on("loadMessage",function(messages){
		loadMessage(messages);
	});
	
	//Update the scoreboard
	socket.on("updateScoreboard",function(scores){
		updateScoreboard(scores);
	})
	
	//Load next question
	socket.on("nextQuestion",function(question){
		loadQuestions(question);
	})
	
	//Display winner onscreen
	socket.on("winner",function(name){
		displayWinner(name);
	})
	
	//Change player's name colour if they have answered
	socket.on("hasAnswered",function(name){
		document.getElementById(name).style.color = "green";
	})
	
	//Load private message
	socket.on("privateMessage",function(incoming){
		loadPrivateMessage(incoming);
	})
	
	//Kick player out and alert them that they've been kicked
	socket.on("kickedOut",function(){
		alert("You've been kicked from the game!");
		socket.emit("kickMe");
	})
	
	//Display current question number
	socket.on("whichRound", function(round){
		let curRound = document.getElementById("roundnumber");
		curRound.innerHTML = "Question: " + round;
	})
}

let saveQuestion = []

//Load current question for the user
function loadQuestions(questions){
	let decipher = JSON.parse(questions);
	
	//Reset all player name colours
	let resetColor = document.getElementById("nameSpot");
	let eachName = resetColor.childNodes;
	for(let i = 0;i<eachName.length;i++){
		eachName[i].style.color = "black";
	}
	
	//Remove previous question and save new one
	saveQuestion = [];
	saveQuestion.push(decipher[0]);
	
	//Clear test area and load question and answer choices
	let testArea = document.getElementById("questionArea");
	testArea.innerHTML = "";
	for(let i = 0;i<decipher.length;i++){
		let question = document.createElement("div");
		question.innerHTML = "<br>" + decipher[i].question + "<br><br>";
		question.className = "question";
		testArea.appendChild(question);
		
		//Combine all answers and randomly sort them 
		let allOptions = decipher[i].incorrect_answers;
		allOptions.push(decipher[i].correct_answer);
		allOptions = randSort();
		for(let j = 0;j< allOptions.length;j++){
			let choices = document.createElement("input");
			choices.type = "radio"
			choices.id = "q" + j + "answer"+j;
			choices.name = "question"+i;
			choices.value = allOptions[j];
			choices.className = "question"+i; 
			
			//Create label for the answer
			let answer = document.createElement("label");
			answer.innerHTML = allOptions[j];
			
			//Append label to radio button and then button to page
			answer.appendChild(choices);
			testArea.appendChild(answer);
			let br = document.createElement("br");
			testArea.append(br);
		}
		//Add submit button
		let answerButton = document.createElement("input");
		answerButton.type = "button";
		answerButton.value = "Submit Answer";
		answerButton.id = "answerbutton";
		answerButton.addEventListener("click", checkAnswer);
		testArea.appendChild(answerButton);
		
	}
	
}

//Display all the players in the game
function displayName(name){
	let namePlace = document.getElementById("nameSpot");
	let user = name[name.length-1];
	let lessNames = name.filter((item,index) =>{ return name.indexOf(item) === index});
	
	//Remove old list of names
	let oldNames = namePlace.childNodes;
	for(let i = oldNames.length-1;i>=0;i--){
		oldNames[i].parentNode.removeChild(oldNames[i]);
	}
	
	//Add updated list of names
	for(let i = 0;i<lessNames.length;i++){
		let newName = document.createElement('div');
		newName.class = "name";
		newName.id = lessNames[i];
		newName.innerHTML = lessNames[i] + " is playing";
		namePlace.appendChild(newName);
	}
}

//Function to randomly sort answers for questions
function randSort(){
	let wrong = saveQuestion[0].incorrect_answers;
	let right = saveQuestion[0].correct_answer;
	
	//Reset the answers if previously called
	if(wrong.length === 4 || wrong.length === 2){
		wrong = wrong.filter(function(value){
			return value !== right; 
		});
	//For questions with 4 possible answers
	}if(wrong.length === 3){
		let randNum1 = Math.floor(Math.random()*4);
		wrong.splice(randNum1,0,right);
		return wrong;
	
	//For true or false questions
	}else if(wrong.length === 1){
		let randNum2 = Math.floor(Math.random()*2);
		wrong.splice(randNum2,0,right);
		return wrong;
	}	
	
}

//Add message to the chat
function chat(messages){
	let chatArea = document.getElementById("messageArea");
	for(let i = 0;i<messages.length;i++){
		let addMessage = document.createElement("div");
		addMessage.innerHTML = messages[i];
		chatArea.appendChild(addMessage);
	}
	
	
}

//Send message using textbox
function sendMessages(){
	let message = document.getElementById("message");
	if(message != null){
		console.log(message.value);
		let newmsg = message.value;
		if (newmsg.length > 0){
			socket.emit("message",newmsg);
		}
	}
	message.value = "";
}

//Load new message onto the chat
function loadMessage(incoming){
	let user = incoming[0];
	let message = incoming[1];
	let chatSpace = document.getElementById("messageArea");
	let newMessage = document.createElement('div');
	newMessage.innerHTML = user + ": " + message;
	chatSpace.appendChild(newMessage);
}

//Load a private message
function loadPrivateMessage(incoming){
	let user = incoming[0];
	let message = incoming[1];
	let chatSpace = document.getElementById("messageArea");
	let newMessage = document.createElement('div');
	newMessage.innerHTML = user + ": " + message;
	newMessage.style.color = "blue";
	chatSpace.appendChild(newMessage);
}


//Check player's answer and submit score to server
function checkAnswer(){
	let counter = 0;
	let playerScore = 0;
	
	let potentialAnswers = document.querySelectorAll('input[type ="radio"]:checked' );
	let questions = document.getElementsByClassName("question");
	
	//If not all questions are answered, send alert to user and highlight 
	//unanswered questions
	if(potentialAnswers.length < questions.length){
		//alert("Answer all questions before checking your test!");
		for(let i = 0;i<questions.length;i++){
			let allChoices = document.getElementsByClassName("question"+i);
			for(let j = 0;j<allChoices.length;j++){
				let selection = allChoices[j];
				questions[i].style.color = "black";
				if(selection.checked){
					counter = 0;
					break;
				}
				counter ++;
				if(counter === allChoices.length){
					questions[i].style.color = "red";
					counter = 0;
					break;
				}
			}
		}
		return;
	}
	document.getElementById("answerbutton").disabled = true;
	//Remove previous checks and x's if necessary 
	let allImage = document.getElementsByTagName("img");
		for(let i = allImage.length-1;i>=0;i--){
			allImage[i].parentNode.removeChild(allImage[i]);
		}
		
	//Remove previous score if necessary	
	let scoreChange = document.getElementById("finalScore");
	let page = document.getElementById("questionArea");
	if(page.childNodes[page.childNodes.length-1] === scoreChange){
		page.removeChild(scoreChange);
	}
	//Add checks to correct answers and x's to incorrect answers 
	for(let r = 0;r<potentialAnswers.length;r++){
		let allImage = document.getElementsByTagName("img");
		questions[r].style.color = "black";
		
		if(potentialAnswers[r].value === saveQuestion[0].correct_answer){
			playerScore+=100;
			let imgCheck = document.createElement("img");
			imgCheck.src = "rsz_1rsz_check.png";
			potentialAnswers[r].parentNode.appendChild(imgCheck);
		}else{
			playerScore-=100;
			let imgX = document.createElement("img");
			imgX.src = "rsz_2x.png";
			potentialAnswers[r].parentNode.appendChild(imgX);
			continue;
		}
	}
	//Determine users score
	let finalScore = document.createElement("span");
	finalScore.innerHTML = "Score: "+ playerScore ;
	finalScore.id = "finalScore";
	let score = document.getElementById("questionArea");
	
	//Add the score to the page next to the photo
	score.appendChild(finalScore);
	
	//Tell server the player has answered
	socket.emit("answered",playerScore);
}

//Update all player scores
function updateScoreboard(scores){
	let allPlayers = scores;
	
	//Sort scores so person with most points is displayed at top
	allPlayers.sort(function(a,b){return b.score-a.score});
	let update= document.getElementById("scoreBoard");
	update.innerHTML = "Name       Score    <br>";
	
	//Add the scores to the page
	for(let i = 0;i<allPlayers.length;i++){
			let addScore = document.createElement("div");
			addScore.innerHTML = allPlayers[i].name + "     "  + allPlayers[i].score;
			update.appendChild(addScore);
	}
	
}


//Display winner(s) from last round
function displayWinner(name){
	//Remove old winner(s)
	let removeOld = document.getElementById("winnersDisplay");
	if(removeOld != null){
		removeOld.parentNode.removeChild(removeOld);
	}
	
	//Add new winner(s)
	let winnersDisplay = document.createElement("div");
	winnersDisplay.id = "winnersDisplay";
	let winningText = document.createTextNode("Last Round winner(s) are: ");
	winnersDisplay.appendChild(winningText);
	for(let i = 0;i<name.length;i++){
		let winner = document.createElement("div");
		winner.innerHTML = name[i].name + " with " + name[i].score + " points!";
		let br = document.createElement("br");
		winnersDisplay.appendChild(winner);
		winnersDisplay.append(br);	
	}
	let winnersCircle = document.getElementById("winnerscircle");
	winnersCircle.appendChild(winnersDisplay);
	
	document.getElementById("scoreBoard").innerHTML = "";
}