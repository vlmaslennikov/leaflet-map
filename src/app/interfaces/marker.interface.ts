import { CoordinatesInObject } from "./coordinates-in-object.interface";

export interface Marker {
  id: number;
  name: string;
  coordinates: CoordinatesInObject;
}
