function formatDate(date){
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();
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
            Cellify(formatDate(new Date(diaper.date))) +
            Cellify(diaper.data.time) + 
            Cellify(diaper.data.Wet) + 
            Cellify(diaper.data.Poop) + 
            Cellify(diaper.data.poopcolor)
        );
    }
    return result;
}

function ConvertFoodToRow(data){
    var result = "";
    for(i=0; i<data.length; i++){
        var food = data[i];
        result += Rowify(
            Cellify(formatDate(new Date(food.date))) +
            Cellify(food.data.time) + 
            Cellify(food.data.left) + 
            Cellify(food.data.right) + 
            Cellify(food.data.bottle)
        );
    }
    return result;
}

function ConvertAllToDetails(data){
    var result = "";
    for(i=0; i<data.length; i++){
        var any = data[i];
        var rowData = "";
        rowData += Cellify(formatDate(new Date(any.date)));
        rowData += Cellify(any.data.time);
        rowData += Cellify(any.recordType);
        if(any.recordType == 'food'){
            rowData += Cellify(
                (any.data.left != '' ? 'Left: ' + any.data.left : '') +
                (any.data.right != '' ? ' Right: ' + any.data.right : '') +
                (any.data.bottle != '' ? ' Bottle: ' + any.data.bottle + " oz. [" + any.data.bottletype+"]" : '')
            );
        }
        else if(any.recordType == 'diaper'){
            rowData += Cellify(
                (any.data.Wet ? '[Wet]' : '') +
                (any.data.Poop ? (any.data.poopcolor != '' ? '[' + any.data.poopcolor + ' poop]': '[poop]') : '')
            );
        }
        else if(any.recordType == 'sleep'){
            rowData += Cellify(
                any.data.sleeptype == 'wake' ? 'Woke up' : 'Fell asleep'
            );
        }
        result += Rowify(rowData);
    }
    return result;
}

$(document).ready(function(){
    /*
    $.ajax({
        url: 'http://192.168.1.7:8070/report/diaper',
        success: function(result){
            var diapers = JSON.parse(result);
            var tableRows = ConvertDiapersToRow(diapers);
            $('#diaperTable > tbody').append(tableRows);
        }
    });

    $.ajax({
        url: 'http://192.168.1.7:8070/report/food',
        success: function(result){
            var food = JSON.parse(result);
            var tableRows = ConvertFoodToRow(food);
            $('#foodTable > tbody').append(tableRows);
        }
    });
*/
    $.ajax({
        url: '/fullreport/teddy',
        success: function(result){
            var allrecords = JSON.parse(result);
            var sorted = allrecords.sort(function(a,b){
                return a.id - b.id;
            });

            var tableRows = ConvertAllToDetails(sorted);
            $('#masterTable > tbody').append(tableRows);
        }
    });
});