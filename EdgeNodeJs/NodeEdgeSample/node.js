var edge = require('edge');
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = new express();
var logger = require('morgan');

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(__dirname + '/access.log',{flags: 'a'});
// setup the logger
app.use(logger('combined', {stream: accessLogStream}))

var methodOverride = require('method-override')
// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('X-HTTP-Method-Override'))

app.use('/', express.static(require('path').join(__dirname, 'scripts')));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

function handler(error, result){
	if (error){
		console.log("Error occured.");
		console.log(error);
		return;
	}
	console.log(result);
}

app.get('/', function(request, response){
	response.sendFile(__dirname + '/index.html');
});

app.get('/api/employees', function(request, response){
	var getEmployeeProxy = edge.func({
		assemblyFile: 'dlls\\EmployeesCRUD.dll',
		typeName:'EmployeesCRUD.EmployeesOperations',
		methodName: 'GetEmployees'
	});
	
	getEmployeeProxy(null, apiResponseHandler(request, response));
});

app.post('/api/employees', function(request, response){
	var addEmployeeProxy = edge.func({
		assemblyFile: 'dlls\\EmployeesCRUD.dll',
		typeName:'EmployeesCRUD.EmployeesOperations',
		methodName: 'AddEmployee'
	});
	
	addEmployeeProxy(request.body, apiResponseHandler(request, response));
});

app.put('/api/employees/:id', function(request, response){
	var editEmployeeProxy = edge.func({
		assemblyFile: 'dlls\\EmployeesCRUD.dll',
		typeName:'EmployeesCRUD.EmployeesOperations',
		methodName: 'EditEmployee'
	});
	
	editEmployeeProxy(request.body, apiResponseHandler(request, response));
});

app.delete('/api/employees/:id', function(request, response){
	console.log('Server: deleting ' + request.params.id);
	var delEmployeeProxy = edge.func({
		assemblyFile: 'dlls\\EmployeesCRUD.dll',
		typeName:'EmployeesCRUD.EmployeesOperations',
		methodName: 'DeleteEmployee'
	});
	
	delEmployeeProxy(request.params.id, apiResponseHandler(request, response));
});

function apiResponseHandler(request, response){
	return function(error, result){
		if (error){
			response.status(500).send({error: error});
			return;
		}
		return response.send(result);
	};
}

app.listen(3000, function(){
	console.log("Express server running on port 3000...");
});