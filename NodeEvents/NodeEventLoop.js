
function worker(group, id){
    return function(){
        console.log("" + group + ":" + id);
    }
}



(function(){
    console.log("IIFE: SetImmediate Example");
    setImmediate(
        function doStuff1(){
            console.log("doStuff2:1");
            setImmediate(worker(2,1));
            setImmediate(worker(2,2));
    });

    setImmediate(
        function doStuff2(){
            console.log("doStuff2:2");
            setImmediate(worker(2,3));
            setImmediate(worker(2,4));
    });

})();

(function(){
    console.log("IIFE: SetImmediate First");
    setImmediate(
        function doStuff1(){
            console.log("doStuff3:1");
            setImmediate(worker(3,1));
            setImmediate(worker(3,2));
    });

    process.nextTick(
        function doStuff2(){
            console.log("doStuff3:2");
            process.nextTick(worker(3,3));
            process.nextTick(worker(3,4));
    });

})();

(function(){
    console.log("IIFE: ImmIntervalNextTick");
    setImmediate(
        function doStuff1(){
            console.log("doStuff4:1");
            setImmediate(worker(4,1));
            setImmediate(worker(4,2));
    });
    
    var interval = setInterval(
        function doStuff2(){
            console.log("doStuff4:2");
            process.nextTick(worker(4,3));
            process.nextTick(worker(4,4));
            clearInterval(interval);
    },0);

    process.nextTick(
        function doStuff2(){
            console.log("doStuff4:2");
            process.nextTick(worker(4,5));
            process.nextTick(worker(4,6));
    });
})();

(function(){
    console.log("IIFE: Process Next Tick Example");                       
    process.nextTick(
        function doStuff1(){
            console.log("doStuff1:1");
            process.nextTick(worker(1,1));
            process.nextTick(worker(1,2));
    });

    process.nextTick(
        function doStuff2(){
            console.log("doStuff1:2");
            process.nextTick(worker(1,3));
            process.nextTick(worker(1,4));
    });

})();