var express = require('express');
var server = express();
var path = require('path');
var bodyParser = require('body-parser');
var persistor = new (require('./persistence')).SimplePersistence("C:/temp2");
var fs = require('fs');


server.use(express.static(path.join(__dirname,'public')))
server.use(bodyParser.json());
server.use(bodyParser.urlencoded());


server.post('/record', function(req, res){
    console.log(req.body);
    res.sendStatus(200);
});

server.get('/report/:type', function(req, res){
    persistor.LoadRecords(req.params.type,function(err,data){
        if(err){
            res.send("[]")
        }else{
            res.send("[" + data + "]");
        }
    });
});

server.get('/fullreport/:person', function(req,res){
    if(req.params.person == 'teddy'){
        var data = persistor.LoadRecordsSync(["diaper","sleep","food"]);
        res.send("["+ data +"]");
    }
});


server.post('/save/:type', function(req, res){
        persistor.SaveEntry(req.params.type, req.body, function(err){
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