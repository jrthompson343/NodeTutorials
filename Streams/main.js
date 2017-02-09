var request = require('request');
var fs = require('fs');

//request('http://www.google.com').pipe(process.stdout);

stream = request('http://www.google.com');
stream.on('data',function(chunk){
    console.log(chunk);
});