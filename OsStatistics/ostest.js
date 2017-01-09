var os = require('os');

var toMB = function(f)
{
	return(Math.round((f/1024/1024)*100)/100);
}

console.log('Host: ' + os.hostname());
console.log('15 Minute Load Avg.: ' + os.loadavg()[2]);
console.log(toMB(os.freemem()) + ' of ' + toMB(os.totalmem()) + ' Mb free');
