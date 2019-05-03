<template>
  <div>
    <div>
      <md-button class="md-raised">
        <label for="file">
          <div style="padding: 8px 2px">Add file</div>
        </label>
      </md-button>
      <input
        type="file"
        id="file"
        ref="file"
        v-on:change="createVisualizationFromFile()"
        value="File"
        style="opacity: 0"
      >

      <md-button class="md-raised" @click="createDataTimeFetcher()">Fetch time</md-button><br>
      <md-button class="md-raised" @click="createDataSizeFetcher()">Add premade web stats</md-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "DataSetCreator",
  props: ["hideNavigation"],
  data() {
    return {
      file: {},
      files: []
    };
  },

  methods: {
    createVisualization() {
      this.$store.dispatch("getDataSet");
    },
    async createVisualizationFromFile() {
      const reader = new FileReader();
      reader.readAsText(this.$refs.file.files[0]);
      reader.addEventListener("loadend", () => {
        const data = JSON.parse(reader.result);
        this.$store.dispatch("getDataSet", { data });
        this.hideNavigation();
      });
    },
    async createDataTimeFetcher() {
      var data = [["Time", "LoadTime"]];
      this.$store.dispatch("getDataSet", { data, entryFunction: 'loadtime' });
      this.hideNavigation();
    },
    async createDataSizeFetcher() {
      var data = [["Time", "Size"]];
      this.$store.dispatch("getDataSet", { data, entryFunction: 'size' });
      this.hideNavigation();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
