
//Create arrays to hold questions from the server and to send to the server
let currentQuestions = [];
let questionsToSend = [];

//Function to remove a question from current quiz list
// parameter id is the id of the button to remove
function removeLinks(id){
	
	//Get elements to remove
	let list = document.getElementById("thelist");
	let removeButton = document.getElementById(id);
	let realID = id.substring(0,id.length-1);
	let removeLink = document.getElementById(realID+"clone");
	let removeBreak = document.getElementById(realID+"break");
	
	//Remove question from list being sent to server when quiz is saved
	for(let i = 0;i<questionsToSend.length;i++){
		if(questionsToSend[i]._id == realID){
			questionsToSend.splice(i,1);
			break;
		}
	}
	//Remove the question,button and line break 
	removeButton.parentNode.removeChild(removeButton);
	removeLink.parentNode.removeChild(removeLink);
	removeBreak.parentNode.removeChild(removeBreak);
	
	//If quiz is empty, display "Quiz is empty"
	if(list.childNodes.length == 0){
		let addEmpty = document.createElement("div");
		addEmpty.id = "empty";
		addEmpty.innerHTML = "Quiz is empty";
		list.appendChild(addEmpty);
	}
}

//Function adds a link to the current quiz questions list
// parameter id is the id of the question to add
function addLinks(id){
	
	//Get list element
	let list = document.getElementById("thelist");
	
	//Check if "Quiz is empty" is currently displayed and remove it if necessary
	let emptyText = document.getElementById("empty");
	if(emptyText != null){
		emptyText.parentNode.removeChild(emptyText);
	}
	
	let counter = 0;
	//Make sure question isn't already added to list
	for(let i = 0;i<questionsToSend.length;i++){
		if(questionsToSend[i]._id === id){
			break;
		}
		counter++;
	}
	//If it's a new question, add it to the list
	if(counter == questionsToSend.length){
		
		//Find the question in the pool of search questions and
		//add it to the questions to send to the server
		for(let j = 0;j<currentQuestions.length;j++){
			if(currentQuestions[j]._id == id){
				questionsToSend.push(currentQuestions[j]);
			}
		}
		//Create remove button for the question
		let remove = document.createElement("input");
		remove.type = "button";
		remove.value = "Remove";
		remove.id = id+"r";
		remove.style.margin = "10px";
		remove.setAttribute("onclick","removeLinks(this.id)");
		
		//Clone the link element and change it's id
		let copyLink = document.getElementById(id);
		let newClone = copyLink.cloneNode(true);
		newClone.id = copyLink.id+"clone";
		
		let lineBreak = document.createElement("br");
		lineBreak.id = id+"break";
		
		//Add button,link and line break to the list
		list.appendChild(remove);
		list.appendChild(newClone);
		list.appendChild(lineBreak);
	}
	
	//Otherwise let client know question was already added
	else{
		alert("That question has already been added to the quiz");
	}
	
}

//Function verifies that all quiz requirements have been satisfied and
//then sends quiz info to the server
function saveQuiz(){
	
	//Get creator's name and quiz tags
	let name = document.getElementById("name").value;
	let tags = document.getElementById("tag").value;
	
	//Create alert message in case a requirement was missed
	let buildAlert = "";
	
	//If no name was added
	if(name.length == 0){
		buildAlert+="You need to add a name. "
	}
	
	//If no tags were added
	if(tags.length == 0){
		buildAlert+="You need to add a quiz tag. ";
	}
	
	//If no questions were added
	if(questionsToSend.length == 0){
		buildAlert+="You need to add questions to the quiz.";
	}
	
	//If atleast one requirement was missed, send alert to user
	if(buildAlert.length > 0){
		alert(buildAlert);
		return;
	
	//Otherwise prepare info to send to server
	}else{
		
		//Make object to send to the server
		let quizObject = {"creator":name,"tags":tags,"questions":questionsToSend};
		
		//Create XMLHttpRequest Post request
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function(){
			if(this.readyState == 4){
				
				//If server verifies quiz requirements, redirect to the quiz
				if(this.status == 200){
					window.location.replace("http://localhost:3000/quiz/"+this.responseText);
				
				//Otherwise display alert error message
				}else{
					alert(this.responseText);
					return;
				}
			}
		}
		xhttp.open("POST","http://localhost:3000/quizzes",true);
		xhttp.setRequestHeader("Content-Type","application/json");
		xhttp.send(JSON.stringify(quizObject));
		
	}
	
}

//Function gets the current category and difficulty selections and 
//sends them to the server to update current search/Add links
function updateLinks(){
	
	//Get values of two drop down selectors
	let categoryChoice = document.getElementById("category").value;
	let difficulty = document.getElementById("difficulty").value;
	
	//Encode category to deal with '&' issues
	let category = encodeURIComponent(categoryChoice);
	
	//Create XMLHttpRequest Get request
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			//Get question array from server and update the links
			let newLinks = JSON.parse(this.responseText);
			refreshList(newLinks.questions);
		}
	}
	xhttp.open("GET","http://localhost:3000/questions?category="+category+"&difficulty="+difficulty,true);
	xhttp.setRequestHeader("Content-Type","application/json");
	xhttp.send();
}

//Function updates the links displayed in the search/Add results
// paramter links is an array of questions sen from the server
function refreshList(links){
	
	//Get the search list element and clear out old links
	let searchList = document.getElementById("search");
	searchList.innerHTML = "";
	
	//Update current pool of questions
	currentQuestions = links;
	
	//Create a link and add button for all new questions
	for(let i = 0;i<links.length;i++){
		let newLink = document.createElement("a");
		let newText = document.createTextNode(links[i].question.replace(/&quot;/g,'"').replace(/&#039;/g,"'").replace(/&amp;/g,"&"));
		newLink.appendChild(newText);
		newLink.title = links[i].question;
		newLink.href = "http://localhost:3000/questions/"+links[i]._id;
		newLink.id = links[i]._id;
		newLink.target = "_blank";
		
		//Create add button
		let newAdd = document.createElement("input");
		newAdd.type="button";
		newAdd.setAttribute("onclick","addLinks(this.name)");
		newAdd.name = links[i]._id;
		newAdd.style.margin= "10px";
		newAdd.value = "Add";
		
		//Add button,link and line break to the list
		searchList.appendChild(newAdd);
		searchList.appendChild(newLink);
		searchList.innerHTML+="<br>";
		
	}
	
}