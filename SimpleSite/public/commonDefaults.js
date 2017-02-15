function GetCurrentTimeAsString(){
    var datetime = new Date();
    var hours = datetime.getHours() < 10 ? '0' + datetime.getHours() : '' + datetime.getHours();
    var minutes = datetime.getMinutes() < 10 ? '0' + datetime.getMinutes() : '' + datetime.getMinutes();
    return hours + ":" + minutes;
}


$(document).ready(function(){
//    alert(new Date());
    var timeInput = document.getElementById('time');
    timeInput.value = GetCurrentTimeAsString();

    var d = new Date();
    d.setHours(d.getHours() - 5);
    var dateInput = document.getElementById('date');
    dateInput.valueAsDate = d;
});
