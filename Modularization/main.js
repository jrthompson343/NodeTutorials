var evenDoubler = require('./evenDoubler');

var processResults = function(err, results, time){
  if(err){
    console.log("Error: " + err.message);
  } else {
    console.log("The results are: " + results + " (" + time + " ms)");
  }
}

for(var i = 0; i < 10; i++){
  console.log("Calling: 'evenDoubler' with parameter: " + i);
  evenDoubler.evenDoubler(i,processResults);
}
