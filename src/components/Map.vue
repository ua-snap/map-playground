<template>
  <div id="map">
    <div id="map--leaflet-map" class="leaflet-container"></div>
  </div>
</template>

<script>
import _ from "lodash";
import axios from "axios";

export default {
  name: "mv-map",
  props: [
    "baseLayerOptions",
    "baseLayer",
    "placeLayer",
    "crs",
    "mapOptions",
    "localLayers"
  ],
  // Static property, access via this.$options.leaflet
  leaflet: {
    // Leaflet object
    map: undefined,
    // Object of Leaflet layer objects, keyed by layer ID.
    layers: {},
    marker: undefined // for info marker/popup
  },
  computed: {
    layers() {
      return this.$store.state.layers;
    },
    wmsLayerOptions() {
      return _.extend(
        {
          continuousWorld: true,
          transparent: true,
          tiled: "true",
          format: "image/png",
          version: "1.3.0"
        },
        this.baseLayerOptions
      );
    },
    map() {
      return this.$options.leaflet.map;
    }
  },
  mounted() {
    // Instantiate map objects
    this.$options.leaflet.map = this.$L.map(
      "map--leaflet-map",
      this.getBaseMapAndLayers()
    );

    // Add zoom controls
    this.$L.control
      .zoom({
        position: "topright"
      })
      .addTo(this.$options.leaflet.map);

    this.$options.leaflet.map.on("click", this.handleClickEvent);

    this.addLayers();
  },
  watch: {
    // When layer visibility or order changes, re-render
    layers: {
      deep: true,
      handler(layers) {
        this.refreshLayers(layers);
      }
    }
  },
  methods: {
    // Fetch the info from API & show popup.
    handleClickEvent(ev) {
      axios
        .get(
          "http://testing.eba-hkca5w5b.us-west-2.elasticbeanstalk.com/permafrost/" +
            ev.latlng.lat +
            "/" +
            ev.latlng.lng
        )
        .then(res => {
          if (this.$options.leaflet.marker) {
            this.$options.leaflet.map.removeLayer(this.$options.leaflet.marker);
          }
          console.log(res.data);
          let values = {
            gipl_alt_2010:
              res.data["GIPL Active Layer Thickness (m)"]["GIPL_2010_ALT"],
            gipl_alt_2050:
              res.data["GIPL Active Layer Thickness (m)"]["GIPL_2050_ALT"],
            gipl_magt_2010_1m:
              res.data["GIPL Mean Annual Ground Temperature (deg. C)"][
                "GIPL_2010_1m_MAGT"
              ],
            gipl_magt_2010_3m:
              res.data["GIPL Mean Annual Ground Temperature (deg. C)"][
                "GIPL_2010_3m_MAGT"
              ],
            gipl_magt_2010_5m:
              res.data["GIPL Mean Annual Ground Temperature (deg. C)"][
                "GIPL_2010_5m_MAGT"
              ],
            gipl_magt_2050_1m:
              res.data["GIPL Mean Annual Ground Temperature (deg. C)"][
                "GIPL_2050_1m_MAGT"
              ],
            gipl_magt_2050_3m:
              res.data["GIPL Mean Annual Ground Temperature (deg. C)"][
                "GIPL_2050_3m_MAGT"
              ],
            gipl_magt_2050_5m:
              res.data["GIPL Mean Annual Ground Temperature (deg. C)"][
                "GIPL_2050_5m_MAGT"
              ],
            giv_2008:
              res.data[
                "Jorgenson et al. (2008) Permafrost Extent and Ground Ice Volume"
              ]["Ground Ice Volume"],
            pe_2008:
              res.data[
                "Jorgenson et al. (2008) Permafrost Extent and Ground Ice Volume"
              ]["Permafrost Extent"],
            magt_2018:
              res.data[
                "Obu et al. (2018) Mean Annual Ground Temperature (deg. C) at Top of Permafrost"
              ]["Obu 2000-2016 MAGT (Top of Permafrost)"],
            pe_2018:
              res.data["Obu et al. (2018) Permafrost Extent"][
                "Permafrost Extent"
              ]
          };
          let template = _.template(
            `
            <h4 class="title is-6">GIPL Mean Annual Ground Temperature (&deg;C)</h4>
            <table class="table">
            <thead>
              <tr>
                <th scope="col">Depth (m)</th>
                <th scope="col">2010</th>
                <th scope="col">2050</th>
                <th scope="col">Change</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td><%= gipl_magt_2010_1m %></td>
                <td><%= gipl_magt_2050_1m %></td>
                <td><% print("+"+(gipl_magt_2050_1m - gipl_magt_2010_1m).toFixed(2)); %></td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td><%= gipl_magt_2010_3m %></td>
                <td><%= gipl_magt_2050_3m %></td>
                <td><% print("+"+(gipl_magt_2050_3m - gipl_magt_2010_3m).toFixed(2)); %></td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td><%= gipl_magt_2010_5m %></td>
                <td><%= gipl_magt_2050_5m %></td>
                <td><% print("+"+(gipl_magt_2050_5m - gipl_magt_2010_5m).toFixed(2)); %></td>
              </tr>
            </tbody>
            </table>
            
            <h4 class="title is-6">GIPL Active Layer Thickness (m)</h4>
            <table class="table">
            <thead>
              <tr>
                <th scope="col">2010</th>
                <th scope="col">2050</th>
                <th scope="col">Change</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><%= gipl_alt_2010 %></td>
                <td><%= gipl_alt_2050 %></td>
                <td><% print((gipl_alt_2050 - gipl_alt_2010).toFixed(2)); %></td>
              </tr>
            </tbody>
            </table>
            <h4 class="title is-6">Additional data</h4>
            <div class="content">
            <ul>
            <li>Obu et al. (2018) Mean Annual Ground Temperature (deg. C) at Top of Permafrost: <strong><%= magt_2018 %></strong></li>
            <li>Jorgenson et al. (2008) Ground Ice Volume: <strong><%= giv_2008 %></strong></li>
            <li>Jorgenson et al. (2008) Permafrost Extent: <strong><%= pe_2008 %></strong></li>
            <li>Obu et al. (2018) Permafrost Extent: <strong><%= pe_2018 %></strong></li>
            </ul>
            </div>
            `
          );
          console.log(values);
          this.$options.leaflet.marker = this.$L
            .marker(ev.latlng)
            .addTo(this.$options.leaflet.map);
          this.$options.leaflet.marker.bindPopup(template(values)).openPopup();
        });
    },
    // Returns the Leaflet object corresponding to the
    // requested layer ID, or, undefined if not present
    findLayerById(id) {
      return _.find(this.$options.leaflet.layers, layerObj => {
        return layerObj.options.id === id;
      });
    },
    // Instantiate the Leaflet layer objects
    addLayers() {
      // Create or obtain actual Leaflet objects, and add them
      // to the maps.
      _.each(this.layers, layer => {
        this.updateLayer(layer);
      });
    },
    // Adds WMS layer, removing a prior layer if present.
    // Some of these properties are assigned in the vue store,
    // like layer.time and layer.wms.
    addWmsLayer(layer) {
      let layerConfiguration = {};
      layerConfiguration = _.extend(this.wmsLayerOptions, {
        layers: layer.wms,
        styles: layer.styles ? layer.styles : "",
        time: layer.time ? layer.time : "",
        id: layer.id
      });

      // Remove old layers if present
      if (this.$options.leaflet.layers[layer.id]) {
        this.$options.leaflet.map.removeLayer(
          this.$options.leaflet.layers[layer.id]
        );
      }

      this.$options.leaflet.layers[layer.id] = this.$L.tileLayer.wms(
        process.env.VUE_APP_GEOSERVER_WMS_URL,
        layerConfiguration
      );
    },
    // Triggered when a configurable layer has changed, and
    // when setting up the map.  Defines the WMS properties for the layer.
    updateLayer(layer) {
      // If the layer is a normal GeoServer layer, create
      // and add it here.
      if (layer.local !== true) {
        this.addWmsLayer(layer);
      } else {
        // Otherwise, fetch the layer from the list
        // of local layers maintained in this map.
        this.$options.leaflet.layers[layer.id] = this.localLayers[layer.id];
      }
    },
    // Reorder & update layer visibility
    // TODO: issue #134, consider if we can only update what's changed here.
    refreshLayers(layers) {
      layers = layers || this.layers;

      // Helper function to toggle layers
      var toggleLayerVisibility = (visible, map, layer) => {
        if (visible && !map.hasLayer(layer)) {
          map.addLayer(layer);
        } else if (!visible && map.hasLayer(layer)) {
          map.removeLayer(layer);
        }
      };

      // Refresh map layer contents and visibility
      // TODO 2021 it'd be nice to get rid of all this complexity.
      _.each(layers, layer => {
        if (_.isFunction(layer.wmsLayerName)) {
          // Update layer parameters
          let layerObj = this.findLayerById(layer.id);
          if (layerObj) {
            let newParams = {
              layers: layer.wms
            };

            if (layer.styles) {
              _.extend(newParams, { styles: layer.styles });
            }

            if (layer.time) {
              _.extend(newParams, { time: layer.time });
            }

            // This will re-request tiles in case any of the params
            // are different, i.e. WMS-time series.
            layerObj.setParams(newParams);
          }
        }

        // Explicitly order the list by specified z-index
        this.$options.leaflet.layers[layer.id].setZIndex(layer.zindex);

        // The layer is visible (added to Leaflet map) if the
        // 'visible' flag is set
        let layerVisibility = layer.visible;

        toggleLayerVisibility(
          layerVisibility,
          this.$options.leaflet.map,
          this.$options.leaflet.layers[layer.id]
        );
      });
    },
    getBaseMapAndLayers() {
      // The _.cloneDeep is to ensure we aren't recycling
      // the Leaflet layers (breaks map)
      var baseLayer = _.cloneDeep(this.baseLayer);
      var placeLayer = _.cloneDeep(this.placeLayer);

      // Don't add the place layer if not defined
      var layers = placeLayer ? [baseLayer, placeLayer] : [baseLayer];

      var defaultMapProperties = _.extend(
        {
          crs: this.crs,
          zoomControl: false,
          scrollWheelZoom: false,
          attributionControl: false
        },
        this.mapOptions
      );

      // Mix together some defaults with map-specific configuration.
      return _.extend(defaultMapProperties, { layers: layers });
    }
  }
};
</script>

<style lang="scss">
#map--leaflet-map {
  display: block;
  height: 85vh;
}

.leaflet-popup-content {

  h4.title.is-6 {
    margin-bottom: 0.25em;
  }

  table {
    font-size: 110%;
  }

}
</style>
