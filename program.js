

var map = L.map('map').setView([4.739892047076093, -74.09805292755829], 17);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var myPolygon; //Usarla para todo el código

async function loadPolygon() {  
    let myData = await fetch('CostaAzul.geojson');
    myPolygon = await myData.json();  //se quita el let para dejarlo como variable global
   
    console.log("✅ Polígono cargado en `myPolygon`:", myPolygon);  // Depuración
   
    L.geoJSON(myPolygon, {
        style: {
            color: "blue"
        }
    }).addTo(map);
}

loadPolygon();

//arbolesCostaAzul.geojson.SE OBTUVO CON EL COLAB¡¡¡

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
            generatePDF(distances,trees.length)
        }
)


//_______________________________________________



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


 //_______________________________________________
       
 let btnSini = document.getElementById('btnSini');

 btnSini.addEventListener('click',
     
     async function(){
 
         console.log("✅ Botón Siniestros presionado");  // Verifica que el botón está funcionando
         
         let response =await fetch ('historico_siniestros_bogota_d.c.geojson');
         let datos = await response.json();
 
         console.log("✅ Datos cargados:", datos); // Verificar que los datos están bien

         if (!myPolygon || !myPolygon.features) {
            console.error("❌ Error: El polígono aún no se ha cargado o no es un GeoJSON válido.");
            return;
        }

         // Extraer solo la geometría del polígono
         let polygonGeometry = myPolygon.features[0].geometry;  // 📌 Tomar solo la geometría


         console.log("✅ Polígono cargado correctamente:", myPolygon);
 
        //Cortar con poligono

        let siniestrosCostaAzul = datos.features.filter(siniestro => turf.booleanPointInPolygon(
            turf.point(siniestro.geometry.coordinates),
            polygonGeometry
            )
        );

        console.log("Siniestros dentro del polígono:", siniestrosCostaAzul.length);
        
        
         //agregar la capa al mapa
 
         L.geoJSON({ type: "FeatureCollection", features: siniestrosCostaAzul }, {
                 pointToLayer: (feature,latlong) => {
 
                     return L.circleMarker(latlong, {
 
                         radius:5,
                         fillColor:'red',
                           color: 'black',
                         weight: 1,
                         opacity:1,
                         fillOpacity:0.5
                     })
                 }
             }).addTo(map);
     }
 )







