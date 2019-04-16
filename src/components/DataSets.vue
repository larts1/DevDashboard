<template>
  <div class="box" @mouseup="setSize()">
        <vue-draggable-resizable :w="100" :h="100"
          v-for="(item, index) in dataSets" :key="index"  
          @dragging="onDrag" 
          @resizing="(x, y, width, height) => onResize(x, y, width, height, index, item)"
          :parent="true" 
          class="element"
        >
          <h3>{{ item.title }}</h3>
          <button v-on:click="setVisualizationType(item, 'LineChart')"> To Line </button>
          <button v-on:click="setVisualizationType(item, 'BarChart')"> To Bar </button>
          <GChart
              :type="item.chartType"
              :data="item.data"
              :options="item.chartOptions"
          />
      </vue-draggable-resizable>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { GChart } from 'vue-google-charts'

export default {
  name: 'DataSets',
  computed: mapState(['dataSets']),
  components: {
      GChart,
  },
  data: function () {
    return {items: []}
  },
  methods: {
      setVisualizationType(item, type, index) {
          this.$store.commit("setVisualizationType", { item, type });
      },
      setSize() {
        this.items.forEach(item =>
          this.$store.commit("setSize", { item: item.item, size: {width: item.width - 50, height: item.height - 80} })
        );
      },
      onResize: function (x, y, width, height, index, item) {
        if (this.items[index] == null) this.items[index] = {item}
        this.items[index].x = x
        this.items[index].y = y
        this.items[index].width = width
        this.items[index].height = height
      },
      onDrag: function (x, y) {
        this.x = x
        this.y = y
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.box {
       position: absolute;
       top: 400px; /* Header Height */
       bottom: 20px; /* Footer Height */
       width: 100%;
}
.element {
}
</style>
