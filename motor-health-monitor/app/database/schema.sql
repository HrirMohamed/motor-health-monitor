-- ===========================================
-- MOTORS
-- ===========================================

CREATE TABLE IF NOT EXISTS motors (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    motor_id TEXT UNIQUE NOT NULL,

    name TEXT NOT NULL,

    voltage REAL NOT NULL,

    power REAL NOT NULL,

    rated_current REAL NOT NULL,

    frequency REAL NOT NULL,

    motor_type TEXT NOT NULL,

    poles INTEGER NOT NULL

);

-- ===========================================
-- INSPECTIONS
-- ===========================================

CREATE TABLE IF NOT EXISTS inspections (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    motor_id INTEGER NOT NULL,

    inspection_date DATETIME DEFAULT CURRENT_TIMESTAMP,

    avg_temperature REAL,
    max_temperature REAL,

    avg_vibration REAL,
    max_vibration REAL,

    avg_speed REAL,
    min_speed REAL,
    max_speed REAL,
    speed_variation REAL,

    phaseA REAL,
    phaseB REAL,
    phaseC REAL,

    windingA REAL,
    windingB REAL,
    windingC REAL,
    
    insulationPhasePhase REAL,

    insulationU REAL,
    insulationV REAL,
    insulationW REAL,

    meggerVoltage INTEGER,

    diagnosis TEXT,
    recommendation TEXT,
    health TEXT,

    FOREIGN KEY (motor_id)
        REFERENCES motors(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE

);