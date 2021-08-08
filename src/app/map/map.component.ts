import { Component, AfterViewInit } from "@angular/core";
import { AllCitiesService } from "../all-cities.service";
import { CoordinatesInObject } from "../interfaces/coordinates-in-object.interface";
import { CoincidenceSearch } from "../interfaces/coincidence-search.inteface";
import { Marker } from "../interfaces/marker.interface";

import * as L from "leaflet";
import "leaflet-draw";

const iconUrl = "../assets/images/location.png";
const iconDefault = L.icon({
  iconUrl,
  iconSize: [25, 25],
});
L.Marker.prototype.options.icon = iconDefault;
@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"],
})
export class MapComponent implements AfterViewInit {
  map!: L.DrawMap;
  allMarkers: Marker[] = [];
  coincidenceSearch: CoincidenceSearch[] = [];
  constructor(private cities: AllCitiesService) {}
  initMap(): void {
    this.map = L.map("map", {
      center: [39.8282, -98.5795],
      zoom: 3,
    });
    const tiles = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
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
      position: "topright",
      draw: {
        polyline: false,
        polygon: {
          allowIntersection: false,
          drawError: {
            color: "#e1b800",
            message:
              "<strong>Polygon draw does not allow intersections!<strong> (allowIntersection: false)",
          },
          shapeOptions: {
            color: "#e1b800",
          },
        },
        circle: false,
        circlemarker: false,
        rectangle: false,
        marker: false,
      },
      edit: {
        featureGroup: editableLayers,
        remove: true,
      },
    };
    const drawControl = new L.Control.Draw(drawPluginOptions);
    this.map.addControl(drawControl);
    this.map.on("draw:created", (e: any) => {
      const type = e.layerType;
      const layer = e.layer;

      if (type === "polygon") {
        const [lat1, lng1]: any = this.getPolygonCenter(
          e.layer.editing.latlngs[0][0]
        );
        const latlnMean: CoordinatesInObject = {
          lat: lat1,
          lng: lng1,
        };
        layer.on("click", () => {
          this.addMarker(latlnMean, `polygon center # ${Date.now()}`);
        });
      }
      editableLayers.addLayer(layer);
    });
  }
  addMarker(coord: any, name: string): void {
    const markerId = Date.now();
    this.allMarkers.push({
      id: markerId,
      name: name,
      coordinates: coord,
    });
    const newMarker: L.Marker = L.marker(coord, { draggable: true })
      .addTo(this.map)
      .bindPopup(name)
      .openPopup()
      .on("drag", () => {
        this.allMarkers.find(
          (el: Marker) => el.id === markerId
        )!.coordinates = newMarker.getLatLng();
      });
  }

  citiesSearch(value: string): void {
    if (value == "") {
      this.coincidenceSearch.length = 0;
      return;
    }
    this.coincidenceSearch = this.cities.nameAndCoordinates.filter(
      (place: CoincidenceSearch) =>
        place.name.toLowerCase().includes(value.toLowerCase())
    );
  }

  goToPlace(coordinates: number[][]): void {
    const coord: any = this.getPolygonCenter(coordinates);
    this.map.setView(coord);
    this.map.setZoom(10);
    this.coincidenceSearch.length = 0;
  }

  getPolygonCenter(
    data: any,
    returnedType: string = "array"
  ): number[] | CoordinatesInObject {
    let lat;
    let lng;
    if (data[0].length) {
      lat =
        data.reduce((sum: number, current: number[]) => +sum + +current[0], 0) /
        data.length;
      lng =
        data.reduce((sum: number, current: number[]) => +sum + +current[1], 0) /
        data.length;
      if (returnedType == "object-reverse") {
        return { lng: lat, lat: lng };
      }
      return [lng, lat];
    } else {
      lat =
        data.reduce((sum: number, current: any) => +sum + +current.lat, 0) /
        data.length;
      lng =
        data.reduce((sum: number, current: any) => +sum + +current.lng, 0) /
        data.length;
      return [lat, lng];
    }
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
