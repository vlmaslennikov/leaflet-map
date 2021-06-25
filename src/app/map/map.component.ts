import { Component, AfterViewInit } from '@angular/core';
import { AllCitiesService } from '../all-cities.service';
import * as L from 'leaflet';
import 'leaflet-draw';

const iconUrl = '../assets/images/location.png';
const iconDefault = L.icon({
  iconUrl,
  iconSize: [25, 25],
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  map: any;
  allMarkers:any = [
    {coordinates:{lat:39.8282, lng:-98.5795}}
  ]
  coincidenceSearch:any = []
  options:any={
    center: [39.8282, -98.5795],
      zoom: 3,
  }

  constructor(
    private cities: AllCitiesService,
  ) {}

  addMarker(coord:any){
    const markerId =Date.now();
    this.allMarkers.push(
      {
        id:markerId,
        coordinates:coord
      }
    )
    let newMarker = L.marker( coord, { draggable: true }).addTo(this.map).on('drag', ()=> {
      this.allMarkers.find((el:any)=>el.id===markerId).coordinates=newMarker.getLatLng()
    console.log('drag',this.allMarkers.find((el:any)=>el.id===markerId));
    console.log('newMarker.getLatLng()',newMarker.getLatLng());
    } )
    console.log(this.allMarkers);
    
    
  }

  citiesSearch(value:string){
    this.coincidenceSearch = this.cities.nameAndCoordinates.filter((city:any)=>city.cityName.includes(value));
    console.log('sfgfhnsths');
  }
  goToPlace(coordinates:any){
    this.map.setView(this.getPolygonCenter(coordinates));
    this.map.setZoom(10);
    this.coincidenceSearch.length=0
  }

  initMap(): void {
    this.map = L.map('map', this.options);
    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    tiles.addTo(this.map);
    const editableLayers = new L.FeatureGroup();
    this.map.addLayer(editableLayers);

    const drawPluginOptions: L.Control.DrawConstructorOptions = {
      position: 'topright',
      draw: {
        polyline: false,
        polygon: {
          allowIntersection: false,
          drawError: {
            color: '#e1e100',
            message:
              '<strong>Polygon draw does not allow intersections!<strong> (allowIntersection: false)', // Message that will show when intersect
          },
          shapeOptions: {
            color: '#bada55',
          },
        },
        circle: false,  
        circlemarker:false,
        rectangle: false,
        marker: false
      },
      edit: {
        featureGroup: editableLayers,
        remove: true,
      },
    };
    const drawControl = new L.Control.Draw(drawPluginOptions);
    this.map.addControl(drawControl);
    this.map.on('draw:created',  (e: any) => {
      const type = e.layerType;
      const layer = e.layer;
      const latlnMean : any = {coordinates:{lat:this.getPolygonCenter(e.layer.editing.latlngs[0][0]),lng:this.getPolygonCenter(e.layer.editing.latlngs[0][0])}};
      console.log('e.layer.editing.latlngs', {lat:this.getPolygonCenter(e.layer.editing.latlngs[0][0]),lng:this.getPolygonCenter(e.layer.editing.latlngs[0][0])});
      
      if (type === 'polygon') {
        layer.on('click', 
        ()=> this.addMarker(latlnMean)
        )
      }
      editableLayers.addLayer(layer);
    });
  }

  getPolygonCenter(array:any){
    let lat :any;
    let lng :any;
    if(array[0].length){
       lat = array.reduce((sum:any,current:any )=>+sum + +current[0],0)/array.length;
       lng = array.reduce((sum:any,current:any )=>+sum + +current[1],0)/array.length;
    }else{
       lat = array.reduce((sum:any,current:any )=>+sum + +current.lat,0)/array.length;
       lng = array.reduce((sum:any,current:any )=>+sum + +current.lng,0)/array.length;
    }
    return [lat, lng]
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
