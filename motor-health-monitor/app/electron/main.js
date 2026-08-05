
console.log("MAIN FILE LOADED");
console.log(__filename);
const path = require("path");

const uartService = require("../services/uartService");
const databaseService = require("../services/databaseService");
const pdfService = require("../services/pdfService");
const { app, BrowserWindow, ipcMain, shell } = require("electron");
const analysisService = require("../services/analysisService");

let splash = null;
let mainWindow = null;

// ==============================
// Splash Window
// ==============================

function createSplash() {

    splash = new BrowserWindow({

        width: 440,
        height: 500,

        frame: false,

        resizable: false,
        minimizable: false,
        maximizable: false,
        fullscreenable: false,

        autoHideMenuBar: true,

        webPreferences: {

            preload: path.join(__dirname, "preload.js")

        }

    });

    splash.loadFile(
        path.join(__dirname, "../renderer/pages/splash.html")
    );

}

// ==============================
// Main Window (Motor Page)
// ==============================

function createMain() {

    mainWindow = new BrowserWindow({

        width: 1400,
        height: 900,

        autoHideMenuBar: true,

        webPreferences: {

            preload: path.join(__dirname, "preload.js")

        }

    });

    // Make accessible from other services
    global.mainWindow = mainWindow;

    mainWindow.loadFile(
        path.join(__dirname, "../renderer/pages/motor.html")
    );

    if (splash) {

        splash.close();
        splash = null;

    }

}

// ==============================
// Return to Splash
// ==============================

function returnToSplash() {

    if (mainWindow && !mainWindow.isDestroyed()) {

        mainWindow.close();
        mainWindow = null;

    }

    createSplash();

}

// ==============================
// IPC
// ==============================

// List COM Ports
ipcMain.handle("list-ports", async () => {

    return await uartService.listPorts();

});

// Connect to COM Port
ipcMain.handle("connect-port", async (event, port) => {

    return await uartService.connect(port);

});
//uart
ipcMain.handle("send-uart", async (event, data) => {

    return await uartService.send(data);

});

// Save Motor
ipcMain.handle("save-motor", async (event, motor) => {

    return await databaseService.saveMotor(motor);

});
// Get Motor Information
ipcMain.handle("get-motor", async (event, id) => {

    return await databaseService.getMotor(id);

});
ipcMain.handle("analyze-motor", async (event, data) => {

    console.log("============= ANALYZE REQUEST =============");
    console.log(data);

    const result = analysisService.analyzeMotor(data);

    console.log("============= ANALYZE RESULT =============");
    console.log(result);

    return result;

});
console.log("Registering save-inspection...");

ipcMain.handle("save-inspection", async (event, data)=>{

    return await databaseService.saveInspection(data);

});
ipcMain.handle("get-all-inspections", async ()=>{

    return await databaseService.getAllInspections();

});
ipcMain.handle("get-inspection", async(event,id)=>{

    return await databaseService.getInspection(id);

});

// Open Motor Page
ipcMain.on("open-motor", () => {

    createMain();

});
ipcMain.on("open-history", () => {

    createHistory();

});
ipcMain.handle("export-pdf", async (event, inspectionId) => {

    const pdfPath = await pdfService.exportInspectionPDF(inspectionId);

    await shell.openPath(pdfPath);

    return pdfPath;

});



// Device disconnected
ipcMain.on("device-disconnected", () => {

    returnToSplash();

});

// Close Application
ipcMain.on("close-app", () => {

    app.quit();

});

// ==============================
// APP READY
// ==============================

app.whenReady().then(() => {

    createSplash();

});

// ==============================
// CLOSE APP
// ==============================

app.on("window-all-closed", () => {

    if (process.platform !== "darwin") {

        app.quit();

    }

});

function createHistory() {

    mainWindow = new BrowserWindow({

        width: 1400,
        height: 900,

        autoHideMenuBar: true,

        webPreferences: {

            preload: path.join(__dirname, "preload.js")

        }

    });

    global.mainWindow = mainWindow;

    mainWindow.loadFile(

        path.join(__dirname, "../renderer/pages/history.html")

    );

    if (splash) {

        splash.close();

        splash = null;

    }

}