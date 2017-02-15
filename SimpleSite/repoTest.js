var vitals = require('./vitalsService');
var Service = new vitals.VitalsService('vitals.sqlite');

Service.Search(['diaper','food'],'2000-01-01 00:00:00.000','2020-01-01 00:00:00.000',function(results){
    for(i=0; i<results.length; i++){
        console.log(results[i]);
    }
});