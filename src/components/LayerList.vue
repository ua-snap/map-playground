<template>
  <div>
    <h3 class="title is-4 top">Mean Annual Ground Temperature</h3>
    <ul>
      <li>
        <map-layer id="1mgipl2050"></map-layer>
      </li>
      <li>
        <map-layer id="1mgipl2010"></map-layer>
      </li>
      <li>
        <map-layer id="3mgipl2050"></map-layer>
      </li>
      <li>
        <map-layer id="3mgipl2010"></map-layer>
      </li>
      <li>
        <map-layer id="5mgipl2050"></map-layer>
      </li>
      <li>
        <map-layer id="5mgipl2010"></map-layer>
      </li>
      <li>
        <map-layer id="obumagt"></map-layer>
      </li>
    </ul>
    <h3 class="title is-4 top">Active Layer Thickness</h3>
    <ul>
      <li>
        <map-layer id="altGIPL2010"></map-layer>
      </li>
      <li>
        <map-layer id="altGIPL2050"></map-layer>
      </li>
    </ul>
    <h3 class="title is-4 top">Permafrost Extent</h3>
    <ul>
      <li>
        <map-layer id="pfextent_jorgenson"></map-layer>
      </li>
      <li>
        <map-layer id="pfextent_obu"></map-layer>
      </li>
    </ul>
    <h3 class="title is-4 top">Ground Ice Volume</h3>
    <ul>
      <li>
        <map-layer id="icevol_jorgenson"></map-layer>
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
