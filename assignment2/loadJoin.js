
let usedNames = [];
let canJoin = 0;

//Loads on page load and gets names of current players(if any) from server
function start(){
	let socket = io();
	socket.on("usedNames",function(usernames){
		console.log(usernames);
		usedNames = usernames;
		namesInUse(usernames);
	})
	//If user has entered a valid username, they get redirected to the game page
	if(canJoin > 0){
		let userName = document.getElementById("playerName").value;
		//let socket = io();
		socket.emit("join",JSON.stringify({player:userName}));
		location.replace("http://localhost:3000/gamePage.html");
	}	
}

//Display which names are in use (if any)
function namesInUse(usernames){
	
	//Remove old names
	let oldNames = document.getElementById("nameSpot");
	let child = oldNames.childNodes;
	for(let i = child.length-1;i>=0;i--){
		child[i].parentNode.removeChild(child[i]);
	}
	
	//Add new names
	for(let j = 0;j<usernames.length;j++){
		let name = document.createElement("div");
		name.innerHTML = usernames[j];
		oldNames.appendChild(name);
	}
	
}

//Check if user has entered a valid name
function newPlayer(){
	let userName = document.getElementById("playerName").value;
	if(userName.length > 0){
		for(let i = 0;i<usedNames.length;i++){
			
			//Check if user's name choice has been taken
			if(userName == usedNames[i]){
				alert("That name has been used");
				document.getElementById("playerName").value = "";
				return false;
			}
		}
		canJoin = 1;
		start();
	}
	return false;
}


