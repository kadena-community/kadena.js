import type { Object } from 'fabric/fabric-impl';

export interface IFabricCanvasObject extends Object {
  version: string;
  isInitLoad?: boolean;
  previousState?: Object;
}
