const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../database/database.db");

const db = new sqlite3.Database(dbPath);

// ======================================
// Create Tables
// ======================================

const schema = fs.readFileSync(

    path.join(__dirname, "../database/schema.sql"),

    "utf8"

);

db.exec(schema);

// ======================================
// Save Motor
// ======================================

function saveMotor(motor){

    return new Promise((resolve,reject)=>{

        db.run(

            `INSERT INTO motors(

                motor_id,
                name,
                voltage,
                power,
                rated_current,
                frequency,
                motor_type,
                poles

            )
            VALUES(?,?,?,?,?,?,?,?)`,

            [

                motor.motorID,
                motor.name,
                motor.voltage,
                motor.power,
                motor.ratedCurrent,
                motor.frequency,
                motor.type,
                motor.poles

            ],

            function(err){

                if(err){

                    reject(err);

                }else{

                    resolve(this.lastID);

                }

            }

        );

    });

}

// ======================================
// Get Motor By Database ID
// ======================================

function getMotor(id){

    return new Promise((resolve,reject)=>{

        db.get(

            `SELECT *
             FROM motors
             WHERE id = ?`,

            [id],

            (err,row)=>{

                if(err){

                    reject(err);

                }else{

                    resolve(row);

                }

            }

        );

    });

}
// ======================================
// Save Inspection
// ======================================

function saveInspection(data){

    return new Promise((resolve,reject)=>{

        db.run(

        `INSERT INTO inspections(

            motor_id,
            inspection_date,

            avg_temperature,
            max_temperature,

            avg_vibration,
            max_vibration,

            avg_speed,
            min_speed,
            max_speed,
            speed_variation,

            phaseA,
            phaseB,
            phaseC,

            windingA,
            windingB,
            windingC,

            insulationPhasePhase,
            insulationU,
            insulationV,
            insulationW,

           meggerVoltage,

phaseAStatus,
phaseBStatus,
phaseCStatus,

temperatureStatus,

windingStatus,

insulationPhasePhaseStatus,

insulationPhaseMassStatus,

diagnosis,
recommendation,
health

        )
        VALUES(
?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,
?,?,?,?,?,?,?,
?,?,?
)`,

        [

            data.motor_id,
            new Date().toISOString(),

            data.temperature.average,
            data.temperature.maximum,

            data.vibration.average,
            data.vibration.maximum,

            data.speed.average,
            data.speed.minimum,
            data.speed.maximum,
            data.speed.variation,

            data.phaseA,
            data.phaseB,
            data.phaseC,

            data.windingA,
            data.windingB,
            data.windingC,

            data.insulationPhasePhase,
            data.insulationU,
            data.insulationV,
            data.insulationW,

            data.meggerVoltage,
           data.phaseA_status,
            data.phaseB_status,
            data.phaseC_status,

            data.temperature_status,

            data.resistance_status,

            data.insulationPhasePhaseStatus,

            data.insulationPhaseMassStatus,

            data.diagnosis,
            data.recommendation,
            data.health

        ],

       function(err){

    if(err){

        console.error("SQL ERROR:", err);
        console.error("MESSAGE:", err.message);

        reject(err);

    }else{

        resolve(this.lastID);

    }

});

    });

}
function getAllInspections(){

    return new Promise((resolve,reject)=>{

        db.all(

            `
            SELECT
                inspections.*,
                motors.motor_id,
                motors.name
            FROM inspections

            JOIN motors
            ON inspections.motor_id = motors.id

            ORDER BY inspection_date DESC
            `,

            [],

            (err,rows)=>{

                if(err){

                    reject(err);

                }else{

                    resolve(rows);

                }

            }

        );

    });

}

function getInspection(id){

    return new Promise((resolve,reject)=>{

        db.get(

            `
           SELECT

    inspections.*,

    motors.motor_id AS motor_code,

    motors.name,
    motors.voltage,
    motors.power,
    motors.rated_current,
    motors.frequency,
    motors.motor_type,
    motors.poles

FROM inspections

JOIN motors
ON inspections.motor_id = motors.id

WHERE inspections.id = ?
            `,

            [id],

            (err,row)=>{

                if(err)
                    reject(err);
                else
                    resolve(row);

            }

        );

    });

}

module.exports = {

    saveMotor,
    getMotor,
    saveInspection,
    getInspection,
    getAllInspections

};
