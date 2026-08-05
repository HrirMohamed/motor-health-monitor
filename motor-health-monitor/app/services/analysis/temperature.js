const config = require("../../config/motorConfig.json");
const { average, maximum } = require("./helpers");

function analyzeTemperature(samples){

    const avg = average(samples);

    const max = maximum(samples);

    let status = "Normal";

    if(max >= config.temperature.critical){

        status = "Critique";

    }
    else if(max >= config.temperature.high){

        status = "Élevée";

    }
    else if(max >= config.temperature.warning){

        status = "Avertissement";

    }

    return{

        average: Number(avg.toFixed(2)),

        maximum: max,

        status

    };

}

module.exports = analyzeTemperature;