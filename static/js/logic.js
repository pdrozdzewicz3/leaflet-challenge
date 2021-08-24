 // Define map, centered at USA
 var leafletMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 3
  });

// Add satellite map layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  minZomo: 3,
  zoomOffset: -1,
  id: "mapbox/satellite-v9",
  accessToken: API_KEY
}).addTo(leafletMap);
var geojson;

// Data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
var quakes = data.features;
var numQuake = quakes.length;

// Go through earthquake data
for (let i = 0; i < numQuake ; i++) {
  var color = "";
  if  (quakes[i].geometry.coordinates[2] < 10) {
    color = "rgb(140, 245, 0)";
  } else if (quakes[i].geometry.coordinates[2] < 30) {
    color = "rgb(200, 240, 0)";
  } else if (quakes[i].geometry.coordinates[2] < 50) {
    color = "rgb(220, 220, 20)";
  } else if (quakes[i].geometry.coordinates[2]< 70) {
    color = "rgb(250, 180, 40)";
  } else if (quakes[i].geometry.coordinates[2] < 90) {
    color = "rgb(252, 160, 90)";
  } else {
    color = "rgb(255, 50, 50)";
  }


  // Markers
  var marker = L.circleMarker([quakes[i].geometry.coordinates[1], quakes[i].geometry.coordinates[0]], {
    color: "black",
    weight: .7,
    fillOpacity: 1,
    fillColor: color,
    radius: quakes[i].properties.mag * 2.2
  })

  .bindPopup("<h2>" + quakes[i].properties.place + "</h2> <hr>" + "<h3> Magnitude: " + quakes[i].properties.mag + "</h3>" + "<h3> Depth: " + quakes[i].geometry.coordinates[2] + "</h3>")
  .addTo(leafletMap);
}


// Legend
var legend = L.control({position: 'bottomleft'});

// Gets color def
function colorDef(d) {
  return d > 90 ? "rgb(255, 50, 50)" : 
  d > 70 ? "rgb(252, 160, 90)" :
  d > 50 ? "rgb(250, 180, 40)" : 
  d > 30 ? "rgb(220, 220, 20)" :
  d > 10 ? "rgb(200, 240, 0)" :
           "rgb(140, 245, 0)";
}

// Add legend
legend.onAdd = function () {

  var div = L.DomUtil.create('div', 'info legend');
  var depths = [-10, 10, 30, 50, 70, 90];
  for (var i = 0; i < depths.length; i++) {
    div.innerHTML +=
        '<i style="background:' + colorDef(depths[i] + 1) + '"></i> ' + 
        depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+'); 
}
  return div;
};
// Add legend onto map
legend.addTo(leafletMap);

});