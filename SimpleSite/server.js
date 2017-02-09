var express = require('express');
var server = express();
var path = require('path');
var bodyParser = require('body-parser');
var persistor = new (require('./persistence')).SimplePersistence("C:/temp2");

server.use(express.static(path.join(__dirname,'public')))
server.use(bodyParser.json());
server.use(bodyParser.urlencoded());

server.post('/record', function(req, res){
    console.log(req.body);
    res.sendStatus(200);
});

server.get('/reportdata', function(req, res){
    persistor.LoadRecords('diaper',function(err,data){
        if(err){
            res.sendStatus(500); 
        }else{
            res.send("[" + data + "]");
        }
    });
});

server.post('/diaper', function(req, res){
        persistor.SaveEntry('diaper',req.body, function(err){
            if(err){
                console.log(err);
                res.sendStatus(500);
            }else{
                res.redirect('/');
            }   
        });
});

server.listen(8070, function(){
    console.log('Simple webserver has been started');
})