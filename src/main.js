import Vue from "vue";
import Vuex from "vuex";
import App from "./App.vue";
import json from "./assets/Book1.json"
import 'bootstrap/dist/css/bootstrap.min.css'
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'

Vue.config.productionTip = false;

Vue.use(Vuex);
Vue.component('vue-draggable-resizable', VueDraggableResizable)

const store = new Vuex.Store({
  state: {
    dataSets: [],
  },
  mutations: {
    setVisualizationType(_state, { type, item}) {
      item.chartType = type; 
    },
    setSize(_state, { size, item}) {
      item.chartOptions.width = size.width; 
      item.chartOptions.height = size.height;
    }
  },
  actions: {
    async getDataSet(context, type) {
          store.state.dataSets.push({
            title: "Static data set",
            data: type.data || json,
            chartType: type.visualizationType || "BarChart",
            chartOptions: {
              title: "Load times",
              subtitle: "Time, LoadTime",
              height: 50,
              width: 50
            }
          });
    }
  }
});

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
