<template>
  <div id="app">
    <section class="section">
      <MapPlayground></MapPlayground>
    </section>
  </div>
</template>

<style scoped lang="scss">

</style>

<script>
import MapPlayground from "@/components/MapPlayground.vue";

export default {
  name: "App",
  components: {
    MapPlayground
  }
};
</script>
