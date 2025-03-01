var map = L.map('map').setView([4.570341350278083, -74.14461308243789], 17);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

async function loadPolygon() {  
    let myData = await fetch('chircalsur.geojson');
    let myPolygon = await myData.json();
    
    L.geoJSON(myPolygon, {
        style: {
            color: "blue"
        }
    }).addTo(map);
}

loadPolygon();

let btnTress =document.getElementById('btnTress');

btnTress.addEventListener('click', ()=> alert("hola"));

//segundo

async function loadPolygonarb() {  
    let myData2 = await fetch('arboles_chircalsur.geojson');
    let myPolygon2 = await myData2.json();
    
    L.geoJSON(myPolygon2, {
        style: {
            color: "blue"
        }
    }).addTo(map);
}

loadPolygonarb();