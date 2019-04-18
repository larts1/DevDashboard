<template>
    <div>
        <div >
          
            <md-button class="md-raised" > <label for="file" ><div style="padding: 8px 2px">Add file</div></label>
            </md-button>
            <input type="file" id="file" ref="file" v-on:change="createVisualizationFromFile()" value="File" style="opacity: 0"/>
          
            <md-button class="md-raised" @click="createDataFetcher()"> Add premade web stats </md-button>

        </div>
    </div>
</template>

<script>
import  axios  from 'axios';

export default {
  name: 'DataSetCreator',
  props: ['hideNavigation'],
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
              this.$store.dispatch("getDataSet", { data });
              this.hideNavigation();
            })
      },
      async createDataFetcher() {
        const getTime = async () => {
          var start = Date.now();
          try { const res = await axios.get('http://127.0.0.1:8080/'); }catch(e) {}
          return Date.now() - start;
        }
        const entryFunction = async (data) => data.push([ new Date(Date.now()).toString().substr(16,8), await getTime() ]);
        var data = [ ["Time", "LoadTime"]];
        await entryFunction(data);
        console.log(data);
        this.$store.dispatch("getDataSet", { data, entryFunction });
        this.hideNavigation();
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
