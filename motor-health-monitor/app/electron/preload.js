const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {

    // =====================================
    // UART
    // =====================================

    // List available COM ports
    listPorts: () => ipcRenderer.invoke("list-ports"),

    // Connect to selected COM port
    connectPort: (port) => ipcRenderer.invoke("connect-port", port),

    // Send command to MCU
    sendUART: (data) => ipcRenderer.invoke("send-uart", data),

    // Receive data from MCU
    onUARTData: (callback) => {

        const listener = (event, data) => {

            callback(data);

        };

        ipcRenderer.on("uart-data", listener);

        return listener;

    },

    // =====================================
    // Database
    // =====================================

   // =====================================
// Database
// =====================================

saveMotor: (motor) =>
    ipcRenderer.invoke("save-motor", motor),

getMotor: (id) =>
    ipcRenderer.invoke("get-motor", id),

saveInspection: (inspection) =>
    ipcRenderer.invoke("save-inspection", inspection),

analyzeMotor: (data) =>
    ipcRenderer.invoke("analyze-motor", data),

    // =====================================
    // Navigation
    // =====================================

    openMotor: () =>

        ipcRenderer.send("open-motor"),

        openHistory: () =>

    ipcRenderer.send("open-history"),

    closeApp: () =>

        ipcRenderer.send("close-app"),

        
    exportPDF: (id)=>

    ipcRenderer.invoke("export-pdf", id),


        ////
         saveInspection: (data) =>

    ipcRenderer.invoke("save-inspection", data),

        getAllInspections: () =>

    ipcRenderer.invoke("get-all-inspections"),

    getInspection: (id)=>

    ipcRenderer.invoke("get-inspection",id),

    // =====================================
    // Events
    // =====================================

    onDisconnect: (callback) => {

        ipcRenderer.on("device-disconnected", () => {

            callback();

        });

    }
   
    

});
