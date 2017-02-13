var express = require('express');
var server = express();
var path = require('path');
var bodyParser = require('body-parser');
var persistor = new (require('./persistence')).SimplePersistence("C:/temp2");
var fs = require('fs');
var models = require('./models');
var vitals = require('./repository');
//var vitalsRepo = new vitals.VitalsRepositories('C:/sqliteDbs/vitals.sqlite');
var vitalsRepo = new vitals.VitalsRepositories('vitals.sqlite');

var diaperRepo = new vitalsRepo.diaperRepo();
var sleepRepo = new vitalsRepo.sleepRepo();
var foodRepo = new vitalsRepo.foodRepo();
var memoRepo = new vitalsRepo.memoRepo();

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

function GetAllRecords(callback){
    var report = [];
    diaperRepo.GetAll(function(err, allrows){
        for(i=0; i<allrows.length; i++){
            var row = allrows[i];
            report.push({
                id: row.id,
                datetime: row.datetime,
                event: models.ConvertDiaperToEvent(row)
            });
        }

        foodRepo.GetAll(function(err, foodRows){
            for(k=0; k<foodRows.length; k++){
                var food = foodRows[k];
                report.push({
                    id: food.id,
                    datetime: food.datetime,
                    event: models.ConvertFoodToEvent(food)
                });
            }

            sleepRepo.GetAll(function(err,sleepRows){
                for(j=0; j < sleepRows.length; j++){
                    var sleep = sleepRows[j];
                    report.push(sleep);
                }

                memoRepo.GetAll(function(err, memoRows){
                    for(h =0; h < memoRows.length; h++){
                        var memo = memoRows[h];
                        report.push({
                            id: memo.id,
                            datetime: memo.datetime,
                            event: memo.memo
                        });
                    }
                    callback(report);
                });
            });
        });
    })
}

server.get('/events', function(req,res){
    GetAllRecords(function(reportData){
        res.send(reportData);
    })
});

server.get('/fullreport/:person', function(req,res){
    if(req.params.person == 'teddy'){
        var data = persistor.LoadRecordsSync(["diaper","sleep","food"]);
        res.send("["+ data +"]");
    }
});

server.post('/save/:type', function(req, res){
    if(req.params.type == 'diaper'){
        var diaper = models.ConvertToDiaperModel(req.body);
        diaperRepo.Save(diaper, function(err, id){
            if(err){
                res.sendStatus(500);
            }
            else{
                res.redirect('/');
            }
        });
    }
    else if(req.params.type == 'sleep'){
        var sleep = models.ConvertToSleepModel(req.body);
        sleepRepo.Save(sleep, function(err, id){
            if(err){
                res.sendStatus(500);
            }
            else{
                res.redirect('/');
            }
        });
    }
    else if(req.params.type == 'food'){
        var food = models.ConvertToFoodModel(req.body);
        foodRepo.Save(food, function(err, id){
            if(err){
                res.sendStatus(500);
            }
            else{
                res.redirect('/');
            }
        });
    }
    else if(req.params.type == 'memo'){
        var memo = models.ConvertToMemoModel(req.body);
        memoRepo.Save(memo, function(err, id){
            if(err){
                res.sendStatus(500);
            }
            else{
                res.redirect('/');
            }
        });
    }else{
        res.redirect('/comingsoon.html');
    }
});

server.listen(8070, function(){
    console.log('Simple webserver has been started');
})