
function analyzeResistance(
    windingA,
    windingB,
    windingC,

    insulationPhasePhase,
    insulationU,
    insulationV,
    insulationW
){

    // =========================================
    // Winding Resistance
    // =========================================

    const avg =
        (windingA + windingB + windingC) / 3;

    const imbalance =
        Math.max(
            Math.abs(windingA - avg),
            Math.abs(windingB - avg),
            Math.abs(windingC - avg)
        ) / avg * 100;

    let windingStatus = "Normal";

    if (imbalance >= 5) {

        windingStatus = "Critique";

    }
    else if (imbalance >= 2) {

        windingStatus = "Avertissement";

    }

    // =========================================
    // Phase-to-Phase Insulation
    // =========================================

    let insulationPhasePhaseStatus = "Excellent";

    if (insulationPhasePhase < 1) {

        insulationPhasePhaseStatus = "Critique";

    }
    else if (insulationPhasePhase < 10) {

        insulationPhasePhaseStatus = "Mauvais";

    }
    else if (insulationPhasePhase < 50) {

        insulationPhasePhaseStatus = "Acceptable";

    }

    // =========================================
    // Phase-to-Mass Insulation
    // =========================================

    const insulationAverage =
        (insulationU + insulationV + insulationW) / 3;

    let insulationPhaseMassStatus = "Excellent";

    if (insulationAverage < 1) {

        insulationPhaseMassStatus = "Critique";

    }
    else if (insulationAverage < 10) {

        insulationPhaseMassStatus = "Mauvais";

    }
    else if (insulationAverage < 50) {

        insulationPhaseMassStatus = "Acceptable";

    }

    // =========================================
    // Electrical Diagnosis
    // =========================================

    let diagnosis = "Enroulements en bon état.";

    if (

        windingStatus === "Critique" ||

        insulationPhasePhaseStatus === "Critique" ||

        insulationPhaseMassStatus === "Critique"

    ) {

        diagnosis = "Défaillance probable des enroulements du moteur.";

    }
    else if (

        windingStatus === "Avertissement" ||

        insulationPhasePhaseStatus === "Mauvais" ||

        insulationPhaseMassStatus === "Mauvais"

    ) {

        diagnosis = "Dégradation électrique détectée.";

    }

    // =========================================
    // Return Results
    // =========================================

    return {

        average: Number(avg.toFixed(3)),

        imbalance: Number(imbalance.toFixed(2)),

        windingStatus,

        insulationPhasePhase,

        insulationAverage: Number(insulationAverage.toFixed(2)),

        insulationPhasePhaseStatus,

        insulationPhaseMassStatus,

        diagnosis

    };

}

module.exports = analyzeResistance;