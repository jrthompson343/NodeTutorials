var fileSystem = require('fs');
var fd = fileSystem.openSync("F:\\projects\\develop\\NodeTutorials\\FileSystem\\testdata.txt","r");

var testData = JSON.stringify({"test":"value","object":{"elm1":"val1","elm2":"val2"}});
var buffer = Buffer.from(testData);
console.log('String length: ' + testData.length);
console.log('Buffer Contents: ' + buffer.toString());
console.log('Buffer Size: ' + buffer.byteLength);





function slice(start, end) {
    const chunkSize = end - start;
    const buffer = new Buffer(10);

    fileSystem.readSync(fd, buffer, 0, start, end);

    return buffer;
}

function close() {
    fileSystem.close(fd);
}

var data = slice(5,3);
console.log(data.toString());

