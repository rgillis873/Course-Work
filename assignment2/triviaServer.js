const http = require('http');
const fs = require('fs');
const path = require('path');
const requestPage = require('request');


function send404(response) {
	response.writeHead(404, { 'Content-Type': 'text/plain' });
	response.write('Error 404: Resource not found.');
	response.end();
}
let mimeLookup = {
	'.js': 'application/javascript',
	'.html': 'text/html',
	'.jpg': 'image/jpeg'
};

//Create new server
const server = http.createServer(function (request, response) {
	//Serve up all necessary pages,files, and images
	if(request.method == "GET"){
		if(request.url == "/" || request.url == "/loadJoin.html"){
			fs.readFile("./loadJoin.html", (err, data) => {
				if(err){
					//Send error response
					send404(response);
					return;
				}
				response.writeHead(200, { 'content-type' : 'text/html' });
				response.end(data);
			});
		}else if(request.url == "/loadJoin.js"){
			fs.readFile("./loadJoin.js", (err, data) => {
				if(err){
					//Send error response
					send404(response);
					return;
				}
				response.writeHead(200, { 'content-type': 'application/javascript' });
				response.end(data);
			});
		}else if(request.url == "/gamePage.html"){
			fs.readFile("./gamePage.html", (err, data) => {
				if(err){
					//Send error response
					send404(response);
					return;
				}
				response.writeHead(200, { 'content-type' : 'text/html' });
				response.end(data);
			});	
		}else if(request.url == "/gamePage.js"){
			fs.readFile("./gamePage.js", (err, data) => {
				if(err){
					//Send error response
					send404(response);
					return;
				}
				response.writeHead(200, { 'content-type': 'application/javascript' });
				response.end(data);
			});
		}else if(request.url == "/rsz_1rsz_check.png"){
			fs.readFile("./rsz_1rsz_check.png", (err, data) => {
				if(err){
					//Send error response
					send404(response);
					return;
				}
				response.writeHead(200, { 'content-type' : 'img/png' });
				response.end(data);
			});	
		}else if(request.url == "/rsz_2x.png"){
			fs.readFile("./rsz_2x.png", (err, data) => {
				if(err){
					//Send error response
					send404(response);
					return;
				}
				response.writeHead(200, { 'content-type' : 'img/png' });
				response.end(data);
			});	
		}else if(request.url == "/bobby.png"){
			fs.readFile("./bobby.png", (err, data) => {
				if(err){
					//Send error response
					send404(response);
					return;
				}
				response.writeHead(200, { 'content-type' : 'img/png' });
				response.end(data);
			});	
		}else if(request.url == "/admin.html"){
			fs.readFile("./admin.html", (err, data) => {
				if(err){
					//Send error response
					send404(response);
					return;
				}
				response.writeHead(200, { 'content-type' : 'text/html' });
				response.end(data);
			});	
		}else if(request.url == "/admin.js"){
			fs.readFile("./admin.js", (err, data) => {
				if(err){
					//Send error response
					send404(response);
					return;
				}
				response.writeHead(200, { 'content-type': 'application/javascript' });
				response.end(data);
			});
		}else if(request.url == "/statsPage.html"){
			fs.readFile("./statsPage.html", (err, data) => {
				if(err){
					//Send error response
					send404(response);
					return;
				}
				response.writeHead(200, { 'content-type' : 'text/html' });
				response.end(data);
			});	
		}else if(request.url == "/statsPage.js"){
			fs.readFile("./statsPage.js", (err, data) => {
				if(err){
					//Send error response
					send404(response);
					return;
				}
				response.writeHead(200, { 'content-type': 'application/javascript' });
				response.end(data);
			});
		}else{
			send404(response);
		}
	}else{
		send404(response);
	}
});

//Server listens on port 3000
server.listen(3000);
console.log('Server running at http://127.0.0.1:3000/');

//Increase ping timeout to update player list quicker
const io = require("socket.io")(server,{
	pingInterval:500,
	pingTimeout: 1000
});


//Create variables needed by the server
let responseText = [];

let messages = [];

let sockets = [];

let usernames = [];

let numberOnline = 0;

let count = 0;

let scoreBoard = [];

let gamecounter = 0;

let nameId = [];

let round = 1;

let allScores =[];

//Load first question for when server starts
requestPage('https://opentdb.com/api.php?amount=1',function(err,res,body){
		let decipher = JSON.parse(body);
		let questions = Object.values(decipher);
		responseText = (questions[1]);
});



io.on('connect', socket =>{

	io.emit("usedNames",usernames);
	
	//React when player submits a response
	socket.on("answered", playerScore =>{
		let player = {name:socket.username,score:playerScore,wins:0,games:0,totalpoints:0,online:true};
		
		//Tells all users who has answered current question
		io.emit("hasAnswered",socket.username);
		let isNew = 0;
		
		//Add new player to the scoreboard if not all ready in it
		for(let i = 0;i<scoreBoard.length;i++){
			if(scoreBoard[i].name == socket.username){
				scoreBoard[i].score += playerScore;
				break;
			}
			isNew++;	
		}if(isNew == scoreBoard.length){
			scoreBoard.push(player);
		}
		
		//Update the player scores to show users new score
		io.emit("updateScoreboard",scoreBoard);
		count++;
		
		//If all players online have answered proceed to next question
		if(count == numberOnline){
			round++;
			gamecounter++;
			
			//If 5 questions have been answered,determine winner and load new game
			if(gamecounter == 5){
				
				//Determine winners
				scoreBoard.sort(function(a,b){return b.score-a.score});
				let winners = scoreBoard.filter(function(a){
					return a.score == scoreBoard[0].score;
				});
				io.emit("winner",winners);
				
				//Update the scoreboard for wins,points and games played
				for(let i = 0;i<scoreBoard.length;i++){
					for(let j = 0;j<winners.length;j++){
						if(scoreBoard[i].name == winners[j].name){
							scoreBoard[i].wins+=1;
						}
					}
					scoreBoard[i].totalpoints += scoreBoard[i].score;
					scoreBoard[i].games += 1;		
				}
				
				//Add new player to scoreboard of all players who have
				//played on the server while it is online
				for(let j = 0;j<scoreBoard.length;j++){
					for(let m = 0;m<allScores.length;m++){
						if(scoreBoard[j].name == allScores[m].name){
							allScores.splice(m,1);
						}
					}
					allScores.push(scoreBoard[j]);
				}
				
				//Emit to the stats page
				io.emit("stats",allScores);
				for(let i = 0;i<scoreBoard.length;i++){
					scoreBoard[i].score = 0;
					
				}
				//Reset game and round numbers
				gamecounter = 0;
				round = 1;
			}
			
			//Clear out old question and use request to get new one
			responseText = [];
			requestPage('https://opentdb.com/api.php?amount=1',function(err,res,body){
				let decipher = JSON.parse(body);
				let questions = Object.values(decipher);
				responseText = questions[1];
			});
			//Add 2 second delay so last player to answer can see if they got it right or not
			setTimeout(function(){
				io.emit("nextQuestion",JSON.stringify(responseText));
			},2000);	
			count = 0;
			io.emit("whichRound",round);
			io.emit("updateScoreboard",scoreBoard);
		}
	})
	
	//Admin page can restart game at question 1 and reset scores
	socket.on("restart", () =>{
		for(let i = 0;i<scoreBoard.length;i++){
			scoreBoard[i].score = 0;
		}
		//Get a new question
		requestPage('https://opentdb.com/api.php?amount=1',function(err,res,body){
				let decipher = JSON.parse(body);
				let questions = Object.values(decipher);
				responseText = questions[1];
			});
			
			//Tell players to load new question
			io.emit("nextQuestion",JSON.stringify(responseText));
			io.emit("updateScoreboard",scoreBoard);
		
		//Reset number who have answered,round and game counter
		count = 0;
		gamecounter = 0;
		round = 1;
		io.emit("whichRound",round);
		
		
	})
	
	//Admin can skip to new question
	socket.on("skipQuestion", () =>{
		requestPage('https://opentdb.com/api.php?amount=1',function(err,res,body){
				let decipher = JSON.parse(body);
				let questions = Object.values(decipher);
				responseText = questions[1];
		});
		//Send new question to all users
		setTimeout(function(){io.emit("nextQuestion",JSON.stringify(responseText));},1000);
		io.emit("updateScoreboard",scoreBoard);
		
	})
		
	
	socket.on("disconnect", () =>{
		//If it's not the admin or user on statpage disconnecting, remove player from game roster
		if(socket.username != "admin" && socket.username != "THESTATISCIAN"){
			for(let i = 0;i<nameId.length;i++){
				if(socket.id == nameId[i].id){
					nameId.splice(i,1);
					numberOnline--;
				}
			}
			//Don't have negative amount of users
			if(numberOnline < 0){
				numberOnline = 0;
			}
			//Remove old username
			for(let j = 0;j<usernames.length;j++){
				if(socket.username == usernames[j]){
					usernames.splice(j,1);
				}
			}
			
			//Remove player from active scoreboard
			for(let j = 0;j<scoreBoard.length;j++){
				if(socket.username == scoreBoard[j].name){
					scoreBoard.splice(j,1);
				}
			}
			
			//Reset game and round numbers if no one is playing and delete message history
			if(numberOnline == 0){
				gamecounter = 0;
				round = 1;
				messages = [];
			}
			
			//Update name display,scoreboard and usernames 
			io.emit("displayName",usernames);
			io.emit("updateScoreboard",scoreBoard);
			io.emit("namesOfPlayers",usernames);
		}	
	})
	
	//Socket from the join page
	socket.on("join",name =>{
		//Get username from socket and add it to username array
		let hello = JSON.parse(name);
		let newAdd = hello.player;
		socket.username = newAdd;
		usernames.push(newAdd);
		usernames.push(newAdd);
		
	})
	
	//Socket from the game page
	socket.on("startmeup", ()=>{
		//Increase number online count
		numberOnline+=1;
		
		//Give socket a username
		let name = usernames[usernames.length-1];
		socket.username = name;
		socket.emit("yourname",name);
		
		//Store socket name and id
		nameId.push({playerName:name,id:socket.id});
		
		//Send first question to player
		socket.emit("initialize",JSON.stringify(responseText));
		
		//Display new player to all users in the game
		io.emit("displayName",usernames);
		
		//Load the users chat and which question they are on
		socket.emit("loadChat", messages);
		socket.emit("whichRound",round);
		
		//Add player to the scoreboard
		let player = {name:socket.username,score:0,wins:0,games:0,totalpoints:0,online:true};
		scoreBoard.push(player);
		
		//Update all players scoreboards
		io.emit("updateScoreboard",scoreBoard);
		
	})
	
	//Send messages
	socket.on("message", words =>{
		//If message starts with "@" it's a private message
		if(words.substring(0,1) == "@"){
			//Extract the actual message from the string
			let brokenWords = words.split(" ");
			let playerToMessage = brokenWords[0].substring(1);
			let whichOne = "";
			let yesMessage = -1;
			
			//If the username matches a players username set yesMessage to 1
			for(let i = 0;i<nameId.length;i++){
				if(nameId[i].playerName == playerToMessage){
					whichOne = nameId[i].id;
					yesMessage = 1;
					break;
				} 
			//If it's a match, send the message to that user	
			}if(yesMessage >= 0){
				let whole = socket.username + ": " + words;
				let newMessage = "";
				for(let i = 1;i<brokenWords.length;i++){
					newMessage += brokenWords[i] + " ";
				}
				io.to(whichOne).emit("privateMessage",[socket.username,newMessage]);
			}
			
		//Public messages	
		}else{
			let whole = socket.username + ": " + words;
			messages.push(whole);
			let newMessage = words;
			io.emit("loadMessage",[socket.username,newMessage]);
		}
	})
	
	//On open of admin page
	socket.on("openAdmin",()=>{
		socket.username = "admin";
		
		//Give list of players to admin
		socket.emit("namesOfPlayers",usernames);
	})
	
	//Admin kicked out a player
	socket.on("kickPlayer",name =>{
		let oneToBoot = -1;
		let socketToKick = "";
		
		//If the name matches the name of a user, kick them out
		for(let i = 0;i<nameId.length;i++){
			if(nameId[i].playerName == name){
				socketToKick = nameId[i].id;
				oneToBoot = 1;
				break;
			}
		}
		if(oneToBoot >= 0){
			io.to(socketToKick).emit("kickedOut");
			socket.emit("namesOfPlayers",usernames);
			
		}
		
	})
	
	//Disconnect the player
	socket.on("kickMe", () =>{
		socket.disconnect();
		
	})
	
	//On load of stat page, send scoreboard to the stat page
	socket.on("statCheck",() =>{
		io.emit("stats",allScores);
		socket.username = "THESTATISCIAN";
	})
	
	
	
	
})
io.on("disconnect", ()=>{
	
});