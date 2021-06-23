import { Component, AfterViewInit } from '@angular/core';
import {AllCitiesService} from '../all-cities.service';
import { MarkerService } from '../marker.service';
import * as L from 'leaflet';
// declare const L: any; // --> Works
import 'leaflet-draw';

// const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = '../assets/images/location.png';
const iconDefault = L.icon({
  iconUrl,
  iconSize: [25, 25],
});
L.Marker.prototype.options.icon = iconDefault;

// var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png',
//         cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18}),
//         map = new L.Map('map', {layers: [cloudmade], center: new L.LatLng(-37.7772, 175.2756), zoom: 15 });
    
//     var editableLayers = new L.FeatureGroup();
//     map.addLayer(editableLayers);
    
//     var MyCustomMarker = L.Icon.extend({
//         options: {
//             shadowUrl: null,
//             iconAnchor: new L.Point(12, 12),
//             iconSize: new L.Point(24, 24),
//             iconUrl: 'link/to/image.png'
//         }
//     });
    
//     var options = {
//         position: 'topright',
//         draw: {
//             polyline: {
//                 shapeOptions: {
//                     color: '#f357a1',
//                     weight: 10
//                 }
//             },
//             polygon: {
//                 allowIntersection: false, // Restricts shapes to simple polygons
//                 drawError: {
//                     color: '#e1e100', // Color the shape will turn when intersects
//                     message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
//                 },
//                 shapeOptions: {
//                     color: '#bada55'
//                 }
//             },
//             circle: false, // Turns off this drawing tool
//             rectangle: {
//                 shapeOptions: {
//                     clickable: false
//                 }
//             },
//             marker: {
//                 icon: new MyCustomMarker()
//             }
//         },
//         edit: {
//             featureGroup: editableLayers, //REQUIRED!!
//             remove: false
//         }
//     };
    
//     var drawControl = new L.Control.Draw(options);
//     map.addControl(drawControl);
    
//     map.on(L.Draw.Event.CREATED, function (e:any) {
//         var type = e.layerType,
//             layer = e.layer;
    
//         if (type === 'marker') {
//             layer.bindPopup('A popup!');
//         }
    
//         editableLayers.addLayer(layer);
//     });

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  
   map:any;
   constructor( 
     private cities:AllCitiesService,
     private markerService: MarkerService){}

   initMap(): void {
    this.map = L.map('map', {
 
        center: [ 39.8282, -98.5795 ],
        zoom: 3,

      }).setView([175.30867, -37.77914], 13);

      var drawnItems = new L.FeatureGroup();
      this.map.addLayer(drawnItems);

 
      var center = [-33.8650, 151.2094];

      // Create the map
    

// Initialise the FeatureGroup to store editable layers
var editableLayers = new L.FeatureGroup();
this.map.addLayer(editableLayers);

// define custom marker
var MyCustomMarker = L.Icon.extend({
  options: {
    shadowUrl: null,
    iconAnchor: new L.Point(12, 12),
    iconSize: new L.Point(24, 24),
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Information_icon4_orange.svg'
  }
});

var drawPluginOptions: L.Control.DrawConstructorOptions = {
  position: 'topright',
  draw: {
    polyline: {
      shapeOptions: {
        color: '#f357a1',
        weight: 10
      }
    },
    polygon: {
      allowIntersection: false, // Restricts shapes to simple polygons
      drawError: {
        color: '#e1e100', // Color the shape will turn when intersects
        message: '<strong>Polygon draw does not allow intersections!<strong> (allowIntersection: false)' // Message that will show when intersect
      },
      shapeOptions: {
        color: '#bada55'
      }
    },
    circle: false, // Turns off this drawing tool
    marker: {
      icon: new MyCustomMarker()
    }
  },
  edit: {
    featureGroup: editableLayers, //REQUIRED!!
    remove: false
  }
};





// Initialise the draw control and pass it the FeatureGroup of editable layers
var drawControl = new L.Control.Draw(drawPluginOptions)  ;
this.map.addControl(drawControl);


var editableLayers = new L.FeatureGroup();
this.map.addLayer(editableLayers);




this.map.on('draw:created', function(e:any) {
  var type = e.layerType,
    layer = e.layer;

  if (type === 'marker') {
    layer.bindPopup('A popup!');
  }

  editableLayers.addLayer(layer);
});







    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 3,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });
    tiles.addTo(this.map);

    L.marker([ 39.8282, -98.5795 ],{draggable:true}).addTo(this.map);

    var latlngs1:any = [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]];
    
    var polygon = L.polygon(latlngs1, {color: 'red'}).addTo(this.map);

    this.map.fitBounds(polygon.getBounds());
    L.geoJSON(this.cities.allCities).addTo(this.map);
    console.log('this.map',this.map)
    console.log('L',L);
    

  }

  ngAfterViewInit(): void {
    this.initMap();
    this.markerService.makeCapitalMarkers(this.map);
  }

}
