var bodyParser = require('body-parser');
var employees = require('./test');
var express = require('express');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/api/nameNDesignation', function (request, response) {
    response.send(employees.nameAndDesignation());
});

app.get('/api/names', function (request, response) {
    response.send(employees.onlyNames());
});

app.get('/api/byDesignation/:designation', function (request, response) {
    var designation = request.params.designation;
    response.send(employees.getByDesignation(designation));
});

app.get('/api/bonus/:id', function (request, response) {
    response.send(employees.calculateBonus(parseInt(request.params.id)));
});

app.get('/api/statement/:id', function (request, response) {
    response.send(employees.employeeStatement(parseInt(request.params.id)));
});

app.listen(3000, function () {
    console.log("Listening on port 3000...");
});