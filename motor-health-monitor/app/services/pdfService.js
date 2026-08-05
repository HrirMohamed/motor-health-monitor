const fs = require("fs");
const path = require("path");

const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");

const databaseService = require("./databaseService");


// =========================================
// PDF COORDINATES
// =========================================

const POS = {

    // ---------- Header ----------
    date: { x: 459, y: 713 },

    // ---------- Motor ----------
    motorName: { x: 280, y: 641 },

    power: { x: 32, y: 625 },

    voltage: { x: 120, y: 625 },

   motorTestVoltage: { x: 110, y: 409 },

    current: { x: 234, y: 625 },

    speed: { x: 324, y: 625 },

    // ---------- Insulation ----------
    meggerVoltage: { x: 110, y: 502 },

    insulationU: { x: 186, y: 455 },
    insulationPhasePhase: { x: 186, y: 471 },

    insulationObservation1:{ x: 464, y: 475 },
    insulationObservation2:{ x: 464, y: 455 },

    // ---------- Current ----------
    phaseA: { x: 186, y: 380 },

    phaseB: { x: 186, y: 367 },

    phaseC: { x: 186, y: 350 },

 phaseAObservation: { x: 464, y: 382 },
phaseBObservation: { x: 464, y: 367 },
phaseCObservation: { x: 464, y: 352 },

    // ---------- Resistance ----------
    windingA: { x: 186, y: 289 },

    windingB: { x: 186, y: 275 },

    windingC: { x: 186, y: 259 },
    resistanceObservation1: { x: 464, y: 290 },
    resistanceObservation2: { x: 464, y: 277 },
    resistanceObservation3: { x: 464, y: 258 },

    // ---------- Temperature ----------
    temperature: { x: 186, y: 197 },

    temperatureMax: { x: 186, y: 184 },

    temperatureObservation1: { x: 464, y: 199 },

    temperatureObservation2: { x: 464, y: 185 },


    // ---------- Speed ----------
    speedBottom: { x: 283, y: 153 },

    // ---------- Vibration ----------
    vibration: { x: 283, y: 120 },

    // ---------- Diagnosis ----------
    health: { x: 40, y: 30 },

    recommendation: { x: 180, y: 30 }

};

// =========================================

async function exportInspectionPDF(inspectionId) {

    const inspection = await databaseService.getInspection(inspectionId);

    if (!inspection)
        throw new Error("Inspection not found.");

    const templatePath = path.join(
        __dirname,
        "../assets/ocp_form.pdf"
    );

    const pdfBytes = fs.readFileSync(templatePath);

    const pdfDoc = await PDFDocument.load(pdfBytes);

    const page = pdfDoc.getPages()[0];

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // =========================================
    // Helper
    // =========================================

    function write(value, pos, size = 10) {

        if (
            value === undefined ||
            value === null
        ) return;

        page.drawText(String(value), {

            x: pos.x,
            y: pos.y,

            size,

            font,

            color: rgb(1, 0, 0)

        });

    }

    // =========================================
    // Header
    // =========================================

    write(
        new Date(
            inspection.inspection_date
        ).toLocaleDateString(),
        POS.date
    );

    // =========================================
    // Motor
    // =========================================

    write(inspection.name, POS.motorName);

    write(inspection.power +" kW", POS.power);

    write(inspection.voltage + " V", POS.voltage);

    write(inspection.rated_current + " A", POS.current);

   write(
    inspection.avg_speed != null
        ? Math.round(inspection.avg_speed) + " RPM"
        : "N/A",
    POS.speed
);

    // =========================================
    // Insulation
    // =========================================

    write(
        inspection.meggerVoltage + " V",
        POS.meggerVoltage
    );

    write(
        inspection.insulationU,
        POS.insulationU
    );

   write(
    inspection.insulationPhasePhase,
    POS.insulationPhasePhase
);

write(
    inspection.voltage + " V",
    POS.motorTestVoltage
);

    // =========================================
    // Current
    // =========================================

    write(inspection.phaseA, POS.phaseA);

    write(inspection.phaseB, POS.phaseB);

    write(inspection.phaseC, POS.phaseC);

    write(inspection.phaseAStatus, POS.phaseAObservation);
    write(inspection.phaseBStatus, POS.phaseBObservation);
    write(inspection.phaseCStatus, POS.phaseCObservation);

    // =========================================
    // Resistance
    // =========================================

    write(inspection.windingA, POS.windingA);

    write(inspection.windingB, POS.windingB);

    write(inspection.windingC, POS.windingC);
    write(inspection.windingStatus, POS.resistanceObservation1);
    write(inspection.windingStatus, POS.resistanceObservation2);
    write(inspection.windingStatus, POS.resistanceObservation3);

    write(
    inspection.insulationPhasePhaseStatus,
    POS.insulationObservation1
);

write(
    inspection.insulationPhaseMassStatus,
    POS.insulationObservation2
);

    // =========================================
    // Temperature
    // =========================================

   write(
    inspection.avg_temperature != null
        ? Number(inspection.avg_temperature).toFixed(1)
        : "N/A",
    POS.temperature
);

  write(
    inspection.max_temperature != null
        ? Number(inspection.max_temperature).toFixed(1)
        : "N/A",
    POS.temperatureMax
);
write(
    inspection.temperatureStatus,
    POS.temperatureObservation1
);

write(
    inspection.temperatureStatus,
    POS.temperatureObservation2
);

    // =========================================
    // Speed
    // =========================================

   write(
    inspection.avg_speed != null
        ? Math.round(inspection.avg_speed)
        : "N/A",
    POS.speedBottom
);

    // =========================================
    // Vibration
    // =========================================

   write(
    inspection.avg_vibration != null
        ? Number(inspection.avg_vibration).toFixed(2)
        : "N/A",
    POS.vibration
);

    // =========================================
    // Diagnosis
    // =========================================

    write(
        inspection.health,
        POS.health
    );

    write(
        inspection.recommendation,
        POS.recommendation,
        9
    );

    // =========================================
    // Save
    // =========================================

    const reportsFolder = path.join(
        __dirname,
        "../reports"
    );

    if (!fs.existsSync(reportsFolder))
        fs.mkdirSync(reportsFolder);

    const outputPath = path.join(

        reportsFolder,

        `Inspection_${inspection.id}.pdf`

    );

    fs.writeFileSync(

        outputPath,

        await pdfDoc.save()

    );

    return outputPath;

}

module.exports = {

    exportInspectionPDF

};

