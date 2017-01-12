var express = require('express')
var app = express()
var port = 9090;


app.get('/:inputId', function (req, res) {
        var inputId = req.params.inputId;
		var delay = inputId;
		if(inputId == 500){
			delay = 0;
		}
		
		function respond(){
			if(inputId == 500){
				res.status(500).send("A server side error has occurred");
			}
			else{
				res.send('You waited: ' + inputId + 'ms');
			}
        }
        setTimeout(respond, delay);
})

app.listen(port, function () {
  console.log('Delay server is running on port: ' + port);
})