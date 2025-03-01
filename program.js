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

async function loadPolygon2() {  
    let myData2 = await fetch('arbolesCostaAzul.geojson');
    let myPolygon2 = await myData2.json();
    
    L.geoJSON(myPolygon2, {
        style: {
            color: "blue"
        }
    }).addTo(map);
}

loadPolygon2();

let btnTress =document.getElementById('btnTress');

btnTress.addEventListener('click', ()=> alert("hola"));

