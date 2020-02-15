const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = Schema({
	username: {type: String, required: true},
	password: {type: String, required: true},
	privacy: {type: Boolean, required: true},
	total_quizzes: {type: Number, default: 0},
	total_score: {type: Number, default: 0}
});

//Static function to find all users in the database whose 
//privacy is set to false
userSchema.statics.findNonPrivate = function(callback){
	this.find({"privacy":false},function(err,results){
		if(err){
			callback(err);
			return;
		}
		//Put results into an array
		let resultArray = [];
		results.forEach(function(user){
			resultArray.push(user);
		})
		callback(null,resultArray);
	})
}


module.exports = mongoose.model("User", userSchema);