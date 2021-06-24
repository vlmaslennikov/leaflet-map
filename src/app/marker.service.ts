import { Injectable } from '@angular/core';
import {AllCitiesService} from './all-cities.service';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  constructor(
    private cities:AllCitiesService ) { }
    
  makeCapitalMarkers(map: any): void {
    var myRenderer = L.canvas({ padding: 0.5 });
      for (const c of this.cities.allCitiesData.features) {
        const coordinates = c.geometry.coordinates;
        const marker = L.polygon(coordinates,{ renderer: myRenderer } );
        marker.addTo(map);
      }
  }
}