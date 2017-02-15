var sqlite3 = require('sqlite3').verbose();
var moment = require('moment');
var models = require('./models');
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
            db.run('CREATE TABLE memo(id integer primary key not null, datetime text not null, memo text, timeStamp text not null)');
        });
        return db;
    }
}

function VitalsService(dbpath){
    this.db = CreateDatabase(dbpath);
}

VitalsService.prototype.Save = function(type, entity, callback){
    if(type == 'diaper'){
        SaveDiaper(this.db, models.ConvertToDiaperModel(entity), callback);
    }else if(type == 'food'){
        SaveFood(this.db, models.ConvertToFoodModel(entity), callback);
    }else if(type == 'sleep'){
        SaveSleep(this.db, models.ConvertToSleepModel(entity), callback);
    }else if(type == 'memo'){
        SaveMemo(this.db, models.ConvertToMemoModel(entity), callback);
    }
}

VitalsService.prototype.Search = function(types, startDate, endDate, callback){
    var promises = [];
    for(i=0; i < types.length; i++){
        promises.push(SearchEvents(this.db,types[i], startDate, endDate)); 
    }
    Promise.all(promises).then(values => {
        results = [];
        for(i=0; i<values.length; i++){
            results = results.concat(values[i]);
        }
        callback(results);
    })
}

function SearchEvents(db, type, startDate, endDate){
    var promise = new Promise(function(resolve,reject){
        db.all("select * from " + type + " where datetime between ? and ?", startDate, endDate, function(err,rows){
            if(err){
                reject(err)
            }else{
                resolve(ConvertRowsToEvents(type,rows));
            }
        });
    });
    return promise;
}


/* =============  UTILITY METHODS =============*/

function ConvertRowsToEvents(type, rows){
    switch(type){
        case 'diaper':
            return DiapersToEvents(rows);
        case 'food':
            return FoodToEvents(rows);
        case 'sleep':
            return SleepToEvents(rows);
        case 'memo':
            return MemoToEvents(rows);
    }
}

function DiapersToEvents(diapers){
    var events = [];
    for(i=0; i<diapers.length; i++){
        var row = diapers[i];
        events.push({
            id: row.id,
            datetime: row.datetime,
            event: models.ConvertDiaperToEvent(row)
        });
    }
    return events;
}

function FoodToEvents(foods){
    var events = [];
    for(k=0; k<foods.length; k++){
        var food = foods[k];
        events.push({
            id: food.id,
            datetime: food.datetime,
            event: models.ConvertFoodToEvent(food)
        });
    }
    return events;
}

function MemoToEvents(memos){
    var events = [];
    for(h = 0; h < memos.length; h++){
        var memo = memos[h];
        events.push({
            id: memo.id,
            datetime: memo.datetime,
            event: memo.memo
        });
    }
    return events;
}

function SleepToEvents(sleeps){
    var events = [];
    for(j=0; j < sleeps.length; j++){
        var sleep = sleeps[j];
        events.push(sleep);
    }
    return events;
}

function SaveDiaper(db, diaper, callback){
    db.serialize(function(){    
        var statement = db.prepare("insert into diaper (datetime, isWet, isDirty, poopColor, timeStamp) values (?,?,?,?,?)");
        statement.run(diaper.datetime, diaper.isWet, diaper.isDirty, diaper.poopColor, moment().format('YYYY-MM-DD HH:MM:SS.SSS'));
        statement.finalize();

        db.get("select id from diaper order by id desc limit 1", callback);
    });
}

function SaveFood(db, food, callback){
    db.serialize(function(){
        var statement = db.prepare("insert into food (datetime, left, right, bottle, bottleType, timeStamp) values (?,?,?,?,?,?)");
        statement.run(food.datetime, food.left, food.right, food.bottle, food.bottleType, moment().format('YYYY-MM-DD HH:MM:SS.SSS'));
        statement.finalize();

        db.get("select id from food order by id desc limit 1", callback);
    });
}

function SaveSleep(db, sleep, callback){
    db.serialize(function(){
        var statement = db.prepare("insert into sleep (datetime, event, timeStamp) values (?,?,?)");
        statement.run(sleep.datetime, sleep.event, moment().format('YYYY-MM-DD HH:MM:SS.SSS'));
        statement.finalize();

        db.get("select id from sleep order by id desc limit 1", callback);
    });
}

function SaveMemo(db, memo, callback){
    db.serialize(function(){
        var statement = db.prepare("insert into memo (datetime, memo, timeStamp) values (?,?,?)");
        statement.run(memo.datetime, memo.memo, moment().format('YYYY-MM-DD HH:MM:SS.SSS'));
        statement.finalize(); 

        db.get("select id from memo order by id desc limit 1", callback);
    })
} 

module.exports.VitalsService = VitalsService;