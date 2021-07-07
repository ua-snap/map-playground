export default [
  {
    // Internal app ID for layer, can be whatever.
    id: "a42bed",
    // Title of layer in list
    title: "Layer Title",
    // Full layer name in GeoServer, including namespace
    wmsLayerName: "alaska_wildfires:postgis_lightning",
    zindex: 20 // how this layer stacks relative to others
  },
  {
    id: "alaska_landcover_2015",
    title: "Land cover types",
    wmsLayerName: "alaska_wildfires:alaska_landcover_2015",
    zindex: 3
  }
];
