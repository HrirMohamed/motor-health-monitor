// window.addEventListener("DOMContentLoaded", async () => {

//     try{

//         const inspections = await window.electronAPI.getAllInspections();

//         const tbody = document.querySelector("#historyTable tbody");

//         tbody.innerHTML = "";

//         inspections.forEach(item => {

//             const row = document.createElement("tr");

//             row.innerHTML = `

//                 <td>${item.id}</td>

//                 <td>${item.motor_id} - ${item.name}</td>

//                 <td>${new Date(item.inspection_date).toLocaleString()}</td>

//                 <td>${item.health}</td>

//                 <td>

//                     <button class="view-btn" data-id="${item.id}">
//                         View
//                     </button>

//                     <button class="pdf-btn" data-id="${item.id}">
//                         PDF
//                     </button>

//                 </td>

//             `;

//             tbody.appendChild(row);

//         });

//         // -----------------------------
//         // View buttons
//         // -----------------------------

//         document.querySelectorAll(".view-btn").forEach(button=>{

//             button.addEventListener("click",()=>{

//                 const inspectionId = button.dataset.id;

//                 viewInspection(inspectionId);

//             });

//         });

//         // -----------------------------
//         // PDF buttons
//         // -----------------------------

//       document.querySelectorAll(".pdf-btn").forEach(button => {

//     button.addEventListener("click", async () => {

//         const inspectionId = Number(button.dataset.id);

//         try {

//             await window.electronAPI.exportPDF(inspectionId);

//         } catch (err) {

//             console.error(err);
//             alert("Unable to export PDF.");

//         }

//     });

// });

//     }

//     catch(error){

//     console.error(error);

//     alert(error.message);

// }

// });

// // =====================================
// // View Inspection
// // =====================================

// function viewInspection(id){

//     window.location.href = `details.html?id=${id}`;

// }

// document.getElementById("backButton").addEventListener("click", () => {

//     window.location.href = "inspection.html";

// });


window.addEventListener("DOMContentLoaded", async () => {

    try{

        const inspections = await window.electronAPI.getAllInspections();

        const tbody = document.querySelector("#historyTable tbody");

        tbody.innerHTML = "";

        inspections.forEach(item => {

            const row = document.createElement("tr");

            row.innerHTML = `

                <td>${item.id}</td>

                <td>${item.motor_id} - ${item.name}</td>

                <td>${new Date(item.inspection_date).toLocaleString()}</td>

                <td>${item.health}</td>

                <td>

                    <button class="view-btn" data-id="${item.id}">
                        View
                    </button>

                    <button class="pdf-btn" data-id="${item.id}">
                        PDF
                    </button>

                </td>

            `;

            tbody.appendChild(row);

        });

        // -----------------------------
        // View buttons
        // -----------------------------

        document.querySelectorAll(".view-btn").forEach(button=>{

            button.addEventListener("click",()=>{

                const inspectionId = button.dataset.id;

                viewInspection(inspectionId);

            });

        });

        // -----------------------------
        // PDF buttons
        // -----------------------------

      document.querySelectorAll(".pdf-btn").forEach(button => {

    button.addEventListener("click", async () => {

        const inspectionId = Number(button.dataset.id);

        try {

            await window.electronAPI.exportPDF(inspectionId);

        } catch (err) {

            console.error(err);
            alert("Unable to export PDF.");

        }

    });

});

    }

    catch(error){

    console.error(error);

    alert(error.message);

}

});

// =====================================
// View Inspection
// =====================================

function viewInspection(id){

    window.location.href = `details.html?id=${id}`;

}

document.getElementById("backButton").addEventListener("click", () => {

    window.location.href = "inspection.html";

});