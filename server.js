var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;
var _ = require('underscore');

var todos = [];
var todoNextId = 1;


app.use(bodyParser.json());


app.get('/', function(req, res){
	res.send('Todo API Root');
	res.end();
});

//GET //todos 
app.get('/todos', function(req, res){
	res.json(todos);
	res.end();
});
//GET /todos/: id

app.get('/todos/:id', function(req, res){
	var todoId = parseInt(req.params.id, 10);

	var matchedTodo = _.findWhere(todos, {id: todoId});
	

	if (matchedTodo){
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}

	res.send('Asking for todos with id of ' + req.params.id);
	res.end();
});


//POST /todos 
app.post('/todos', function(req, res){
	var body = req.body; // use _.pick to only description and completed.


	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
	} 
    
    var body = _.pick(body, 'description','completed');
    body.description = body.description.trim(); 
	// set body.description to be trimmed value


	//add id field
	body.id = todoNextId;
	todoNextId += 1;

	//push body into array.
	todos.push(body);

	console.log('description:' + body.description);

	res.json(body);
});

// delete /todos/:id
app.delete('/todos/:id', function(req, res){
    
	var todoId = parseInt(req.params.id, 10);
	var matchedEle = _.findWhere(todos, {id:todoId});

	if(!matchedEle){
		res.status(404).json({"error":"no todo found ! "});
	} else {
		todos = _.without(todos, matchedEle);
		res.json(matchedEle);
	}
});

//PUT /todos/:id
app.put('/todos/:id', function(req, res){
	var todoId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'description','completed');
	var validAttribute = {};
	var matchedEle = _.findWhere(todos, {id:todoId});
	

	if(!matchedEle){
		return res.status(404).send();
	}


	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
		validAttribute.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	}

	if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
		validAttribute.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	}
	
	//HERE
	_.extend(matchedEle, validAttribute);
	res.json(matchedEle)

});



app.listen(PORT, function(){
	console.log('Express listening on port ' + PORT + '!');
});

