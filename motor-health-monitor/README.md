<img width="1920" height="1080" alt="MCU(STM32)" src="https://github.com/user-attachments/assets/700e90e0-3796-4381-b78a-15797c3a9311" />

# Motor Health Monitor

Industrial predictive maintenance system for three-phase induction motors, developed during my internship at the OCP Khouribga winding workshop (*atelier de bobinage*). Combines an STM32-based embedded acquisition unit with an Electron desktop application for real-time motor health monitoring, diagnosis and automated report generation.

## Table of Contents

- [Features](#features)
- [Tools Used](#tools-used)
- [How It Works](#how-it-works)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Desktop Application](#desktop-application)
- [Embedded Firmware](#embedded-firmware)
- [Hardware](#hardware)
- [Documentation](#documentation)
- [Project Context](#project-context)
- [Future Improvements](#future-improvements)
- [Repository](#repository)
- [License](#license)

## Features

- Real-time acquisition of temperature, vibration and rotation speed (RPM) via an STM32 Blue Pill unit
- Live dashboard (Electron desktop app) showing sensor readings during a 60-second acquisition run
- Manual entry of electrical measurements (phase currents, winding resistance, insulation resistance via Megger MIT1025)
- Automated motor health analysis combining sensor data and manual measurements
- Local storage of every inspection (SQLite database) with a searchable inspection history
- Automatic PDF report generation (PDFKit), pre-filled with all collected data — no more manual report writing
- On-device OLED screen for at-a-glance status, and a buzzer for connection/acquisition feedback

## Tools Used

- **STM32CubeMX** + **STM32CubeIDE** — peripheral configuration and firmware development
- **ST-Link** — programming/debugging the STM32
- **Electron** (HTML / CSS / JavaScript) — cross-platform desktop application
- **Node.js `serialport`** — UART communication between the app and the STM32
- **SQLite (`sqlite3`)** — local storage of motors and inspections
- **PDFKit** — automated PDF report generation
- **Megger MIT1025** — manual insulation resistance testing

## How It Works

1. The desktop app connects to the STM32 unit over **UART** (115200 bauds).
2. The technician enters the motor's information (ID, voltage, power, rated current, poles...).
3. Manual measurements are entered: phase currents and insulation resistance (measured with the Megger MIT1025).
4. A **60-second acquisition** is started: the STM32 continuously reads temperature (DS18B20), vibration (ADXL345) and RPM (KY-033), and sends a data frame to the app every second over UART.
5. Once acquisition ends, clicking **"Analyze"** runs the diagnosis logic on the combined sensor and manual data, producing a health status and recommendation.
6. Results are saved to the local SQLite database, then a **PDF report** is generated automatically from the saved data, following the same layout technicians previously filled in by hand.

## System Architecture

<img width="1440" height="700" alt="System architecture" src="https://github.com/user-attachments/assets/48e49b21-9eb6-42c7-b6ac-a9c305058fbf" />

## Project Structure

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
│
├── documentation/
│   ├── screenshots/
│   ├── report.pdf
│   └── presentation.pdf
│
└── README.md
```

## Desktop Application

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

## Embedded Firmware

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
## Wiring / Schematic


<img width="1414" height="988" alt="prototype(1)" src="https://github.com/user-attachments/assets/3b441ece-4732-4e48-ba13-74b0c0572aba" />


The prototype is built around an **STM32 Blue Pill** (STM32F103C8T6):

| Peripheral | Interface | Notes |
|---|---|---|
| KY-033 (IR sensor) | Digital input (external interrupt) | RPM measurement via pulse detection |
| DS18B20 | 1-Wire | Temperature |
| ADXL345 | I2C (bus 1) | Vibration |
| OLED display | I2C (bus 2) | On-device status/readings |
| USB_TTL | UART (RX/TX) | Serial link to the Electron app |
| Buzzer | Digital output | Connection/acquisition feedback |

## Hardware

### Microcontroller

- STM32F103C8T6 (Blue Pill)

### Sensors

- DS18B20 — temperature
- ADXL345 — vibration (accelerometer)
- KY-033 — RPM (IR speed sensor)

### Display

- SSD1306 OLED Display (128×64)

## Documentation

The `documentation` folder contains:

- Project report
- Internship presentation
- System architecture
- Screenshots of the desktop application
- Circuit diagrams

## Project Context

This project was developed during my engineering internship at **OCP Khouribga**.

Its objective is to implement a **low-cost predictive maintenance solution** capable of detecting early signs of motor degradation before failures occur.

The system assists maintenance teams by continuously monitoring motor operating parameters, automatically evaluating equipment condition, storing inspection history, and generating maintenance reports.

## Future Improvements

- Bluetooth/Wi-Fi communication
- Cloud synchronization
- Predictive AI models
- Trend analysis
- Multi-user authentication
- Mobile companion application

## Repository

**Demo video:** [Watch it here](https://drive.google.com/drive/u/0/folders/1AaXh50N0zW4D9l5Si__vS2PoLs3jMpKc)

## License

This project is shared for educational and portfolio purposes.

MIT License.
