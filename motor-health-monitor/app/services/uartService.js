const { SerialPort } = require("serialport");

let serialPort = null;
let currentPort = null;
let monitorTimer = null;

// ======================================
// List Available COM Ports
// ======================================

async function listPorts() {

    return await SerialPort.list();

}

// ======================================
// Connect to Serial Port
// ======================================

async function connect(portPath) {

    return new Promise((resolve) => {

        currentPort = portPath;

        serialPort = new SerialPort({

            path: portPath,
            baudRate: 115200,
            autoOpen: false

        });

        serialPort.open((err) => {

    if (err) {

        resolve({
            success: false,
            error: err.message
        });

        return;
    }

    console.log("Connected to:", portPath);

    // Give Arduino time to reboot after opening the serial port
    setTimeout(() => {

        serialPort.flush(() => {
            console.log("Serial buffer cleared.");
        });

    }, 1500);

    // ======================================
    // UART Receiver
    // ======================================

    let buffer = "";

    serialPort.on("data", (data) => {

        buffer += data.toString();

        const lines = buffer.split("\n");

        buffer = lines.pop();

        lines.forEach((line) => {

            const message = line.trim();

            if (!message) return;

            console.log(
                "[" + new Date().toLocaleTimeString() + "]",
                "RX:",
                message
            );

            if (
                global.mainWindow &&
                !global.mainWindow.isDestroyed()
            ) {

                global.mainWindow.webContents.send(
                    "uart-data",
                    message
                );

            }

        });

    });

    serialPort.on("error", (err) => {

        console.log("Serial Error:", err.message);

    });

    startMonitoring();

    resolve({
        success: true
    });

});

    });

}

// ======================================
// Send UART
// ======================================

function send(data) {

    return new Promise((resolve, reject) => {

        if (!serialPort) {

            reject(new Error("Serial port not found"));

            return;

        }

        if (!serialPort.isOpen) {

            reject(new Error("Serial port is closed"));

            return;

        }

        serialPort.flush(() => {

            serialPort.write(data + "\n", (err) => {

                if (err) {

                    console.log(err);

                    reject(err);

                    return;

                }

                serialPort.drain(() => {

                    console.log(

                        "[" + new Date().toLocaleTimeString() + "]",

                        "TX:",

                        data

                    );

                    resolve(true);

                });

            });

        });

    });

}

// ======================================
// Monitor USB Disconnection
// ======================================

function startMonitoring() {

    if (monitorTimer) {

        clearInterval(monitorTimer);

    }

    monitorTimer = setInterval(async () => {

        const ports = await SerialPort.list();

        const stillExists = ports.some(

            port => port.path === currentPort

        );

        if (!stillExists) {

            console.log("Device disconnected.");

            clearInterval(monitorTimer);

            monitorTimer = null;

            if (serialPort && serialPort.isOpen) {

                serialPort.destroy();

            }

            serialPort = null;

            currentPort = null;

            if (

                global.mainWindow &&
                !global.mainWindow.isDestroyed()

            ) {

                global.mainWindow.webContents.send(

                    "device-disconnected"

                );

            }

        }

    }, 1000);

}

// ======================================
// Disconnect Manually
// ======================================

function disconnect() {

    if (monitorTimer) {

        clearInterval(monitorTimer);

        monitorTimer = null;

    }

    if (serialPort && serialPort.isOpen) {

        serialPort.close();

    }

    serialPort = null;

    currentPort = null;

}

// ======================================
// Get Current Port
// ======================================

function getPort() {

    return serialPort;

}

// ======================================
// Exports
// ======================================

module.exports = {

    listPorts,
    connect,
    send,
    disconnect,
    getPort

};