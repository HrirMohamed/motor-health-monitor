async function loadPorts() {

    const ports = await window.electronAPI.listPorts();

    const select = document.getElementById("portSelect");

    select.innerHTML = "";

    if (ports.length === 0) {

        select.innerHTML = "<option>No COM Ports Found</option>";

        document.getElementById("statusText").textContent =
            "No serial ports detected.";

        return;
    }

    ports.forEach(port => {

        const option = document.createElement("option");

        option.value = port.path;

        option.textContent = port.path;

        select.appendChild(option);

    });

}

document.getElementById("refreshPorts").addEventListener("click", loadPorts);

document.getElementById("connectButton").addEventListener("click", async () => {

    const port = document.getElementById("portSelect").value;

    document.getElementById("statusText").textContent =
        "Connecting to " + port + "...";

    const result = await window.electronAPI.connectPort(port);

    if(result.success){
        
        document.getElementById("statusText").textContent =
            "Connected to " + port;

         

        setTimeout(()=>{
  
    window.electronAPI.sendUART("X");
    window.electronAPI.openMotor();

        },2000);

    }else{

        document.getElementById("statusText").textContent =
            "Connection failed.";

    }

});

loadPorts();

document.getElementById("historyButton").addEventListener("click", () => {

    window.electronAPI.openHistory();

});