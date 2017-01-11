var Resource = require('./EventModule');

var r = new Resource(7);

r.on('start', function() {
	console.log("started");
});

r.on('data', function(d) {
	console.log(" data: " + d);
});

r.on('end', function(t) {
	console.log("done: " + t + " events.");
});
