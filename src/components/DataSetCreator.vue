<template>
    <div>
        <div class="large-12 medium-12 small-12 cell">
        <label>File
            <input type="file" id="file" ref="file" v-on:change="createVisualizationFromFile()"/>
        </label>
        </div>
        <li v-for="(file) in files" :key="file.id">
          <span>{{file.name}}</span>
        </li>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'DataSetCreator',
  computed: mapState(['dataSets']),

    data() {
        return {
            file: {},
            files: [],
        }
    },

  methods: {
      createVisualization() {
          this.$store.dispatch("getDataSet");
      },
      async createVisualizationFromFile() {
          const reader = new FileReader();
          reader.readAsText(this.$refs.file.files[0]);
          reader.addEventListener('loadend', () => {
                const data = JSON.parse(reader.result);
                this.$store.dispatch("getDataSet", {data: data});
              })
      },
  },
}
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
