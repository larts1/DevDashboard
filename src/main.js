import Vue from "vue";
import Vuex from "vuex";
import App from "./App.vue";
import json from "./assets/Book1.json";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default-dark.css";
import VueDraggableResizable from "vue-draggable-resizable";
import "vue-draggable-resizable/dist/VueDraggableResizable.css";
import VueMaterial from "vue-material";
import worker from "./Worker";
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
async function startSub() {
  const subscription = await worker(store);
  db.collection("users")
    .doc("anon")
    .set({
      subscription: subscription.endpoint
    });
}
startSub();

const store = new Vuex.Store({
  state: {
    dataSets: []
  },
  mutations: {
    setVisualizationType(_state, { type, item }) {
      item.chartType = type;
    },
    setSize(_state, { size, item, x, y }) {
      item.chartOptions.width = size.width;
      item.chartOptions.height = size.height;
      item.x = x;
      item.y = y;

    }
  },
  actions: {
    async getDataSet(_context, type) {
      const i = store.state.dataSets.push({
        id: type.id || 0,
        title: type.title || "Static data set",
        data: type.data || json,
        chartType: type.visualizationType || "BarChart",
        entryFunction: type.entryFunction,
        chartOptions: {
          title: "Load times",
          subtitle: "Time, LoadTime",
          height: type.width || 50,
          width: type.height || 50,
          backgroundColor: "#424242"
        },
        x: type.x || 0,
        y: type.y || 0
      });
      setInterval(
        () =>
          type.entryFunction &&
          GetData(type.entryFunction, store.state.dataSets[i - 1].data),
        5000
      );
    },
    async saveToFirestore(context, { user }) {
      var db = firebase.firestore();
      store.state.dataSets.forEach(async set => {
        if (set.id == 0) {
          const ref = await db.collection("datasets").add({
            title: set.title,
            x: set.x,
            y: set.y,
            user: user || "anon",
            width: set.chartOptions.width,
            height: set.chartOptions.height,
            chartType: set.chartType,
            entryFunction: set.entryFunction || false
          });
          set.id = ref.id;
        } else {
          await db
            .collection("datasets")
            .doc(set.id)
            .update({
              title: set.title,
              x: set.x,
              y: set.y,
              user: user || "anon",
              width: set.chartOptions.width,
              height: set.chartOptions.height,
              chartType: set.chartType,
              entryFunction: set.entryFunction || false
            });
        }
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
          entryFunction: eval(data.entryFunction),
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
