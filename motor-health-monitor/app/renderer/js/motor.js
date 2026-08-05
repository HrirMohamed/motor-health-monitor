document
.getElementById("startInspection")
.addEventListener("click", async () => {

    const motor = {

        motorID: document.getElementById("motorID").value.trim(),

        name: document.getElementById("motorName").value.trim(),

        voltage: Number(document.getElementById("voltage").value),

        power: Number(document.getElementById("power").value),

        ratedCurrent: Number(document.getElementById("ratedCurrent").value),

        frequency: Number(document.getElementById("frequency").value),

        type: document.getElementById("motorType").value,

        poles: Number(document.getElementById("poles").value)

    };

    // ===============================
    // Validation
    // ===============================

    if (

        !motor.motorID ||
        !motor.name ||
        !motor.voltage ||
        !motor.power ||
        !motor.ratedCurrent ||
        !motor.frequency

    ) {

        alert("Please fill in all motor information.");

        return;

    }

    try {

    console.log("Saving motor...", motor);

    // Save motor in SQLite
    const motorDatabaseID =
        await window.electronAPI.saveMotor(motor);

    console.log("Motor saved with ID:", motorDatabaseID);

    // Save the database ID
    sessionStorage.setItem(
        "motorDatabaseID",
        motorDatabaseID
    );

    // Save motor information for inspection page
    sessionStorage.setItem(
        "currentMotor",
        JSON.stringify(motor)
    );

    // ===============================
    // Tell the MCU to start inspection
    // ===============================

    await window.electronAPI.sendUART("S");

    console.log("Start command sent to MCU.");

    // Open inspection page
    window.location.href = "inspection.html";

}
catch(err){

    console.error("Error:", err);

    alert(
        "Unable to start inspection.\n\n" +
        err.message
    );

}
  

});

// ======================================
// Device disconnected
// ======================================

window.electronAPI.onDisconnect(() => {

    alert(
        "Communication lost.\n\nDevice disconnected."
    );

    window.electronAPI.closeApp();

});