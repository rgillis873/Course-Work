//Function to send privacy selection of the user to the server
//so it can be updated in the database
function updatePrivacy(){
	
	//Get the desired privacy setting from the drop down selector
	let privacySetting = document.getElementById("privacySetting").value;
	let sendUpdate = {};
	
	//Determine if setting is on(true) or off(false)
	if(privacySetting === "off"){
		sendUpdate["setting"]=false;
	}
	else{
		sendUpdate["setting"]=true;
	}
	
	//Send xmlhttprequest to the server with the privacy update
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange=function(){
		if(this.readyState==4 && this.status == 200){
		}
	}
	xhttp.open("POST","http://localhost:3000/privacy",true);
	xhttp.setRequestHeader("Content-Type","application/json");
	xhttp.send(JSON.stringify(sendUpdate));	
}

//Function handles logout requests by the user			
function logOut(username){
	
	//Create object to send to the server
	let sendUpdate = {"logout":true,"username":username};
	
	//Send xmlhttprequest tot he server with the log out info
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange=function(){
		if(this.readyState==4 && this.status == 200){
			
			//If successful,redirect to the home page
			let response = JSON.parse(this.responseText);
			window.location.href =response.url;
		}	
	}
	xhttp.open("POST","http://localhost:3000/logout",true);
	xhttp.setRequestHeader("Content-Type","application/json");
	xhttp.send(JSON.stringify(sendUpdate));
}	