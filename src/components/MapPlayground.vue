<template>
  <div id="mv-ak-fires">
    <div class="columns">
      <div class="column is-one-quarter">
        <layer-list></layer-list>
      </div>
      <div class="column">
        <mv-map
          ref="map"
          :base-layer-options="baseLayerOptions"
          :base-layer="baseLayer"
          :place-layer="placeLayer"
          :crs="crs"
          :map-options="mapOptions"
          :local-layers="localLayers"
        ></mv-map>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>

<script>
// For Leaflet, whose constructors are often lowercase
/* eslint new-cap: "off" */
import _ from "lodash";
import Vue from "vue";
import moment from "moment";

import mapLayers from "../layers";
import L from "leaflet";
import p4l from "proj4leaflet"; // eslint-disable-line
import leaflet_heat from "leaflet.heat"; // eslint-disable-line
import "leaflet/dist/leaflet.css";

Object.defineProperty(Vue.prototype, "$L", { value: L });
Object.defineProperty(Vue.prototype, "$moment", { value: moment });


import MvMap from "./Map";
import LayerList from "./LayerList";

export default {
  name: "MapPlayground",
  components: {
    MvMap,
    LayerList
  },
  computed: {
    crs() {
      return new this.$L.Proj.CRS(
        "EPSG:3338",
        "+proj=aea +lat_1=55 +lat_2=65 +lat_0=50 +lon_0=-154 +x_0=0 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=m +no_defs",
        {
          resolutions: [4096, 2048, 1024, 512, 256, 128, 64],

          // Origin should be lower-left coordinate
          // in projected space.  Use GeoServer to
          // find this:
          // TileSet > Gridset Bounds > compute from maximum extent of SRS
          origin: [-4648005.934316417, 444809.882955059]
        }
      );
    },
    baseLayer() {
      return new this.$L.tileLayer.wms(
        process.env.VUE_APP_GEOSERVER_WMS_URL,
        _.extend(this.baseLayerOptions, {
          layers: "alaska_osm"
        })
      );
    },
    placeLayer() {
      return new this.$L.tileLayer.wms(
        process.env.VUE_APP_GEOSERVER_WMS_URL,
        _.extend(this.baseLayerOptions, {
          zIndex: 101,
          layers: "alaska_places_osm_3338"
        })
      );
    }
  },
  data() {
    return {
      mapOptions: {
        zoom: 1,
        minZoom: 0,
        maxZoom: 6,
        center: [65, -152.5]
      },
      baseLayerOptions: {
        transparent: true,
        srs: "EPSG:3338",
        format: "image/png",
        version: "1.3",
        continuousWorld: true // needed for non-3857 projs
      },
      layers: mapLayers,
      map: undefined
    };
  },
  created() {
    // Initialize the layers!
    this.$store.commit("setLayers", this.layers);
  },
  mounted() {
    this.fetchFireData();
    this.fetchViirsData();

    // Remove any stray localStorage.
    localStorage.clear();
  },
  methods: {}
};
</script>

<style lang="scss">
// *** Design/content folks: don't edit these please!
// Not scoped, for editing leaflet styles

.leaflet-popup-content {
  z-index: 1000;

  h1 {
    font-size: 16pt;
    color: #322323;
    margin: 0.5rem 0 0.25rem;
    padding: 0;
  }

  h2 {
    font-size: 1rem;
    margin: 0.5rem 0;
    padding: 0;
  }

  h3 {
    font-size: 0.75rem;
    margin-bottom: 0;
    padding: 0;

    &.discovered {
      margin-top: 0;
      font-weight: 500;
    }
  }

  p.updated {
    margin-top: 0.25ex;
    font-weight: 300;
    color: #988989;
  }

  p.out {
    font-weight: 700;
    margin: 0;
  }
}

div.leaflet-marker-icon span {
  font-size: 85%;
  color: white;
  font-weight: 500;
  border-radius: 1em;
  margin: 1ex;
  padding: 0.5ex;

  &.active {
    background-color: rgba(200, 56, 20, 0.55);
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
    z-index: 10000;
  }

  &.inactive {
    background-color: rgba(100, 100, 100, 0.6);
    z-index: 500;
  }

  &.small {
    border-radius: 50%;
    width: 1em;
    height: 1em;
    display: inline-block;
    z-index: 300;
  }
}

// Legends that use images

// Legend table styling
table.alaska-wildfires-legend {
  td {
    vertical-align: middle !important;

    // For the color blocks
    div {
      height: 2em;
      width: 2em;
    }
  }

  &.active-fires {
    img {
      min-width: 3em;
    }
  }

  &.historical-fire-perimeters {
    td div {
      &.h-40-69 {
        background-color: #cbd1ce;
        border: 2px solid #98a09c;
      }
      &.h-70-99 {
        background-color: #8f9693;
        border: 2px solid #5b6360;
      }
      &.h-00-17 {
        background-color: #5f6462;
        border: 2px solid #2b3131;
      }
    }
  }

  &.lightning-climatology {
    td div {
      &.lc-let1 {
        background-color: rgb(229, 230, 236);
      }
      &.lc-6 {
        background-color: rgb(142, 155, 186);
      }
      &.lc-13 {
        background-color: rgb(84, 115, 160);
      }
      &.lc-19 {
        background-color: rgb(98, 129, 152);
      }
      &.lc-26 {
        background-color: rgb(130, 152, 141);
      }
      &.lc-32 {
        background-color: rgb(174, 186, 145);
      }
      &.lc-39 {
        background-color: rgb(236, 236, 199);
      }
      &.lc-gte45 {
        background-color: rgb(255, 255, 255);
        border: 1px solid #ccc;
      }
    }
  }

  &.alaska-landcover-2015 {
    td div {
      &.l-1 {
        background-color: #003d00;
      }
      &.l-2 {
        background-color: #949c70;
      }
      &.l-3 {
        background-color: #148c3d;
      }
      &.l-4 {
        background-color: #5c752b;
      }
      &.l-5 {
        background-color: #b38a33;
      }
      &.l-6 {
        background-color: #e1cf8a;
      }
      &.l-7 {
        background-color: #9c7554;
      }
      &.l-8 {
        background-color: #bad48f;
      }
      &.l-9 {
        background-color: #408a70;
      }
      &.l-10 {
        background-color: #6ba38a;
      }
      &.l-11 {
        background-color: #e6ae66;
      }
      &.l-12 {
        background-color: #a8abae;
      }
      &.l-13 {
        background-color: #dd40d6;
      }
      &.l-14 {
        background-color: #4c70a3;
      }
      &.l-15 {
        background-color: #eee9ee;
      }
    }
  }

  &.smokey-bear {
    td div {
      &.sa-1 {
        background-color: #2b83ba;
      }
      &.sa-2 {
        background-color: #abdda4;
      }
      &.sa-3 {
        background-color: #ffffbf;
      }
      &.sa-4 {
        background-color: #fdae61;
      }
      &.sa-5 {
        background-color: #d7191c;
      }
    }
  }

  &.snow-cover {
    td div {
      &.sc-open {
        background-color: rgb(221, 221, 221);
      }
      &.sc-snow {
        background-color: white;
        border: 1px solid #ddd;
      }
    }
  }

  &.relative-flammability {
    td div {
      &.rf-1 {
        background-color: rgba(221, 221, 221, 0.7);
      }
      &.rf-2 {
        background-color: rgb(250, 236, 229);
      }
      &.rf-3 {
        background-color: rgb(234, 140, 121);
      }
      &.rf-4 {
        background-color: rgb(193, 64, 64);
      }
      &.rf-5 {
        background-color: rgb(92, 17, 23);
      }
    }
  }
}
</style>
