import Vue from "vue";
import Vuex from "vuex";
import App from "./App.vue";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default-dark.css";
import VueDraggableResizable from "vue-draggable-resizable";
import "vue-draggable-resizable/dist/VueDraggableResizable.css";
import VueMaterial from "vue-material";
import * as firebase from "firebase/firebase";
import { GetData } from "./Fetchers/index";
import "firebase/firestore";
firebase.initializeApp({
  apiKey: "AIzaSyABRzaPWL11qz4yo2qguqGNJg-2W9BuVv0",
  authDomain: "serviceworker-api.firebaseapp.com",
  databaseURL: "https://serviceworker-api.firebaseio.com",
  projectId: "serviceworker-api",
  storageBucket: "serviceworker-api.appspot.com",
  messagingSenderId: "285161532242",
  appId: "1:285161532242:web:77dc7d26ea3bea93"
});

var db = firebase.firestore();

Vue.config.productionTip = false;

Vue.use(Vuex);
Vue.use(VueMaterial);
Vue.component("vue-draggable-resizable", VueDraggableResizable);

const store = new Vuex.Store({
  state: {
    dataSets: []
  },
  mutations: {
    setVisualizationType(_state, { type, item }) {
      item.chartType = type;
    },
    deleteSet(state, set) {
      const index = state.dataSets.findIndex(
        dset => set.x === dset.x && set.y === dset.y
      );
      state.dataSets.splice(index, 1);
    }
  },
  actions: {
    async getDataSet(_context, type) {
      const i = store.state.dataSets.push({
        id: type.id || 0,
        title: type.title || "Static data set",
        data: type.data || JSON.parse(type.initData).d,
        initData: type.initData,
        chartType: type.visualizationType || "BarChart",
        entryFunction: type.entryFunction,
        topBar: false,
        chartOptions: {
          height: type.height - 80,
          width: "96%",
          backgroundColor: "#424242",
          legend: "none",
          chartArea: {
            width: "96%",
            height: type.height - 80
          }
        },
        options: type.options,
        x: type.x || 50,
        y: type.y || 150,
        height: type.width || "100",
        width: type.height || "100"
      });
      setInterval(
        () =>
          type.entryFunction &&
          GetData(
            type.entryFunction,
            store.state.dataSets[i - 1].data,
            JSON.parse(store.state.dataSets[i - 1].options)
          ),
        5000
      );
    },
    async saveToFirestore(context, { user }) {
      (await db
        .collection("datasets")
        .where("user", "==", user)
        .get()).forEach(set => set.ref.delete());
      store.state.dataSets.forEach(async set => {
        const ref = await db.collection("datasets").add({
          title: set.title,
          x: set.x,
          y: set.y,
          user: user || "anon",
          width: set.width,
          height: set.height,
          visualizationType: set.chartType,
          options: set.options,
          initData: set.initData,
          entryFunction: set.entryFunction || false
        });
        set.id = ref.id;
      });
    },
    async loadFromFirestore(context, { user }) {
      store.state.dataSets = [];
      const sets = await db
        .collection("datasets")
        .where("user", "==", user)
        .get();

      sets.forEach(set => {
        const data = set.data();
        context.dispatch("getDataSet", {
          id: set.id,
          ...data
        });
      });
    }
  }
});

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
