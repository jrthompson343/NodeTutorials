var sqlite3 = require('sqlite3').verbose();
var moment = require('moment');
var fs = require('fs');

function CreateDatabase(databaseName){
    if(fs.existsSync(databaseName)){
        return new sqlite3.Database(databaseName);
    }else{
        var db = new sqlite3.Database(databaseName);
        db.serialize(function(){
            db.run('CREATE TABLE diaper (id integer primary key not null, datetime text not null, isWet integer not null, isDirty integer not null, poopColor not null, timeStamp text not null)');
            db.run('CREATE TABLE food (id integer primary key not null, datetime text not null, left integer, right integer, bottle integer, bottleType text, timeStamp text not null)');
            db.run('CREATE TABLE sleep(id integer primary key not null, datetime text not null, event text, timeStamp text not null)');
        });
        return db;
    }
}

function VitalsRepositories(databaseName){
    var db = CreateDatabase(databaseName);
        
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
                var statement = db.prepare("insert into diaper (datetime, isWet, isDirty, poopColor, timeStamp) values (?,?,?,?,?)");
                statement.run(diaper.datetime, diaper.isWet, diaper.isDirty, diaper.poopColor, moment().format('YYYY-MM-DD HH:MM:SS.SSS'));
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
                var statement = db.prepare("insert into food (datetime, left, right, bottle, bottleType, timeStamp) values (?,?,?,?,?,?)");
                statement.run(food.datetime, food.left, food.right, food.bottle, food.bottleType, moment().format('YYYY-MM-DD HH:MM:SS.SSS'));
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
                var statement = db.prepare("insert into sleep (datetime, event, timeStamp) values (?,?,?)");
                statement.run(sleep.datetime, sleep.event, moment().format('YYYY-MM-DD HH:MM:SS.SSS'));
                statement.finalize();

                db.get("select id from sleep order by id desc limit 1", callback);
            });
        }
    }
};

module.exports.VitalsRepositories = VitalsRepositories;