// // ==========================================
// // Acquisition Data & State
// // ==========================================
// let temperatureSamples = [];
// let vibrationSamples = [];
// let speedSamples = [];

// const ACQUISITION_TIME = 60;
// let acquisitionStarted = false;
// let acquisitionSeconds = 0;
// let acquisitionTimer = null;
// let currentMotor = null;
// let analysisResult = null;

// // ==========================================
// // DOM Elements
// // ==========================================

// const progressFill = document.getElementById("progressFill");
// const progressTime = document.getElementById("progressTime");
// const progressPercent = document.getElementById("progressPercent");
// const startAcquisitionBtn = document.getElementById("startAcquisition");
// // Start button disabled until motor is loaded
// if (startAcquisitionBtn) {
//     startAcquisitionBtn.disabled = true;
// }
// const analyzeButton = document.getElementById("analyzeMotor");
// const historyButton = document.getElementById("historyButton");
// const saveButton = document.getElementById("saveInspection");

// const params = new URLSearchParams(window.location.search);

// const inspectionId = params.get("id");

// // ==========================================
// // Progress Bar Helpers
// // ==========================================
// function startProgress() {
//     if (acquisitionTimer) {
//         clearInterval(acquisitionTimer);
//     }

//     acquisitionStarted = true;
//     acquisitionSeconds = 0;

//     progressFill.style.width = "0%";
//     progressPercent.textContent = "0%";
//     progressTime.textContent = `0 / ${ACQUISITION_TIME} s`;

//     if (startAcquisitionBtn) startAcquisitionBtn.disabled = true;

//     acquisitionTimer = setInterval(() => {
//         acquisitionSeconds++;

//         const percent = (acquisitionSeconds / ACQUISITION_TIME) * 100;
//         progressFill.style.width = percent + "%";
//         progressPercent.textContent = Math.round(percent) + "%";
//         progressTime.textContent = `${acquisitionSeconds} / ${ACQUISITION_TIME} s`;

//         if (acquisitionSeconds >= ACQUISITION_TIME) {
//             stopProgress();
//         }
//     }, 1000);
// }

// function stopProgress() {

//     console.log("========== STOP PROGRESS ==========");

//     acquisitionStarted = false;

//     if (acquisitionTimer) {
//         clearInterval(acquisitionTimer);
//         acquisitionTimer = null;
//     }

//     progressFill.style.width = "100%";
//     progressPercent.textContent = "100%";
//     progressTime.textContent = `${ACQUISITION_TIME} / ${ACQUISITION_TIME} s`;

//     if (startAcquisitionBtn)
//         startAcquisitionBtn.disabled = false;


// }

// // ==========================================
// // Load Current Motor Information
// // ==========================================
// async function loadMotor() {
//     const motorDatabaseID = sessionStorage.getItem("motorDatabaseID");

//     if (!motorDatabaseID) {
//         document.getElementById("summaryName").textContent = "No motor selected";
//         return;
//     }

//     try {
//         const motor = await window.electronAPI.getMotor(motorDatabaseID);
//         currentMotor = motor;

//         if (!motor) {
//             document.getElementById("summaryName").textContent = "Motor not found";
//             return;
//         }

//         document.getElementById("summaryID").textContent = motor.motor_id;
//         document.getElementById("summaryName").textContent = motor.name;
//         document.getElementById("summaryVoltage").textContent = motor.voltage + " V";
//         document.getElementById("summaryPower").textContent = motor.power + " kW";
//         document.getElementById("summaryCurrent").textContent = motor.rated_current + " A";
//         document.getElementById("summaryType").textContent = motor.motor_type;
//         document.getElementById("summaryPoles").textContent = motor.poles;
//         // Enable Start Acquisition button.
// // The technician can now measure resistance and later
// // press Start Acquisition when the motor is running.
// if (startAcquisitionBtn) {
//     startAcquisitionBtn.disabled = false;
// }
//     } catch (err) {
//         console.error(err);
//         alert("Unable to load motor information.");
//     }
// }

// loadMotor();

// // ==========================================
// // Start Button Click Listener
// // ==========================================
// if (startAcquisitionBtn) {
//     startAcquisitionBtn.addEventListener("click",async () => {
//         const resistanceA = Number(document.getElementById("resistanceA").value);
// const resistanceB = Number(document.getElementById("resistanceB").value);
// const resistanceC = Number(document.getElementById("resistanceC").value);

// const insulationU = Number(document.getElementById("insulationU").value);
// const insulationV = Number(document.getElementById("insulationV").value);
// const insulationW = Number(document.getElementById("insulationW").value);

// if (
//     !resistanceA ||
//     !resistanceB ||
//     !resistanceC ||
//     !insulationU ||
//     !insulationV ||
//     !insulationW
// ) {
//     alert("Please enter all resistance measurements before starting the acquisition.");
//     return;
// }

// startAcquisitionBtn.disabled = true;

// document.getElementById("resistanceA").disabled = true;
// document.getElementById("resistanceB").disabled = true;
// document.getElementById("resistanceC").disabled = true;

// document.getElementById("insulationU").disabled = true;
// document.getElementById("insulationV").disabled = true;
// document.getElementById("insulationW").disabled = true;

// document.getElementById("meggerVoltage").disabled = true;
//         // Reset sample buffers
//         temperatureSamples = [];
//         vibrationSamples = [];
//         speedSamples = [];

//         // Notify hardware / microcontroller to start sending reading data
//         if (window.electronAPI.sendUART) {
//             window.electronAPI.sendUART("START");
//         } else {
//             // Fallback: Trigger UI progress manually if direct send isn't defined
//             startProgress();
//         }
//     });
// }

// // ==========================================
// // UART Incoming Data Stream
// // ==========================================
// window.electronAPI.onUARTData((message) => {
//     console.log("UART:", message);

//     const logContainer = document.getElementById("logContainer");

//     // Message Handlers
//     if (message === "CONNECTED") {
//         console.log("Arduino Connected");
//         return;
//     }

//     if (message === "STARTED") {
//         console.log("Acquisition Started");
//         startProgress();
//         if (logContainer) logContainer.innerHTML = "<p>Acquisition in progress...</p>";
//         return;
//     }

//     if (message === "DONE") {
//         console.log("Acquisition Finished");
//         stopProgress();

//         document.getElementById("phaseA").disabled = false;
//         document.getElementById("phaseB").disabled = false;
//         document.getElementById("phaseC").disabled = false;
//         if (analyzeButton) analyzeButton.disabled = false;

//         if (logContainer) logContainer.innerHTML = "<p>Acquisition Complete</p>";
//         return;
//     }

//     // Sensor Readings Handler (Format -> TYPE:VALUE)
//     const parts = message.split(":");
//     if (parts.length !== 2) return;

//     const type = parts[0].trim();
//     const value = parts[1].trim();

//     switch (type) {
//       case "TEMP": {

//     console.log("Raw TEMP:", value);

//     const temp = Number(value);

//     if (!Number.isFinite(temp)) {
//         console.error("Invalid temperature:", value);
//         break;
//     }

//     temperatureSamples.push(temp);

//     document.getElementById("temperatureValue").textContent =
//         temp.toFixed(1) + " °C";

//     break;
// }
//        case "VIB": {

//     console.log("Raw vibration value:", value);

//     const vib = Number(value);

//     console.log("Parsed vibration:", vib);

//     if (!Number.isFinite(vib)) {
//         console.error("Invalid vibration received:", value);
//         break;   // Don't store invalid data
//     }

//     vibrationSamples.push(vib);

//     document.getElementById("vibrationValue").textContent =
//         vib.toFixed(2) + " mm/s";

//     break;
// }
//         case "RPM": {
//     const rpm = Number(value);

//     speedSamples.push(rpm);

//     document.getElementById("speedValue").textContent =
//         Math.round(rpm) + " RPM";

//     break;
// }
//         default:
//             console.log("Unknown message type:", message);
//     }
// });

// // ==========================================
// // Navigation & Action Buttons
// // ==========================================
// if (historyButton) {
//     historyButton.addEventListener("click", () => {
//         window.location.href = "history.html";
//     });
// }

// if (analyzeButton) {
//     analyzeButton.addEventListener("click", async () => {
//         if (!currentMotor) {
//             alert("Motor information not loaded.");
//             return;
//         }

//  const inspectionData = {
//     temperatures: temperatureSamples,
//     vibrations: vibrationSamples,
//     speeds: speedSamples,

//     phaseA: Number(document.getElementById("phaseA").value),
//     phaseB: Number(document.getElementById("phaseB").value),
//     phaseC: Number(document.getElementById("phaseC").value),

//     resistanceA: Number(document.getElementById("resistanceA").value),
//     resistanceB: Number(document.getElementById("resistanceB").value),
//     resistanceC: Number(document.getElementById("resistanceC").value),


//     insulationPhasePhase:
//     Number(document.getElementById("insulationPhasePhase").value),
//     insulationU: Number(document.getElementById("insulationU").value),
//     insulationV: Number(document.getElementById("insulationV").value),
//     insulationW: Number(document.getElementById("insulationW").value),

//     meggerVoltage: Number(document.getElementById("meggerVoltage").value),

//     ratedCurrent: Number(currentMotor.rated_current)
// };

//         try {
//             const result = await window.electronAPI.analyzeMotor(inspectionData);
//             analysisResult = result;

//             document.getElementById("healthStatus").textContent = result.rule;
//             document.getElementById("faultName").textContent = result.diagnosis;
//             document.getElementById("recommendationText").textContent = result.recommendation;

//         document.getElementById("analysisDetails").innerHTML = `

//             <b>Temperature</b><br>
//             Average: ${result.temperature.average} °C<br>
//             Maximum: ${result.temperature.maximum} °C<br>
//             Status: ${result.temperature.status}<br><br>

//             <b>Vibration</b><br>
//             Average: ${result.vibration.average} mm/s<br>
//             Maximum: ${result.vibration.maximum} mm/s<br>
//             Status: ${result.vibration.status}<br><br>

//             <b>Speed (RPM)</b><br>
//             Average: ${result.speed.average} RPM<br>
//             Minimum: ${result.speed.minimum} RPM<br>
//             Maximum: ${result.speed.maximum} RPM<br>
//             Variation: ${result.speed.variation}%<br>
//             Status: ${result.speed.status}<br>
//             Diagnosis: ${result.speed.diagnosis}<br><br>

//             <b>Resistance</b><br>
//             Average: ${result.resistance.average} Ω<br>
//             Imbalance: ${result.resistance.imbalance}%<br>
//             Winding Status: ${result.resistance.windingStatus}<br>
//             Insulation Average: ${result.resistance.insulationAverage} MΩ<br>
//             Insulation Status: ${result.resistance.insulationStatus}<br>
//             Diagnosis: ${result.resistance.diagnosis}<br><br>

//            <b>Courant</b><br>
//             Phase A : ${result.current.phaseA} A (${result.current.phaseAStatus})<br>
//             Phase B : ${result.current.phaseB} A (${result.current.phaseBStatus})<br>
//             Phase C : ${result.current.phaseC} A (${result.current.phaseCStatus})<br>
//             Référence : ${result.current.minReference.toFixed(2)} A
//             à
//             ${result.current.maxReference.toFixed(2)} A<br>
//             État global : ${result.current.status}<br><br>

        

//             `;
//             const saveButton = document.getElementById("saveInspection");

// saveButton.disabled = false;
//         } catch (err) {
//             console.error(err);
//             alert(err);
//         }
//     });
// }

// // ==========================================
// // Disconnect Handler
// // ==========================================
// window.electronAPI.onDisconnect(() => {
//     alert("Communication lost.\n\nDevice disconnected.");
//     window.electronAPI.closeApp();
// });
// document.getElementById("saveInspection").addEventListener("click", async () => {

//     if (!analysisResult) {

//         alert("Please analyze the motor first.");
//         return;

//     }

//     const inspection = {

//         motor_id: currentMotor.id,

//         temperature: analysisResult.temperature,
//         vibration: analysisResult.vibration,
//         speed: analysisResult.speed,

//         phaseA: Number(document.getElementById("phaseA").value),
//         phaseB: Number(document.getElementById("phaseB").value),
//         phaseC: Number(document.getElementById("phaseC").value),

//         windingA: Number(document.getElementById("resistanceA").value),
//         windingB: Number(document.getElementById("resistanceB").value),
//         windingC: Number(document.getElementById("resistanceC").value),

//         insulationPhasePhase: Number(
//         document.getElementById("insulationPhasePhase").value
//         ),
//         insulationU: Number(document.getElementById("insulationU").value),
//         insulationV: Number(document.getElementById("insulationV").value),
//         insulationW: Number(document.getElementById("insulationW").value),

//         meggerVoltage: Number(document.getElementById("meggerVoltage").value),

//         phaseA_status: analysisResult.current.phaseAStatus,
//         phaseB_status: analysisResult.current.phaseBStatus,
//         phaseC_status: analysisResult.current.phaseCStatus,
//         temperature_status: analysisResult.temperature.status,
//         vibration_status: analysisResult.vibration.status,
//         resistance_status: analysisResult.resistance.windingStatus,
//         insulationPhasePhaseStatus:
//     analysisResult.resistance.insulationPhasePhaseStatus,

// insulationPhaseMassStatus:
//     analysisResult.resistance.insulationPhaseMassStatus,

//         diagnosis: analysisResult.diagnosis,
//         recommendation: analysisResult.recommendation,
//         health: analysisResult.rule

//     };

//     try{

//         const id = await window.electronAPI.saveInspection(inspection);

//         alert("Inspection saved successfully.\nInspection ID: " + id);

//     }
//     catch (err) {

//     console.error("SAVE ERROR:", err);

//     alert(
//         "Unable to save the inspection.\n\n" +
//         (err.message || JSON.stringify(err))
//     );

// }

// });

// ==========================================
// Acquisition Data & State
// ==========================================
let temperatureSamples = [];
let vibrationSamples = [];
let speedSamples = [];

const ACQUISITION_TIME = 60;
let acquisitionStarted = false;
let acquisitionSeconds = 0;
let acquisitionTimer = null;
let currentMotor = null;
let analysisResult = null;

// ==========================================
// DOM Elements
// ==========================================

const progressFill = document.getElementById("progressFill");
const progressTime = document.getElementById("progressTime");
const progressPercent = document.getElementById("progressPercent");
const startAcquisitionBtn = document.getElementById("startAcquisition");
// Start button disabled until motor is loaded
if (startAcquisitionBtn) {
    startAcquisitionBtn.disabled = true;
}
const analyzeButton = document.getElementById("analyzeMotor");
const historyButton = document.getElementById("historyButton");
const saveButton = document.getElementById("saveInspection");

// ==========================================
// Progress Bar Helpers
// ==========================================
function startProgress() {
    if (acquisitionTimer) {
        clearInterval(acquisitionTimer);
    }

    acquisitionStarted = true;
    acquisitionSeconds = 0;

    progressFill.style.width = "0%";
    progressPercent.textContent = "0%";
    progressTime.textContent = `0 / ${ACQUISITION_TIME} s`;

    if (startAcquisitionBtn) startAcquisitionBtn.disabled = true;

    acquisitionTimer = setInterval(() => {
        acquisitionSeconds++;

        const percent = (acquisitionSeconds / ACQUISITION_TIME) * 100;
        progressFill.style.width = percent + "%";
        progressPercent.textContent = Math.round(percent) + "%";
        progressTime.textContent = `${acquisitionSeconds} / ${ACQUISITION_TIME} s`;

        if (acquisitionSeconds >= ACQUISITION_TIME) {
            stopProgress();
        }
    }, 1000);
}

function stopProgress() {

    console.log("========== STOP PROGRESS ==========");

    acquisitionStarted = false;

    if (acquisitionTimer) {
        clearInterval(acquisitionTimer);
        acquisitionTimer = null;
    }

    progressFill.style.width = "100%";
    progressPercent.textContent = "100%";
    progressTime.textContent = `${ACQUISITION_TIME} / ${ACQUISITION_TIME} s`;

    if (startAcquisitionBtn)
        startAcquisitionBtn.disabled = false;


}

// ==========================================
// Load Current Motor Information
// ==========================================
async function loadMotor() {
    const motorDatabaseID = sessionStorage.getItem("motorDatabaseID");

    if (!motorDatabaseID) {
        document.getElementById("summaryName").textContent = "No motor selected";
        return;
    }

    try {
        const motor = await window.electronAPI.getMotor(motorDatabaseID);
        currentMotor = motor;

        if (!motor) {
            document.getElementById("summaryName").textContent = "Motor not found";
            return;
        }

        document.getElementById("summaryID").textContent = motor.motor_id;
        document.getElementById("summaryName").textContent = motor.name;
        document.getElementById("summaryVoltage").textContent = motor.voltage + " V";
        document.getElementById("summaryPower").textContent = motor.power + " kW";
        document.getElementById("summaryCurrent").textContent = motor.rated_current + " A";
        document.getElementById("summaryType").textContent = motor.motor_type;
        document.getElementById("summaryPoles").textContent = motor.poles;
        // Enable Start Acquisition button.
// The technician can now measure resistance and later
// press Start Acquisition when the motor is running.
if (startAcquisitionBtn) {
    startAcquisitionBtn.disabled = false;
}
    } catch (err) {
        console.error(err);
        alert("Unable to load motor information.");
    }
}

loadMotor();

// ==========================================
// Start Button Click Listener
// ==========================================
if (startAcquisitionBtn) {
    startAcquisitionBtn.addEventListener("click",async () => {
        const resistanceA = Number(document.getElementById("resistanceA").value);
const resistanceB = Number(document.getElementById("resistanceB").value);
const resistanceC = Number(document.getElementById("resistanceC").value);

const insulationU = Number(document.getElementById("insulationU").value);
const insulationV = Number(document.getElementById("insulationV").value);
const insulationW = Number(document.getElementById("insulationW").value);

if (
    !resistanceA ||
    !resistanceB ||
    !resistanceC ||
    !insulationU ||
    !insulationV ||
    !insulationW
) {
    alert("Please enter all resistance measurements before starting the acquisition.");
    return;
}

startAcquisitionBtn.disabled = true;

document.getElementById("resistanceA").disabled = true;
document.getElementById("resistanceB").disabled = true;
document.getElementById("resistanceC").disabled = true;

document.getElementById("insulationU").disabled = true;
document.getElementById("insulationV").disabled = true;
document.getElementById("insulationW").disabled = true;

document.getElementById("meggerVoltage").disabled = true;
        // Reset sample buffers
        temperatureSamples = [];
        vibrationSamples = [];
        speedSamples = [];

        // Notify hardware / microcontroller to start sending reading data
        if (window.electronAPI.sendUART) {
            window.electronAPI.sendUART("START");
        } else {
            // Fallback: Trigger UI progress manually if direct send isn't defined
            startProgress();
        }
    });
}

// ==========================================
// UART Incoming Data Stream
// ==========================================
window.electronAPI.onUARTData((message) => {
    console.log("UART:", message);

    const logContainer = document.getElementById("logContainer");

    // Message Handlers
    if (message === "CONNECTED") {
        console.log("Arduino Connected");
        return;
    }

    if (message === "STARTED") {
        console.log("Acquisition Started");
        startProgress();
        if (logContainer) logContainer.innerHTML = "<p>Acquisition in progress...</p>";
        return;
    }

    if (message === "DONE") {
        console.log("Acquisition Finished");
        stopProgress();

        document.getElementById("phaseA").disabled = false;
        document.getElementById("phaseB").disabled = false;
        document.getElementById("phaseC").disabled = false;
        if (analyzeButton) analyzeButton.disabled = false;

        if (logContainer) logContainer.innerHTML = "<p>Acquisition Complete</p>";
        return;
    }

    // Sensor Readings Handler (Format -> TYPE:VALUE)
    const parts = message.split(":");
    if (parts.length !== 2) return;

    const type = parts[0].trim();
    const value = parts[1].trim();

    switch (type) {
      case "TEMP": {

    console.log("Raw TEMP:", value);

    const temp = Number(value);

    if (!Number.isFinite(temp)) {
        console.error("Invalid temperature:", value);
        break;
    }

    temperatureSamples.push(temp);

    document.getElementById("temperatureValue").textContent =
        temp.toFixed(1) + " °C";

    break;
}
       case "VIB": {

    console.log("Raw vibration value:", value);

    const vib = Number(value);

    console.log("Parsed vibration:", vib);

    if (!Number.isFinite(vib)) {
        console.error("Invalid vibration received:", value);
        break;   // Don't store invalid data
    }

    vibrationSamples.push(vib);

    document.getElementById("vibrationValue").textContent =
        vib.toFixed(2) + " mm/s";

    break;
}
        case "RPM": {
    const rpm = Number(value);

    speedSamples.push(rpm);

    document.getElementById("speedValue").textContent =
        Math.round(rpm) + " RPM";

    break;
}
        default:
            console.log("Unknown message type:", message);
    }
});

// ==========================================
// Navigation & Action Buttons
// ==========================================
if (historyButton) {
    historyButton.addEventListener("click", () => {
        window.location.href = "history.html";
    });
}

if (analyzeButton) {
    analyzeButton.addEventListener("click", async () => {
        if (!currentMotor) {
            alert("Motor information not loaded.");
            return;
        }

 const inspectionData = {
    temperatures: temperatureSamples,
    vibrations: vibrationSamples,
    speeds: speedSamples,

    phaseA: Number(document.getElementById("phaseA").value),
    phaseB: Number(document.getElementById("phaseB").value),
    phaseC: Number(document.getElementById("phaseC").value),

    resistanceA: Number(document.getElementById("resistanceA").value),
    resistanceB: Number(document.getElementById("resistanceB").value),
    resistanceC: Number(document.getElementById("resistanceC").value),


    insulationPhasePhase:
    Number(document.getElementById("insulationPhasePhase").value),
    insulationU: Number(document.getElementById("insulationU").value),
    insulationV: Number(document.getElementById("insulationV").value),
    insulationW: Number(document.getElementById("insulationW").value),

    meggerVoltage: Number(document.getElementById("meggerVoltage").value),

    ratedCurrent: Number(currentMotor.rated_current)
};

        try {
            const result = await window.electronAPI.analyzeMotor(inspectionData);
            analysisResult = result;

            document.getElementById("healthStatus").textContent = result.rule;
            document.getElementById("faultName").textContent = result.diagnosis;
            document.getElementById("recommendationText").textContent = result.recommendation;

        document.getElementById("analysisDetails").innerHTML = `

            <b>Temperature</b><br>
            Average: ${result.temperature.average} °C<br>
            Maximum: ${result.temperature.maximum} °C<br>
            Status: ${result.temperature.status}<br><br>

            <b>Vibration</b><br>
            Average: ${result.vibration.average} mm/s<br>
            Maximum: ${result.vibration.maximum} mm/s<br>
            Status: ${result.vibration.status}<br><br>

            <b>Speed (RPM)</b><br>
            Average: ${result.speed.average} RPM<br>
            Minimum: ${result.speed.minimum} RPM<br>
            Maximum: ${result.speed.maximum} RPM<br>
            Variation: ${result.speed.variation}%<br>
            Status: ${result.speed.status}<br>
            Diagnosis: ${result.speed.diagnosis}<br><br>

            <b>Resistance</b><br>
            Average: ${result.resistance.average} Ω<br>
            Imbalance: ${result.resistance.imbalance}%<br>
            Winding Status: ${result.resistance.windingStatus}<br>
            Insulation Average: ${result.resistance.insulationAverage} MΩ<br>
            Insulation Status: ${result.resistance.insulationStatus}<br>
            Diagnosis: ${result.resistance.diagnosis}<br><br>

           <b>Courant</b><br>
            Phase A : ${result.current.phaseA} A (${result.current.phaseAStatus})<br>
            Phase B : ${result.current.phaseB} A (${result.current.phaseBStatus})<br>
            Phase C : ${result.current.phaseC} A (${result.current.phaseCStatus})<br>
            Référence : ${result.current.minReference.toFixed(2)} A
            à
            ${result.current.maxReference.toFixed(2)} A<br>
            État global : ${result.current.status}<br><br>

        

            `;

            saveButton.disabled = false;
        } catch (err) {
            console.error(err);
            alert(err);
        }
    });
}

// ==========================================
// Disconnect Handler
// ==========================================
window.electronAPI.onDisconnect(() => {
    alert("Communication lost.\n\nDevice disconnected.");
    window.electronAPI.closeApp();
});
document.getElementById("saveInspection").addEventListener("click", async () => {

    if (!analysisResult) {

        alert("Please analyze the motor first.");
        return;

    }

    const inspection = {

        motor_id: currentMotor.id,

        temperature: analysisResult.temperature,
        vibration: analysisResult.vibration,
        speed: analysisResult.speed,

        phaseA: Number(document.getElementById("phaseA").value),
        phaseB: Number(document.getElementById("phaseB").value),
        phaseC: Number(document.getElementById("phaseC").value),

        windingA: Number(document.getElementById("resistanceA").value),
        windingB: Number(document.getElementById("resistanceB").value),
        windingC: Number(document.getElementById("resistanceC").value),

        insulationPhasePhase: Number(
        document.getElementById("insulationPhasePhase").value
        ),
        insulationU: Number(document.getElementById("insulationU").value),
        insulationV: Number(document.getElementById("insulationV").value),
        insulationW: Number(document.getElementById("insulationW").value),

        meggerVoltage: Number(document.getElementById("meggerVoltage").value),

        phaseA_status: analysisResult.current.phaseAStatus,
        phaseB_status: analysisResult.current.phaseBStatus,
        phaseC_status: analysisResult.current.phaseCStatus,
        temperature_status: analysisResult.temperature.status,
        vibration_status: analysisResult.vibration.status,
        resistance_status: analysisResult.resistance.windingStatus,
        insulationPhasePhaseStatus:
    analysisResult.resistance.insulationPhasePhaseStatus,

insulationPhaseMassStatus:
    analysisResult.resistance.insulationPhaseMassStatus,

        diagnosis: analysisResult.diagnosis,
        recommendation: analysisResult.recommendation,
        health: analysisResult.rule

    };

    try{

        const id = await window.electronAPI.saveInspection(inspection);

        alert("Inspection saved successfully.\nInspection ID: " + id);

    }
    catch (err) {

    console.error("SAVE ERROR:", err);

    alert(
        "Unable to save the inspection.\n\n" +
        (err.message || JSON.stringify(err))
    );

}

});