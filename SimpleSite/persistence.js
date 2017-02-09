var fs = require('fs');
var path = require('path');

function SimplePersistence(rootDirectory){
    var dir = rootDirectory;
    this.SaveEntry = function(recordType, obj, callback){
        var filePath = path.join(dir,recordType + ".data");
        
        var exists = fs.existsSync(filePath);

        var entry = {
            date: new Date(),
            data: obj
        };
        var writeable = JSON.stringify(entry) + "\r\n";
        if(exists){
            writeable = "," + writeable;
        }

        fs.appendFile(filePath, writeable, callback);
    },
    this.LoadRecords = function(recordType, callback){
        fs.readFile(path.join(dir,recordType + ".data"),'utf8', callback);
    }
};


module.exports.SimplePersistence = SimplePersistence;