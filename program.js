// leyenda del mapa 
document.getElementById('legend').style.zIndex = "1000";


var map = L.map('map').setView([4.570341350278083, -74.14461308243789], 17);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//cargar el polígono principal
async function loadPolygon() {  
    let myData = await fetch('chircalsur.geojson');
    let myPolygon = await myData.json();
    
    L.geoJSON(myPolygon, {
        style: {
             color: "orange",   // Color del borde (rojo)
             weight: 3,          // Grosor del borde
             opacity: 1,         // Opacidad del borde (0 a 1)
             fillColor: "gay",  // Color del relleno
             fillOpacity: 0.15  
        }
    }).addTo(map);
}

loadPolygon();

let btnTrees = document.getElementById('btnTrees'); 


btnTrees.addEventListener('click', async function () {
    let response = await fetch("arboles_chircalsur.geojson"); 
    let datos = await response.json(); 

    console.log(`Número de árboles: ${datos.features.length}`);

    L.geoJSON(datos, {
        pointToLayer: (feature, latlong) => {
            return L.circleMarker(latlong, {
                radius: 5,
                fillColor: 'green',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.5,
            });
        },
        onEachFeature: (feature, layer) => {
            let treeId = datos.features.indexOf(feature) + 1; // Asignar número al árbol
            layer.bindPopup(`Árbol ${treeId}`);
        }
    }).addTo(map);
});


let btnDistance = document.getElementById("btnDistance");

btnDistance.addEventListener('click', async () => { 
    let response = await fetch("arboles_chircalsur.geojson");
    let datos = await response.json();

    let trees = datos.features.map((myElement, index) => ({
        id: index + 1,
        coordinates: myElement.geometry.coordinates
    }));

    let centroide = [ -74.144777042307, 4.570396506618631 ];
    // Agregar marcador del centroide con estilo personalizado
    let centroideMarker = L.circleMarker([centroide[1], centroide[0]], {
    radius: 5,        // Tamaño pequeño
    fillColor: '#FF00FF', // Color rojo
    color: '#FF00FF',     // Borde rojo
    weight: 1, 
    opacity: 1,
    fillOpacity: 0.9,
    }).addTo(map);

// Agregar popup al marcador del centroide
centroideMarker.bindPopup("Punto central del barrio");

    let distances = [];

    trees.forEach((tree) => {
        let distance = turf.distance(
            turf.point(tree.coordinates),
            turf.point(centroide)
        );

        distances.push([
            `Árbol ${tree.id}`,
            distance.toFixed(3) // Distancia en kilómetros
        ]);
    });

    console.log(distances); 


    generatePDF(distances, trees.length); // Comentar si no se usa el PDF
});

let btnIncidents = document.getElementById('btnIncidents');

btnIncidents.addEventListener('click', async function () {
    let response = await fetch("siniestros_chircalsur.geojson");
    let datos = await response.json();

    console.log(`Número de incidentes: ${datos.features.length}`);

    // Calcular distancias entre siniestros
let distances = [];
let incidents = datos.features.map((feature, index) => ({
    id: index + 1,
    coordinates: feature.geometry.coordinates
}));

for (let i = 0; i < incidents.length; i++) {
    for (let j = i + 1; j < incidents.length; j++) {
        let distance = turf.distance(
            turf.point(incidents[i].coordinates),
            turf.point(incidents[j].coordinates)
        );
        distances.push([
            `Siniestro ${incidents[i].id}`,
            `Siniestro ${incidents[j].id}`,
            distance.toFixed(3) // Distancia en kilómetros
        ]);
    }
}

console.log(distances);

// Generar PDF con las distancias entre siniestros
generateIncidentPDF(distances, incidents.length);

    //puntos en el mapa 

    L.geoJSON(datos, {
        pointToLayer: (feature, latlong) => {
            return L.circleMarker(latlong, {
                radius: 6,
                fillColor: 'red',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.7,
            });
        },
        onEachFeature: (feature, layer) => {
            let claseAccidente = feature.properties.CLASE_ACC; 
            layer.bindPopup(` Clase de Accidente: ${claseAccidente}`);
        }
    }).addTo(map);
});




// Generar PDF para distancias de los arboles 

function generatePDF(distances, totalTrees) {
    let { jsPDF } = window.jspdf;
    let documentPDF = new jsPDF();   

    // Definir el ancho de la página
    let pageWidth = documentPDF.internal.pageSize.getWidth();

    // Agregar título centrado y con negrita
    documentPDF.setFontSize(16);
    documentPDF.setFont("helvetica", "bold");
    documentPDF.text("REPORTE DE ÁRBOLES EN EL BARRIO EL CHIRCAL SUR", pageWidth / 2, 15, { align: "center" });

    // Agregar fecha y hora del reporte
    let fecha = new Date().toLocaleString();
    documentPDF.setFontSize(10);
    documentPDF.setFont("helvetica", "normal");
    documentPDF.text(`Fecha de generación: ${fecha}`, 10, 25);

    // Definir las columnas y datos de la tabla
    let columns = ["Árbol", "Distancia al centroide (km)"];
    let rows = distances.map((item) => [item[0], item[1]]);

    // Insertar la tabla con estilos mejorados
    documentPDF.autoTable({
        startY: 30, 
        head: [columns],
        body: rows,
        theme: "striped", 
        styles: {
            fontSize: 10, 
            cellPadding: 3,
        },
        headStyles: {
            fillColor: [30, 87, 153], // Azul oscuro
            textColor: [255, 255, 255], // Blanco
            fontStyle: "bold",
        },
        alternateRowStyles: {
            fillColor: [240, 240, 240], // Gris claro
        },
    });

    // Agregar línea con total de árboles
    let finalY = documentPDF.lastAutoTable.finalY + 10;
    documentPDF.setFontSize(12);
    documentPDF.setFont("helvetica", "bold");
    documentPDF.text(`Total de árboles registrados: ${totalTrees}`, 10, finalY);

    // Guardar PDF
    documentPDF.save("reporte_arboles.pdf");
}

// generar PDF para siniestros 
function generateIncidentPDF(distances, totalIncidents) {
    let { jsPDF } = window.jspdf;
    let documentPDF = new jsPDF();

    documentPDF.setFontSize(16);
    documentPDF.setFont("helvetica", "bold");
    documentPDF.text("REPORTE DE DISTANCIAS ENTRE SINIESTROS", 10, 10);

    documentPDF.setFontSize(10);
    let fecha = new Date().toLocaleString();
    documentPDF.text(`Fecha de generación: ${fecha}`, 10, 20);

    documentPDF.autoTable({
        startY: 30,
        head: [['Siniestro 1', 'Siniestro 2', 'Distancia (km)']],
        body: distances,
        theme: "striped",
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [200, 0, 0], textColor: [255, 255, 255], fontStyle: "bold" },
        alternateRowStyles: { fillColor: [240, 240, 240] }
    });

    let finalY = documentPDF.lastAutoTable.finalY + 10;
    documentPDF.setFontSize(12);
    documentPDF.setFont("helvetica", "bold");
    documentPDF.text(`Total de siniestros registrados: ${totalIncidents}`, 10, finalY);

    documentPDF.save("reporte_siniestros.pdf");
}

