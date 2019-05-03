<template>
  <div class="box" @mouseup="setSize()">
    <vue-draggable-resizable
      v-for="(item, index) in dataSets"
      :key="index"
      :w="item.chartOptions.width"
      :h="item.chartOptions.height"
      :x="item.x"
      :y="item.y"
      @dragging="(x, y) => onDrag(x, y, index, item)"
      @resizing="(x, y, width, height) => onResize(x, y, width, height, index, item)"
      :parent="true"
      class="element"
    >
      <h3>{{ item.title }}</h3>
      <button v-on:click="setVisualizationType(item, 'LineChart')">To Line</button>
      <button v-on:click="setVisualizationType(item, 'BarChart')">To Bar</button>
      <GChart :type="item.chartType" :data="item.data" :options="item.chartOptions"/>
    </vue-draggable-resizable>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { GChart } from "vue-google-charts";

export default {
  name: "DataSets",
  computed: mapState(["dataSets"]),
  components: {
    GChart
  },
  data: function() {
    return { items: [] };
  },
  methods: {
    setVisualizationType(item, type) {
      this.$store.commit("setVisualizationType", { item, type });
    },
    setSize() {
      this.items.forEach(item =>
        this.$store.commit("setSize", {
          item: item.item,
          size: { width: item.width - 50, height: item.height - 80 },
          x: item.x,
          y: item.y
        })
      );
    },
    onResize: function(x, y, width, height, index, item) {
      if (this.items[index] == null) this.items[index] = { item };
      this.items[index].x = x;
      this.items[index].y = y;
      this.items[index].chartOptions.width = width;
      this.items[index].chartOptions.height = height;
    },
    onDrag: function(x, y, index, item) {
      if (this.items[index] == null) this.items[index] = { item };
      this.items[index].x = x;
      this.items[index].y = y;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.box {
  min-height: 100vh;
}
</style>
