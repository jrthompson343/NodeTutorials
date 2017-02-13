var moment = require('moment');

console.log('Starting repo test');
var vitalsModule = require('./repository');
var vitalsRepo = new vitalsModule.VitalsRepositories('C:/sqliteDbs/vitals.sqlite');

var personRepo = new vitalsRepo.personRepo();

personRepo.FindById(1, function(err,row){
    console.log("Entry: " + row.fname + " " + row.lname);
});

var person = {
    lname: 'gertrude',
    fname: 'hawk'
};
personRepo.Save(person,function(err,row){
    console.log('Person saved with id: ' + row.id);
});

var diaperRepo = new vitalsRepo.diaperRepo();

var diaper = {
    datetime: moment().format("YYYY-MM-DD HH:MM:SS.SSS"),
    isWet: 1,
    isDirty: 1,
    poopColor: 'brown' 
}

diaperRepo.Save(diaper,function(err, row){
    console.log('Diaper saved with id: ' + row.id);
});

diaperRepo.DiapersByDateRange('2000-01-01','2020-01-01', function(err, allRows){
    console.log(allRows);
});
