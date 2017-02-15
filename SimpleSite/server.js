var express = require('express');
var server = express();
var path = require('path');
var bodyParser = require('body-parser');
var persistor = new (require('./persistence')).SimplePersistence("C:/temp2");
var fs = require('fs');
var models = require('./models');
var vitals = require('./vitalsService');
var service = new vitals.VitalsService('vitals.sqlite');



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




server.get('/events', function(req,res){
    var startDate = (req.query.startDate ? req.query.startDate : '2010-01-01') + ' 00:00:00';
    var endDate = (req.query.endDate ? req.query.endDate : '2030-01-01') + ' 00:00:00';
    var type = req.query.type ? req.query.type : 'all';
    
    var types = [];
    if(type == 'all'){
        types = ['diaper','memo','sleep','food'];
    }else{
        types.push(req.query.type);
    }

    service.Search(types,startDate,endDate,function(results){
        res.send(results);
    });
});


server.post('/save/:type', function(req, res){
    var type = req.params.type;
    service.Save(type,req.body,function(err,id){
        if(err){
            res.sendStatus(500);
        }
        else{
            res.redirect('/');
        }
    });
});

server.listen(8070, function(){
    console.log('Simple webserver has been started');
})