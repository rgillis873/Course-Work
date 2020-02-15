let socket = null;

//Initialize the page and load current stats
function init(){
	socket = io();
	socket.emit("statCheck");
	socket.on("stats",function(statistics){
		loadStats(statistics);
	})
	
	
}

//Holds players
let statSheet = [];


//Get stats from server and load them
function loadStats(statistics){
	
	//Add new players or update scores of current players
	for(let j = 0;j<statistics.length;j++){
		for(let m = 0;m<statSheet.length;m++){
			if(statistics[j].name == statSheet[m].name){
				statSheet.splice(m,1);
			}
		}
		statSheet.push(statistics[j]);
	}
	
	//Remove all the old stats
	let name = document.getElementById("player");
	let nameKids = name.childNodes;
	for(let k = nameKids.length-1;k>0;k--){
		nameKids[k].parentNode.removeChild(nameKids[k]);
	}
		
	let games = document.getElementById("games");
	let gameKids = games.childNodes;
	for(let k = gameKids.length-1;k>0;k--){
		gameKids[k].parentNode.removeChild(gameKids[k]);
	}
	let wins = document.getElementById("wins");
	let winKids = wins.childNodes;
	for(let k = winKids.length-1;k>0;k--){
		winKids[k].parentNode.removeChild(winKids[k]);
	}
		
	let loss = document.getElementById("losses");
	let lossKids = loss.childNodes;
	for(let k = lossKids.length-1;k>0;k--){
		lossKids[k].parentNode.removeChild(lossKids[k]);
	}
		
	let totpoints = document.getElementById("totalpoints");
	let totKids = totpoints.childNodes;
	for(let k = totKids.length-1;k>0;k--){
		totKids[k].parentNode.removeChild(totKids[k]);
	}
		
	let averagepoints = document.getElementById("averagepoints");
	let avgKids = averagepoints.childNodes;
	for(let k = avgKids.length-1;k>0;k--){
		avgKids[k].parentNode.removeChild(avgKids[k]);
	}
		
	let winpctg = document.getElementById("winpctg");
	let pctgKids = winpctg.childNodes;
	for(let k = pctgKids.length-1;k>0;k--){
		pctgKids[k].parentNode.removeChild(pctgKids[k]);
	}
		
	//Add new stats to the page
	for(let i = 0;i<statSheet.length;i++){
		let losses = statSheet[i].games-statSheet[i].wins;
		let winPct = statSheet[i].wins/statSheet[i].games;
		let averagePoints = statSheet[i].totalpoints/statSheet[i].games;
		
		let playname = document.createElement("div");
		playname.innerHTML = statSheet[i].name;
		name.appendChild(playname);
		
		let playgames = document.createElement("div");
		playgames.innerHTML = statSheet[i].games;
		games.appendChild(playgames);
		
		let playwins = document.createElement("div");
		playwins.innerHTML = statSheet[i].wins;
		wins.appendChild(playwins);
		
		let playlosses = document.createElement("div");
		playlosses.innerHTML = losses;
		loss.appendChild(playlosses);
		
		let playtotpoints = document.createElement("div");
		playtotpoints.innerHTML = statSheet[i].totalpoints;
		totpoints.appendChild(playtotpoints);
		
		let playaveragepoints = document.createElement("div");
		playaveragepoints.innerHTML = averagePoints;
		averagepoints.appendChild(playaveragepoints);
		
		let playwinpctg = document.createElement("div");
		playwinpctg.innerHTML = winPct;
		winpctg.appendChild(playwinpctg);
		
	}
}	

function sortWins(){
	//Sort statsheet by player wins
	statSheet.sort(function(a,b){return b.wins-a.wins});
	
	//Remove old stats
	let name = document.getElementById("player");
	let nameKids = name.childNodes;
	for(let k = nameKids.length-1;k>0;k--){
		nameKids[k].parentNode.removeChild(nameKids[k]);
	}
		
	let games = document.getElementById("games");
	let gameKids = games.childNodes;
	for(let k = gameKids.length-1;k>0;k--){
		gameKids[k].parentNode.removeChild(gameKids[k]);
	}
		
	let wins = document.getElementById("wins");
	let winKids = wins.childNodes;
	for(let k = winKids.length-1;k>0;k--){
		winKids[k].parentNode.removeChild(winKids[k]);
	}
		
	let loss = document.getElementById("losses");
	let lossKids = loss.childNodes;
	for(let k = lossKids.length-1;k>0;k--){
		lossKids[k].parentNode.removeChild(lossKids[k]);
	}
		
	let totpoints = document.getElementById("totalpoints");
	let totKids = totpoints.childNodes;
	for(let k = totKids.length-1;k>0;k--){
		totKids[k].parentNode.removeChild(totKids[k]);
	}
		
	let averagepoints = document.getElementById("averagepoints");
	let avgKids = averagepoints.childNodes;
	for(let k = avgKids.length-1;k>0;k--){
		avgKids[k].parentNode.removeChild(avgKids[k]);
	}
		
	let winpctg = document.getElementById("winpctg");
	let pctgKids = winpctg.childNodes;
	for(let k = pctgKids.length-1;k>0;k--){
		pctgKids[k].parentNode.removeChild(pctgKids[k]);
	}
	
	//Add the new sorted stats	
	for(let i = 0;i<statSheet.length;i++){
		let losses = statSheet[i].games-statSheet[i].wins;
		let winPct = statSheet[i].wins/statSheet[i].games;
		let averagePoints = statSheet[i].totalpoints/statSheet[i].games;
		
		let playname = document.createElement("div");
		playname.innerHTML = statSheet[i].name;
		name.appendChild(playname);
		
		let playgames = document.createElement("div");
		playgames.innerHTML = statSheet[i].games;
		games.appendChild(playgames);
		
		let playwins = document.createElement("div");
		playwins.innerHTML = statSheet[i].wins;
		wins.appendChild(playwins);
		
		let playlosses = document.createElement("div");
		playlosses.innerHTML = losses;
		loss.appendChild(playlosses);
		
		let playtotpoints = document.createElement("div");
		playtotpoints.innerHTML = statSheet[i].totalpoints;
		totpoints.appendChild(playtotpoints);
		
		let playaveragepoints = document.createElement("div");
		playaveragepoints.innerHTML = averagePoints;
		averagepoints.appendChild(playaveragepoints);
		
		let playwinpctg = document.createElement("div");
		playwinpctg.innerHTML = winPct;
		winpctg.appendChild(playwinpctg);
		
	}
	
	
}	
	
function sortPoints(){
	//Sort player stats by total points earned
	statSheet.sort(function(a,b){return b.totalpoints-a.totalpoints});
	
	//Remove old stats
	let name = document.getElementById("player");
	let nameKids = name.childNodes;
	for(let k = nameKids.length-1;k>0;k--){
		nameKids[k].parentNode.removeChild(nameKids[k]);
	}
		
	let games = document.getElementById("games");
	let gameKids = games.childNodes;
	for(let k = gameKids.length-1;k>0;k--){
		gameKids[k].parentNode.removeChild(gameKids[k]);
	}
		
	let wins = document.getElementById("wins");
	let winKids = wins.childNodes;
	for(let k = winKids.length-1;k>0;k--){
		winKids[k].parentNode.removeChild(winKids[k]);
	}
		
	let loss = document.getElementById("losses");
	let lossKids = loss.childNodes;
	for(let k = lossKids.length-1;k>0;k--){
		lossKids[k].parentNode.removeChild(lossKids[k]);
	}
		
	let totpoints = document.getElementById("totalpoints");
	let totKids = totpoints.childNodes;
	for(let k = totKids.length-1;k>0;k--){
		totKids[k].parentNode.removeChild(totKids[k]);
	}
		
	let averagepoints = document.getElementById("averagepoints");
	let avgKids = averagepoints.childNodes;
	for(let k = avgKids.length-1;k>0;k--){
		avgKids[k].parentNode.removeChild(avgKids[k]);
	}
		
	let winpctg = document.getElementById("winpctg");
	let pctgKids = winpctg.childNodes;
	for(let k = pctgKids.length-1;k>0;k--){
		pctgKids[k].parentNode.removeChild(pctgKids[k]);
	}
	
	//Add new sorted stats to the page	
	for(let i = 0;i<statSheet.length;i++){
		let losses = statSheet[i].games-statSheet[i].wins;
		let winPct = statSheet[i].wins/statSheet[i].games;
		let averagePoints = statSheet[i].totalpoints/statSheet[i].games;
		
		let playname = document.createElement("div");
		playname.innerHTML = statSheet[i].name;
		name.appendChild(playname);
		
		let playgames = document.createElement("div");
		playgames.innerHTML = statSheet[i].games;
		games.appendChild(playgames);
		
		let playwins = document.createElement("div");
		playwins.innerHTML = statSheet[i].wins;
		wins.appendChild(playwins);
		
		let playlosses = document.createElement("div");
		playlosses.innerHTML = losses;
		loss.appendChild(playlosses);
		
		let playtotpoints = document.createElement("div");
		playtotpoints.innerHTML = statSheet[i].totalpoints;
		totpoints.appendChild(playtotpoints);
		
		let playaveragepoints = document.createElement("div");
		playaveragepoints.innerHTML = averagePoints;
		averagepoints.appendChild(playaveragepoints);
		
		let playwinpctg = document.createElement("div");
		playwinpctg.innerHTML = winPct;
		winpctg.appendChild(playwinpctg);
		
	}
	
}
