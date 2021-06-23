import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AllCitiesService} from './all-cities.service';

import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  capitals: string = './usa-capitals.geojson';

  constructor(
    private http: HttpClient,
    private cities:AllCitiesService,) { }
    
  makeCapitalMarkers(map: any): void {
    var myRenderer = L.canvas({ padding: 0.5 });
      for (const c of this.cities.usaCapitals.features) {
        const lon = c.geometry.coordinates[0];
        const lat = c.geometry.coordinates[1];
        const marker = L.marker([lat, lon]);

        marker.addTo(map);
      };
      for (const c of this.cities.allCities.features) {
        const coordinates = c.geometry.coordinates;
        const marker = L.polygon(coordinates,{ renderer: myRenderer } );

        marker.addTo(map);
      }
  }
}