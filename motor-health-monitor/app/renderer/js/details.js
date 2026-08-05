const params = new URLSearchParams(window.location.search);

const inspectionId = params.get("id");

window.addEventListener("DOMContentLoaded", async () => {

    if (!inspectionId) {

        alert("No inspection selected.");

        return;

    }

    try {

        const inspection =
            await window.electronAPI.getInspection(Number(inspectionId));

        if (!inspection) {

            alert("Inspection not found.");

            return;

        }

        loadInspection(inspection);

    }

    catch (err) {

        console.error(err);

        alert("Unable to load inspection.");

    }

});

// ======================================
// Load Inspection
// ======================================

function loadInspection(data) {

    // ======================================
    // Motor Information
    // ======================================

    document.getElementById("motorInfo").innerHTML = `

        <table class="detailsTable">

            <tr><td><b>Motor ID</b></td><td>${data.motor_id}</td></tr>

            <tr><td><b>Name</b></td><td>${data.name}</td></tr>

            <tr><td><b>Voltage</b></td><td>${data.voltage} V</td></tr>

            <tr><td><b>Power</b></td><td>${data.power} kW</td></tr>

            <tr><td><b>Rated Current</b></td><td>${data.rated_current} A</td></tr>

            <tr><td><b>Frequency</b></td><td>${data.frequency} Hz</td></tr>

            <tr><td><b>Type</b></td><td>${data.motor_type}</td></tr>

            <tr><td><b>Poles</b></td><td>${data.poles}</td></tr>

        </table>

    `;

    // ======================================
    // Inspection Information
    // ======================================

    document.getElementById("inspectionInfo").innerHTML = `

        <table class="detailsTable">

            <tr><td><b>Inspection ID</b></td><td>${data.id}</td></tr>

            <tr><td><b>Date</b></td><td>${data.inspection_date}</td></tr>

        </table>

    `;

    // ======================================
    // Temperature
    // ======================================

    document.getElementById("temperatureInfo").innerHTML = `

        <table class="detailsTable">

            <tr><td><b>Average</b></td><td>${data.avg_temperature} °C</td></tr>

            <tr><td><b>Maximum</b></td><td>${data.max_temperature} °C</td></tr>

        </table>

    `;

    // ======================================
    // Vibration
    // ======================================

    document.getElementById("vibrationInfo").innerHTML = `

        <table class="detailsTable">

            <tr><td><b>Average</b></td><td>${data.avg_vibration} mm/s</td></tr>

            <tr><td><b>Maximum</b></td><td>${data.max_vibration} mm/s</td></tr>

        </table>

    `;

    // ======================================
    // Speed
    // ======================================

    document.getElementById("speedInfo").innerHTML = `

        <table class="detailsTable">

            <tr><td><b>Average</b></td><td>${data.avg_speed} RPM</td></tr>

            <tr><td><b>Minimum</b></td><td>${data.min_speed} RPM</td></tr>

            <tr><td><b>Maximum</b></td><td>${data.max_speed} RPM</td></tr>

            <tr><td><b>Variation</b></td><td>${data.speed_variation}%</td></tr>

        </table>

    `;

    // ======================================
    // Current
    // ======================================

    document.getElementById("currentInfo").innerHTML = `

        <table class="detailsTable">

            <tr><td><b>Phase A</b></td><td>${data.phaseA} A</td></tr>

            <tr><td><b>Phase B</b></td><td>${data.phaseB} A</td></tr>

            <tr><td><b>Phase C</b></td><td>${data.phaseC} A</td></tr>

        </table>

    `;

 // ======================================
// Resistance
// ======================================

document.getElementById("resistanceInfo").innerHTML = `

    <table class="detailsTable">

        <tr><td><b>Winding A</b></td><td>${data.windingA} Ω</td></tr>

        <tr><td><b>Winding B</b></td><td>${data.windingB} Ω</td></tr>

        <tr><td><b>Winding C</b></td><td>${data.windingC} Ω</td></tr>

        <tr><td><b>Insulation Phase → Phase</b></td><td>${data.insulationPhasePhase} MΩ</td></tr>

        <tr><td><b>Insulation U → Ground</b></td><td>${data.insulationU} MΩ</td></tr>

        <tr><td><b>Insulation V → Ground</b></td><td>${data.insulationV} MΩ</td></tr>

        <tr><td><b>Insulation W → Ground</b></td><td>${data.insulationW} MΩ</td></tr>

        <tr><td><b>Megger Voltage</b></td><td>${data.meggerVoltage} V</td></tr>

    </table>

`;
    // ======================================
    // Diagnosis
    // ======================================

    document.getElementById("diagnosisInfo").innerHTML = `

        <table class="detailsTable">

            <tr><td><b>Health</b></td><td>${data.health}</td></tr>

            <tr><td><b>Diagnosis</b></td><td>${data.diagnosis}</td></tr>

            <tr><td><b>Recommendation</b></td><td>${data.recommendation}</td></tr>

        </table>

    `;

}

// ======================================
// Buttons
// ======================================

document.getElementById("backHistory").addEventListener("click", () => {

    window.location.href = "history.html";

});

document.getElementById("exportPDF").addEventListener("click", () => {

    alert("PDF export coming next.");

});