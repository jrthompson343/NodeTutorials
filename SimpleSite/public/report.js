function formatDate(date){
    var month = date.getMonth() + 1;
    var day = date.getDay();
    var year = date.getYear();
    return "" + month + "/" + day + "/" + year;
}

function Rowify(string){
    return "<tr>" + string + "</tr>";
}

function Cellify(element){
    return "<td>" + element + "</td>";
}

function ConvertDiapersToRow(data){
    var result = "";
    for(i=0; i<data.length; i++){
        var diaper = data[i];
        result += Rowify(
            Cellify(formatDate(new Date(diaper.date)) +
            Cellify(diaper.data.time) + 
            Cellify(diaper.data.Wet) + 
            Cellify(diaper.data.Poop) + 
            Cellify(diaper.data.poopcolor)
        );
    }
    return result;
}

$(document).ready(function(){
    $.ajax({
        url: 'http://localhost:8070/reportdata',
        success: function(result){
            var diapers = JSON.parse(result);
            var tableRows = ConvertDiapersToRow(diapers);
            $('#diaperTable > tbody').append(tableRows);
        }
    })
});