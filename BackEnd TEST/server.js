// Improts
var express = require('express');

// Instantiate server
var server = express();

// Configure routes
server.get('/', function(req,res){
    res.setHeader('Content-Type','text/html');
    res.status(200).send('<h1>Bonjour sur mon serveur</h1>');
});

// Lauch serveur
server.listen(3000, function() {
    console.log('Serveur en écoute')
})