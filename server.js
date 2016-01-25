

const GRID_TOKEN= process.env.GRID_TOKEN
const AUTH_TOKEN = process.env.AUTH_TOKEN 

var Firebase = require("firebase");
var sendgrid  = require('sendgrid')(GRID_TOKEN);

var ref = new Firebase("https://fireform.firebaseio.com/emailQNotification");

var lastEmail = ''
// Retrieve new posts as they are added to our database
ref.on("child_added", function(snapshot, prevChildKey) {
	var newPost = snapshot.val();
  
	const email = newPost.emailNotification
	const from = 'noreply@fireform.org'
	const subject = 'A new post was made to the form ' + newPost.fireFormRepo
	var text = 'A post faw made to '+ newPost.fireFormRepo + ' with the data:\r\n'
	snapshot.child('form').forEach(function(child){
		var string =  (child.val().name +' : '+child.val().value + "\r\n");
		text += string
	})

	sendgrid.send({
	  to:       email,
	  from:     from,
	  subject:  subject,
	  text:     text
	}, function(err, json) {
	  if (err) { return console.error(err); }
	  console.log(json);
	});
	lastKey = snapshot.key()
  	ref.child(lastKey).remove()
  
});


var refConfirm = new Firebase("https://fireform.firebaseio.com/emailQConfirmation");

refConfirm.on("child_added", function(snapshot, prevChildKey) {
	var newPost = snapshot.val();
  
	const email = newPost.emailConfirmation
	const from = 'noreply@fireform.org'
	const subject = 'Thanks for your submission.'
	var text = 'Success'


	sendgrid.send({
	  to:       email,
	  from:     from,
	  subject:  subject,
	  text:     text
	}, function(err, json) {
	  if (err) { return console.error(err); }
	  console.log(json);
	});

  	refConfirm.child(snapshot.key()).remove()

});


ref.authWithCustomToken(AUTH_TOKEN, function(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
    console.log("Login Succeeded!", authData);
  }
});

refConfirm.authWithCustomToken(AUTH_TOKEN, function(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
    console.log("Login Succeeded!", authData);
  }
});


//Lets require/import the HTTP module
var http = require('http');

//Lets define a port we want to listen to
const port = process.env.PORT || 3000; 

//We need a function which handles requests and send response
function handleRequest(request, response){
    response.end(lastKey);
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});




