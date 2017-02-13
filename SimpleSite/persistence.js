var fs = require('fs');
var path = require('path');

function SimplePersistence(rootDirectory){
    var dir = rootDirectory;
    var id = 0;


    this.SaveEntry = function(recType, obj, callback){
        var filePath = path.join(dir,recType + ".data");
        
        var exists = fs.existsSync(filePath);

        var entry = {
            id: GetNextId(),
            date: new Date(),
            recordType: recType, 
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
    this.LoadRecordsSync = function(recordTypes){
        var result = "";
        var firstPass = true;
        for(i=0; i<recordTypes.length; i++){
            if(fs.existsSync(path.join(dir,recordTypes[i] + ".data"))){
                var data = fs.readFileSync(path.join(dir,recordTypes[i] + ".data"),'utf8')
                if(firstPass){
                    result += data;
                    firstPass = false;
                }else{
                    result += "," + data;
                }
            }
        }
        return result;
    }
};


module.exports.SimplePersistence = SimplePersistence;