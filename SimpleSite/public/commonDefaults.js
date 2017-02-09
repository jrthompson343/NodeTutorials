function GetCurrentTimeAsString(){
    var datetime = new Date();
    var hours = datetime.getHours() < 10 ? '0' + datetime.getHours() : '' + datetime.getHours();
    var minutes = datetime.getMinutes() < 10 ? '0' + datetime.getMinutes() : '' + datetime.getMinutes();
    return hours + ":" + minutes;
}


$(document).ready(function(){
    var timeInput = document.getElementById('time');
    timeInput.value = GetCurrentTimeAsString();
});