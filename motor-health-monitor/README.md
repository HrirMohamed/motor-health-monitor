# Motor Health Monitor

An industrial **predictive maintenance system** developed during my engineering internship at **OCP Khouribga**.

The project combines an **Electron desktop application** with an **STM32-based embedded acquisition unit** to monitor the health of three-phase induction motors. The system collects sensor data in real time, evaluates the motor condition, stores inspection history, and generates PDF inspection reports to assist maintenance personnel.

---

# Features

- Real-time motor condition monitoring
- UART communication between STM32 and Electron
- Temperature monitoring (DS18B20)
- Vibration monitoring (ADXL345)
- RPM measurement
- Three-phase current analysis
- Winding resistance analysis
- Insulation resistance analysis
- Automatic motor health diagnosis
- SQLite local database
- PDF inspection report generation
- OLED status display
- Offline operation

---

# Project Structure

```
motor-health-monitor/
├── app/                       Electron desktop application
│   ├── electron/              Main process
│   ├── renderer/              User Interface
│   ├── services/              Business logic
│   ├── config/                Motor thresholds
│   ├── database/              SQLite schema
│   ├── assets/                Images, PDF template
│   └── package.json
│
├── firmware/                  STM32CubeIDE project
│   ├── Core/
│   │   ├── Src/
│   │   └── Inc/
│   ├── Drivers/
│   └── Middlewares/
│
├── documentation/
│   ├── screenshots/
│   ├── report.pdf
│   └── presentation.pdf
│
└── README.md
```

---

# Desktop Application

The Electron application provides a user-friendly interface for technicians to:

- Register motors
- Launch inspections
- Receive live measurements from the STM32 board
- Analyze motor condition automatically
- Save inspection history
- Generate professional PDF reports

### Technologies

- Electron.js
- Node.js
- HTML
- CSS
- JavaScript
- SQLite

Run the application:

```bash
cd app
npm install
npm start
```

---

# Embedded Firmware

The embedded system is based on an **STM32F103C8T6 (Blue Pill)** programmed using **STM32CubeIDE**.

The firmware performs:

- Temperature acquisition
- Vibration acquisition
- RPM measurement
- UART communication
- OLED status display
- Sensor initialization and diagnostics

Measured data are transmitted to the desktop application using a simple UART protocol.

Example:

```
CONNECTED
STARTED

TEMP:36.5
VIB:2.34
RPM:1498

TEMP:36.7
VIB:2.41
RPM:1501

DONE
```

---

# Hardware

## Microcontroller

- STM32F103C8T6 (Blue Pill)

## Sensors

- ADXL345 Accelerometer
- DS18B20 Temperature Sensor

## Display

- SSD1306 OLED Display (128×64)

---

# Documentation

The `documentation` folder contains:

- Project report
- Internship presentation
- System architecture
- Screenshots of the desktop application
- Circuit diagrams
- User manual (optional)

---

# Project Context

This project was developed during my engineering internship at **OCP Khouribga**.

Its objective is to implement a **low-cost predictive maintenance solution** capable of detecting early signs of motor degradation before failures occur.

The system assists maintenance teams by continuously monitoring motor operating parameters, automatically evaluating equipment condition, storing inspection history, and generating maintenance reports.

---

# Future Improvements

- Bluetooth/Wi-Fi communication
- Cloud synchronization
- Predictive AI models
- Trend analysis
- Multi-user authentication
- Mobile companion application

---

# License

This project is shared for educational and portfolio purposes.

MIT License.
