const config = require("../../config/motorConfig.json");
const { average, maximum } = require("./helpers");

function analyzeVibration(samples){

    const avg = average(samples);

    const max = maximum(samples);

    let status = "Normal";

    if(max >= config.vibration.critical){

        status = "Critique";

    }
    else if(max >= config.vibration.high){

        status = "Élevée";

    }
    else if(max >= config.vibration.warning){

        status = "Avertissement";

    }

    return{

        average: Number(avg.toFixed(2)),

        maximum: max,

        status

    };

}

module.exports = analyzeVibration;