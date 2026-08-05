# Motor Health Monitor

A desktop application for inspecting industrial motors — an Electron app that talks to an
STM32-based measurement unit over UART, analyzes temperature, vibration, speed, current, and
winding resistance readings, and generates a PDF inspection report.

## Structure

This is a monorepo containing both halves of the project:

```
motor-health-monitor/
├── app/            Electron desktop application
│   ├── electron/    Main process (window management, IPC handlers)
│   ├── renderer/    UI (HTML/CSS/JS shown in the app windows)
│   ├── services/    Business logic (motor analysis, UART, database, PDF export)
│   ├── config/      Motor threshold configuration
│   ├── database/    SQLite schema
│   └── assets/      PDF report template, etc.
│
└── firmware/        STM32F1 firmware (STM32CubeIDE project)
    ├── Src/         Source files
    └── Inc/         Header files
```

## App

Built with Electron. Renders motor inspection forms, streams live sensor readings from the
STM32 board over serial (UART), runs the analysis in `services/analysis/`, and can export a
PDF inspection report per motor.

```bash
cd app
npm install
npm start
```

## Firmware

STM32F1 firmware built in STM32CubeIDE. Reads an ADXL345 accelerometer (vibration), a
DS18B20 temperature sensor, and an RPM pulse input, and streams `TYPE:VALUE` lines
(e.g. `TEMP:38.4`) over UART to the desktop app. Drives a small SSD1306 OLED status display.

Open `firmware/` as an existing project in STM32CubeIDE to build and flash.

## Status / known issues

A few things are on the list to fix (tracked here so they don't get lost):

- `services/analysis/diagnosis.js` checks a `resistance.insulationStatus` field that doesn't
  exist on the resistance analysis result (the real fields are `insulationPhasePhaseStatus`
  and `insulationPhaseMassStatus`).
- `renderer/pages/details.html` links to a `details.css` that doesn't exist yet.
- `renderer/js/inspection.js` references a `logContainer` element that isn't in
  `inspection.html`.
- `renderer/js/details.js`'s "Export PDF" button is a placeholder alert, not wired to the
  real PDF export used on the history page.
- `services/databaseService.js` does a plain `INSERT` for new motors, so re-using an
  existing Motor ID throws a raw `SQLITE_CONSTRAINT` error instead of a friendly message.

## License

Add a license of your choice (MIT is a common default for personal/portfolio projects).
