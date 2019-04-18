import Vue from "vue";
import Vuex from "vuex";
import App from "./App.vue";
import json from "./assets/Book1.json"
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default-dark.css'
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
import { 
  MdButton, 
  MdContent, 
  MdTabs, 
  MdDrawer,
  MdToolbar,
  MdIcon,
 } from 'vue-material/dist/components'
 import VueMaterial from 'vue-material'

Vue.config.productionTip = false;

Vue.use(Vuex);
Vue.use(MdButton);
Vue.use(MdContent);
Vue.use(MdTabs);
Vue.use(MdDrawer);
Vue.use(MdToolbar);
Vue.use(MdIcon);
Vue.use(VueMaterial);
Vue.component('vue-draggable-resizable', VueDraggableResizable)

const store = new Vuex.Store({
  state: {
    dataSets: [],
  },
  mutations: {
    setVisualizationType(_state, { type, item}) {
      item.chartType = type;
      console.log(item);
    },
    setSize(_state, { size, item}) {
      item.chartOptions.width = size.width; 
      item.chartOptions.height = size.height;
    }
  },
  actions: {
    async getDataSet(context, type) {
          const i = store.state.dataSets.push({
            title: "Static data set",
            data: type.data || json,
            chartType: type.visualizationType || "BarChart",
            entryFunction: type.entryFunction,
            chartOptions: {
              title: "Load times",
              subtitle: "Time, LoadTime",
              height: 50,
              width: 50,
              backgroundColor: "#424242"
            },
          });
          setInterval(
            () => type.entryFunction && 
                    type.entryFunction(store.state.dataSets[i-1].data),
            5000
            )
    }
  }
});

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
