const analyzeTemperature = require("./analysis/temperature");
const analyzeVibration = require("./analysis/vibration");
const analyzeCurrent = require("./analysis/current");
const analyzeResistance = require("./analysis/resistance");
const analyzeSpeed = require("./analysis/speed");
const createDiagnosis = require("./analysis/diagnosis");

function analyzeMotor(data){

    const temperature = analyzeTemperature(data.temperatures);

    const vibration = analyzeVibration(data.vibrations);

    const current = analyzeCurrent(
        data.phaseA,
        data.phaseB,
        data.phaseC,
        data.ratedCurrent
    );

    const resistance = analyzeResistance(
        data.resistanceA,
        data.resistanceB,
        data.resistanceC,

        data.insulationPhasePhase,
        data.insulationU,
        data.insulationV,
        data.insulationW
    );

    const speed = analyzeSpeed(data.speeds);

    const result = createDiagnosis(
        temperature,
        vibration,
        current,
        speed,
        resistance
    );

    return {

        temperature,
        vibration,
        current,
        resistance,
        speed,

        rule: result.rule,
        diagnosis: result.diagnosis,
        recommendation: result.recommendation

    };

}

module.exports = {
    analyzeMotor
};