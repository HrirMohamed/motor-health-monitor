
function analyzeCurrent(A, B, C, ratedCurrent) {

    const minCurrent = ratedCurrent / 3;
    const maxCurrent = (2 * ratedCurrent) / 3;

    function getStatus(current) {

        if (current < minCurrent)
            return "faible";

        if (current > maxCurrent)
            return "élevée";

        return "Normal";
    }

    const phaseAStatus = getStatus(A);
    const phaseBStatus = getStatus(B);
    const phaseCStatus = getStatus(C);

    let overallStatus = "Normal";

    if (
        phaseAStatus !== "Normal" ||
        phaseBStatus !== "Normal" ||
        phaseCStatus !== "Normal"
    ) {
        overallStatus = "Warning";
    }

    return {

        phaseA: A,
        phaseB: B,
        phaseC: C,

        minReference: Number(minCurrent.toFixed(2)),
        maxReference: Number(maxCurrent.toFixed(2)),

        phaseAStatus,
        phaseBStatus,
        phaseCStatus,

        status: overallStatus

    };

}

module.exports=analyzeCurrent;