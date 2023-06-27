// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2021-01-01&endtime=2021-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function chooseColor(depth){
    if (depth < 10) {
        return "#44ce1b";
      }
      else if (depth < 30) {
        return "#f7e379";
      }
      else if (depth < 50) {
        return "#f2a134";
      }
      else if (depth < 70) {
        return "#e51f1f";
      }
      else if (depth < 90) {
        return "#d11616";
      }
      else {
        return "#8e1818";
      }
}

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h2>Lat: ${feature.geometry.coordinates[0]}, Lon: ${feature.geometry.coordinates[1]}</h2><hr><h2>Magnitude: ${feature.properties.mag}</h2><hr><h2>Depth: ${feature.geometry.coordinates[2]} km</h2>`);
  }

  function createMarker (feature, latlng) {
    let options = {
    radius:feature.properties.mag*10,
    fillColor: chooseColor(feature.geometry.coordinates[2]),
    color: "black",
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.7
   } 
    return L.circleMarker(latlng,options);
  }
  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: createMarker
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}



function createMap(earthquakes) {
    // Define outdoors and graymap layers
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })
 
 
   // Define a baseMaps object to hold our base layers
   let baseMaps = {
     "Street": street,
   };
 
   // Create overlay object to hold our overlay layer
   let overlayMaps = {
     Earthquakes: earthquakes
   };
 
   // Create our map, giving it the streetmap and earthquakes layers to display on load
   let myMap = L.map("map", {
     center: [
       39.8282, -98.5795
     ],
     zoom: 4,
     layers: [street, earthquakes]
   });
   // Add the layer control to the map

   // Create map legend to provide context for map data
let legend = L.control({position: 'bottomright'});

legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend');
    var steps = [0, 10, 30, 50, 70, 90];
    var labels = [];
    var legendTitle = "<h4>Earthquake Depth (km)</h4>";

    div.innerHTML = legendTitle

    // go through each magnitude item to label and color the legend
    // push to labels array as list item
    for (var i = 0; i < steps.length; i++) {
          labels.push('<ul style="background-color:' + chooseColor(steps[i] + 1) + '"> <span>' + steps[i] + (steps[i + 1] ? '&ndash;' + steps[i + 1] + '' : '+') + '</span></ul>');
        }

      // add each label list item to the div under the <ul> tag
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    
    return div;
  };    

  // Add the layer control to the map
  legend.addTo(myMap);
}