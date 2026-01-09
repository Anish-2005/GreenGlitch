import "leaflet";

declare module "leaflet" {
  interface HeatLayerOptions {
    minOpacity?: number;
    maxZoom?: number;
    max?: number;
    radius?: number;
    blur?: number;
    gradient?: Record<number, string>;
  }

  namespace heatLayer {
    type HeatLatLngTuple = [number, number, number?];
  }

  function heatLayer(latlngs: Array<heatLayer.HeatLatLngTuple>, options?: HeatLayerOptions): Layer;
}
