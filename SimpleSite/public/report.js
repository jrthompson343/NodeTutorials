function convertTimeToAMPM(time){
    //time is in hh:mm
    var timeComps = time.split(':');
    result = '';
    if(timeComps.length != 2){
        result = 'undefined';
    }
    else{
        var hour = Number(timeComps[0]);
        if(hour < 12 && hour < 10){
            if(hour != 0){
                result = '0' + hour + ':' + timeComps[1] + ' AM';
            }else{
                result = '12:' + timeComps[1] + ' AM';
            }
        }else if(hour < 12 && hour >= 10){
            result = hour + ':' + timeComps[1] + ' AM';
        }else if(hour == 12){
            result = '12:' + timeComps[1] + ' PM';
        }else if(hour >= 12){
            var wrapped = (hour - 12);
            result = wrapped + ':' + timeComps[1] + ' PM';
            if(wrapped < 10){
                result = '0' + result;
            }
        }
    }
    return result;
}

function formatDateTime(datetime){
    //time comes back from server as string yyyy-mm-dd hh:mm
    var datetimeComps = datetime.split(' ');
    if(datetimeComps.length != 2){
        return 'undefined'
    }else{
        var dateComps = datetimeComps[0].split('-');
        
        var month = dateComps[1];
        var day = dateComps[2];
        var year = dateComps[0];
        var time = convertTimeToAMPM(datetimeComps[1]);

        return month + '/' + day + '/' + year + '  ' + time;
    }


}

function Rowify(string){
    return "<tr>" + string + "</tr>";
}

function Cellify(element){
    return "<td>" + element + "</td>";
}

function ConvertAllToDetails(data){
    var result = "";
    for(i=0; i < data.length; i++){
        var datum = data[i];
        var rowData = "";
        rowData += Cellify(datum.id);
        rowData += Cellify(formatDateTime(datum.datetime));
        rowData += Cellify(datum.event);
        result += Rowify(rowData);

    }
    return result;
}

$(document).ready(function(){
    $.ajax({
        url: '/events',
        success: function(result){
            var sorted = result.sort(function(a,b){
                return new Date(b.datetime) - new Date(a.datetime);
            });

            var tableRows = ConvertAllToDetails(sorted);
            $('#masterTable > tbody').append(tableRows);
        }
    })
});