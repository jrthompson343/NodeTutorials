var sqlite3 = require('sqlite3').verbose();
var moment = require('moment');
var fs = require('fs');


function VitalsRepositories(databaseName){
    var db = new sqlite3.Database(databaseName);
    
    var eventId = 0;
    if(fs.existsSync('event.order')){
        eventId = Number(fs.readFileSync('event.order','utf8'));
    }
    
    function GetEventId(){
        eventId++;
        fs.appendFileSync('event.order',eventId);
        return eventId;
    }
    
    this.personRepo = function(){
        this.FindById = function(id,callback){
            db.get("select * from person where id = ?",id, callback);
        }  

        this.Save = function(person, callback){
            db.serialize(function(){
                var statement = db.prepare("insert into person (fname,lname) values (?,?)");
                statement.run(person.fname, person.lname);
                statement.finalize(); 

                db.get("select id from person order by id desc limit 1", callback);
            })
           
        }     
    }

    this.diaperRepo = function(){
        this.FindById = function(id, callback){
            db.get("select * from diaper where id = ?", id, callback);
        }
        
        this.DiapersByDateRange = function(startDate, endDate, callback){
            db.all("select * from diaper where datetime between ? and ?", startDate, endDate, callback);
        }

        this.GetAll = function(callback){
            db.all("select * from diaper",callback);
        }

        this.Save = function(diaper,callback){
            db.serialize(function(){
                var statement = db.prepare("insert into diaper (datetime, eventOrder, isWet, isDirty, poopColor, timeStamp) values (?,?,?,?,?,?)");
                statement.run(diaper.datetime, GetEventId(), diaper.isWet, diaper.isDirty, diaper.poopColor, moment().format('YYYY-MM-DD HH:MM:SS.SSS'));
                statement.finalize();

                db.get("select id from diaper order by id desc limit 1", callback);
            });
        }
    }

    this.foodRepo = function(){
        this.FindById = function(id, callback){
            db.get("select * from food where id = ?", id, callback);
        }
        
        this.DiapersByDateRange = function(startDate, endDate, callback){
            db.all("select * from food where datetime between ? and ?", startDate, endDate, callback);
        }

        this.GetAll = function(callback){
            db.all("select * from food",callback);
        }

        this.Save = function(food,callback){
            db.serialize(function(){
                var statement = db.prepare("insert into food (datetime, eventOrder, left, right, bottle, bottleType, timeStamp) values (?,?,?,?,?,?,?)");
                statement.run(food.datetime, GetEventId(), food.left, food.right, food.bottle, food.bottleType, moment().format('YYYY-MM-DD HH:MM:SS.SSS'));
                statement.finalize();

                db.get("select id from food order by id desc limit 1", callback);
            });
        }
    }

    this.sleepRepo = function(){
        this.FindById = function(id, callback){
            db.get("select * from sleep where id = ?", id, callback);
        }
        
        this.DiapersByDateRange = function(startDate, endDate, callback){
            db.all("select * from sleep where datetime between ? and ?", startDate, endDate, callback);
        }

        this.GetAll = function(callback){
            db.all("select * from sleep",callback);
        }

        this.Save = function(sleep,callback){
            db.serialize(function(){
                var statement = db.prepare("insert into sleep (datetime, eventOrder, event, timeStamp) values (?,?,?,?)");
                statement.run(sleep.datetime, GetEventId(), sleep.event, moment().format('YYYY-MM-DD HH:MM:SS.SSS'));
                statement.finalize();

                db.get("select id from sleep order by id desc limit 1", callback);
            });
        }
    }
};

module.exports.VitalsRepositories = VitalsRepositories;