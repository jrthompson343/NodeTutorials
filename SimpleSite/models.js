var moment = require('moment');




function formatViewDate(date, time){
    return date + " " + time;
}

function ConvertDiaperToEvent(diaper){
    var result = '';
    if(diaper.isWet == 1){
        result += '[Wet]'
    }
    if(diaper.isDirty == 1 && diaper.poopColor != ''){
        result += '[' + diaper.poopColor + ' Poop]'; 
    }else if(diaper.isDirty){
        result += '[Poop]';
    }
    return result;
}

function ConvertFoodToEvent(food){
    var result = '';
    if(food.left){
        result += '[Left: ' + food.left + ' min.]';
    }
    if(food.right){
        result += '[Right:' + food.right + ' min.]';
    }
    if(food.bottle){
        result += '[' + food.bottle + ' oz. of ' + food.bottleType + ']';
    }
    return result;
}

function ConvertToDiaperModel(viewModel){
    return {
        datetime: formatViewDate(viewModel.date, viewModel.time),
        isWet: viewModel['Wet'] ? 1 : 0,
        isDirty: viewModel['Poop'] ? 1 : 0,
        poopColor: viewModel.poopColor
    };
}

function ConvertToSleepModel(viewModel){
    return{
        datetime: formatViewDate(viewModel.date, viewModel.time),
        event: viewModel.sleeptype
    };
}

function ConvertToFoodModel(viewModel){
    return{
        datetime: formatViewDate(viewModel.date, viewModel.time),
        left: viewModel.left,
        right: viewModel.right,
        bottle: viewModel.bottle,
        bottleType: viewModel.bottle ? viewModel.bottletype : ''
    };
}

module.exports.ConvertToDiaperModel = ConvertToDiaperModel;
module.exports.ConvertToFoodModel = ConvertToFoodModel;
module.exports.ConvertToSleepModel = ConvertToSleepModel;
module.exports.ConvertDiaperToEvent = ConvertDiaperToEvent;
module.exports.ConvertFoodToEvent = ConvertFoodToEvent;