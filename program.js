

var map = L.map('map').setView([4.739892047076093, -74.09805292755829], 17);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

async function loadPolygon() {  
    let myData = await fetch('CostaAzul.geojson');
    let myPolygon = await myData.json();
    
    L.geoJSON(myPolygon, {
        style: {
            color: "blue"
        }
    }).addTo(map);
}

loadPolygon();

//______________________________________________

// async function loadPolygon2() {  
//     let myData2 = await fetch('arbolesCostaAzul.geojson');
//     let myPolygon2 = await myData2.json();
    
//     L.geoJSON(myPolygon2, {
//         style: {
//             color: "blue"
//         }
//     }).addTo(map);
// }

// loadPolygon2();

//_______________________________________________

let btnTrees = document.getElementById('btnTrees');

btnTrees.addEventListener('click',
    
    async function(){

        console.log("✅ Botón Árboles presionado");  // Verifica que el botón está funcionando
        
        let response =await fetch ('arbolesCostaAzul.geojson');
        let datos = await response.json();

        console.log("✅ Datos cargados:", datos); // Verificar que los datos están bien

        //agregar la capa al mapa

        L.geoJSON(
            datos,       
            {
                pointToLayer: (feature,latlong) => {

                    return L.circleMarker(latlong, {

                        radius:5,
                        fillColor:'green',
                          color: 'black',
                        weight: 1,
                        opacity:1,
                        fillOpacity:0.5
                    })
                }
            }).addTo(map);
    }
)

//__________________________________________________



let btnDistance = document.getElementById("btnDistance");

btnDistance.addEventListener('click',
        async () => {

            let response =await fetch ('arbolesCostaAzul.geojson');
            let datos = await response.json();
            let trees= datos.features.map((myElement,index)=>({
                id:index+1,
                coordinates:myElement.geometry.coordinates

            }));

         //console.table(trees);
         let distances=[];
         trees.forEach((treeA)=>{trees.forEach(
                    (treeB)=>{
                        //Calcular la distancia de treeA a cada uno de loos treeB
                        if(treeA.id != treeB.id){

                                let distance = turf.distance(
                                turf.point(treeA.coordinates),
                                turf.point(treeB.coordinates),
                                );                   
                     

                        distances.push(

                            [

                                `Árbol ${treeA.id}` , 
                                `Árbol ${treeB.id}`, 
                                distance.toFixed(3) //decimales
                            ]

                        )
                        }
                    }
                ) 
            }
            )
            generatePDF(distances,trees.lenght)
        }
)


      function generatePDF(distances,TotalTrees){
        

            let {jsPDF} = window.jspdf;
            let documentPDF = new jsPDF ();

            documentPDF.text("REPORTE DE ÁRBOLES EN EL BARRIO COSTA AZUL", 10,10);

            documentPDF.autoTable(
                {
                    head: [['Árbol1','Árbol2','Distance']],
                    body: distances
                }                

            );

            documentPDF.save("CostaAzul.pdf")
        }


        








