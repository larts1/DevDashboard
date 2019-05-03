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

      <md-button
        class="md-raised"
        @click="showAndSet(createDataTimeFetcher, 'Page load time fetcher')"
      >Fetch time</md-button>
      <br>
      <md-button class="md-raised" @click="showAndSet(createDataSizeFetcher, 'Page size')">Page size</md-button>
      <br>
      <md-button
        class="md-raised"
        @click="showAndSet(createStatusFetcher, 'Page status')"
      >Page status</md-button>

      <md-dialog :md-active.sync="showDialog">
        <md-dialog-title>{{DialogTitle}}</md-dialog-title>
        <md-field style="margin-left: 15px;">
          <label for="Title">Title</label>
          <md-input name="Title" id="Title" v-model="Title"/>
        </md-field>
        <md-field style="margin-left: 15px;">
          <label for="URL">URL</label>
          <md-input name="URL" id="URL" v-model="URL"/>
        </md-field>
        <md-dialog-actions>
          <md-button class="md-primary" @click="showDialog = false">Close</md-button>
          <md-button class="md-primary" @click="func">Save</md-button>
        </md-dialog-actions>
      </md-dialog>
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
      files: [],
      showDialog: false,
      DialogTitle: "",
      Title: "Dataset",
      URL: "https://serviceworker-api.firebaseapp.com/",
      func: () => {}
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
      this.$store.dispatch("getDataSet", {
        initData: JSON.stringify({ d: [["Time", "LoadTime"]] }),
        entryFunction: "loadtime",
        options: JSON.stringify({ url: this.URL }),
        title: this.Title
      });
      this.hideNavigation();
      this.showDialog = false;
    },
    async createDataSizeFetcher() {
      this.$store.dispatch("getDataSet", {
        initData: JSON.stringify({ d: [["Time", "LoadTime"]] }),
        entryFunction: "size",
        options: JSON.stringify({ url: this.URL }),
        title: this.Title
      });
      this.hideNavigation();
      this.showDialog = false;
    },
    async createStatusFetcher() {
      this.$store.dispatch("getDataSet", {
        initData: JSON.stringify({ d: [["Status", "Count"]] }),
        entryFunction: "status",
        options: JSON.stringify({ url: this.URL }),
        legend: 'none',
        title: this.Title
      });
      this.hideNavigation();
      this.showDialog = false;
    },
    async showAndSet(func, title) {
      this.showDialog = true;
      this.func = func;
      this.DialogTitle = title;
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
