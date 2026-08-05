
const { average, maximum } = require("./helpers");

function analyzeSpeed(samples){

    const avg = average(samples);

    const max = maximum(samples);

    const min = samples.length ? Math.min(...samples) : 0;

    let variation = 0;

    if(avg > 0){

        variation = ((max - min) / avg) * 100;

    }

    let status = "Normal";

    let diagnosis = "La vitesse du moteur est stable.";

    if(avg < 100){

        status = "Arrêté";
        diagnosis = "Le moteur ne tourne pas.";

    }
    else if(variation > 5){

        status = "Critique";
        diagnosis = "Importante fluctuation de la vitesse (RPM) détectée.";

    }
    else if(variation > 2){

        status = "Avertissement";
        diagnosis = "Légère fluctuation de la vitesse (RPM) détectée.";

    }

    return{

        average: Number(avg.toFixed(0)),

        minimum: min,

        maximum: max,

        variation: Number(variation.toFixed(2)),

        status,

        diagnosis

    };

}

module.exports = analyzeSpeed;