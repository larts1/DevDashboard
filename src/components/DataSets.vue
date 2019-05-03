<template>
  <div class="box">
    <vue-draggable-resizable
      v-for="(item, index) in dataSets"
      :key="index"
      :w="parseInt(item.width)"
      :h="parseInt(item.height)"
      :x="item.x"
      :y="item.y"
      @dragging="(x, y) => onDrag(x, y, index, item)"
      @resizing="(x, y, width, height) => onResize(x, y, width, height, index, item)"
      :parent="true"
      class="element"
    >

        <h3 >
          {{ item.title }}
          <md-button v-on:click="deleteItem(index)" style="float:right">delete</md-button>
        </h3>
        <button v-on:click="setVisualizationType(item, 'LineChart')">To Line</button>
        <button v-on:click="setVisualizationType(item, 'BarChart')">To Bar</button>
        <button v-on:click="setVisualizationType(item, 'PieChart')">To Pie</button>

      <GChart :type="item.chartType" :data="item.data" :options="item.chartOptions"/><br>
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
    onResize: function(x, y, width, height, index, item) {
      item.x = x;
      item.y = y;
      item.width = width;
      item.height = height;
      item.chartOptions.height = height - 80;
      item.chartOptions.chartArea.height = height - 80;
    },
    onDrag: function(x, y, index, item) {
      item.x = x;
      item.y = y;
    },
    deleteItem(index) {
      this.$store.commit("deleteSet", index);
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
