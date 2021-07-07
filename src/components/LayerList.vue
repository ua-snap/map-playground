<template>
  <div>
    <h3 class="title is-4 top">Layers</h3>
    <ul>
      <li>
        <map-layer id="a42bed"></map-layer>
      </li>
      <li>
        <map-layer id="alaska_landcover_2015"></map-layer>
      </li>
    </ul>
  </div>
</template>

<script>
import MapLayer from "./MapLayer";

export default {
  name: "LayerList",
  components: {
    "map-layer": MapLayer
  }
};
</script>

<style lang="scss" scoped>
ul {
  font-size: 120%;
}
h3.is-4 {
  font-size: 150%;
  margin: 2rem 0 0.5rem;
  &.top {
    margin-top: 0;
  }
}
</style>
