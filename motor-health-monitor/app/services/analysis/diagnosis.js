
function createDiagnosis(
    temperature,
    vibration,
    current,
    speed,
    resistance
) {

    let diagnosis = "Moteur en bon état";
    let recommendation = "Poursuivre le fonctionnement normal.";
    let rule = "Normal";

    if (
        temperature.status !== "Normal" ||
        vibration.status !== "Normal" ||
        current.status !== "Normal" ||
        resistance.windingStatus !== "Normal" ||
        resistance.insulationPhasePhaseStatus !== "Excellent" && resistance.insulationPhasePhaseStatus !== "Acceptable" ||
        resistance.insulationPhaseMassStatus !== "Excellent" && resistance.insulationPhaseMassStatus !== "Acceptable"
    ) {

        diagnosis = "Condition anormale détectée.";
        recommendation = "Inspecter le moteur avant sa remise en service.";
        rule = "Avertissement";

    }

    return {

        rule,
        diagnosis,
        recommendation

    };

}

module.exports = createDiagnosis;