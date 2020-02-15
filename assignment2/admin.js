let socket = null;

let listOfPlayers = [];

//Initialize the page
function init(){
	socket = io();
	socket.emit("openAdmin");
	socket.on("namesOfPlayers",function(names){
		listPlayers(names);
	})
	
}	

//Tell server to restart the game
function restartGame(){
	socket.emit("restart");
}

//Tell server to skip question
function skipQuestion(){
	socket.emit("skipQuestion");
}

//Display the name of the player kicked out
function displayBooted(name){
	let booted = document.getElementById("booted");
	let playerBooted = booted.childNodes;
	
	//Remove name of last player booted if present
	for(let i = playerBooted.length-1;i>=0;i--){
		playerBooted[i].parentNode.removeChild(playerBooted[i]);
	}
	
	//Display name of latest player booted
	let newBooted = document.createElement("div");
	newBooted.innerHTML = name + " has been kicked out";
	booted.appendChild(newBooted);
}

//Kick player out using their username entered to textbox
function kickPlayer(){
	let player = document.getElementById("playerToKick").value;
	if(player.length > 0){
		for(let i = 0;i<listOfPlayers.length;i++){
			if(player == listOfPlayers[i]){
				socket.emit("kickPlayer",player);
				displayBooted(player);
				let textReset = document.getElementById("playerToKick").value = "";
				return;
			}
		}
		alert("That is not a valid player name");
	}
}



//Display players currently connected to the game
function listPlayers(names){
	listOfPlayers = names;
	
	//Remove old names
	let namePlace = document.getElementById("nameSpot");
	let user = names[names.length-1];
	let lessNames = names;
	let oldNames = namePlace.childNodes;
	for(let j = oldNames.length-1;j>=0;j--){
		oldNames[j].parentNode.removeChild(oldNames[j]);
	}
	
	//Add updated names
	for(let i = 0;i<lessNames.length;i++){
		let newName = document.createElement('div');
		newName.class = "name";
		newName.id = lessNames[i];
		newName.innerHTML = lessNames[i];
		namePlace.appendChild(newName);
	}
}