<template>
  <div id="app" class="page-container">
    <md-app md-mode="reveal" style="min-height: 100vh;">
      <md-app-toolbar class="md-primary">
        <md-button class="md-icon-button" @click="showNavigation = true">
          <md-icon>menu</md-icon>
        </md-button>
        <span class="md-title">Dashboard</span>
      </md-app-toolbar>

      <md-app-drawer :md-active.sync="showNavigation">
        <md-toolbar class="md-transparent" md-elevation="0">
          <span class="md-title">Account {{auth.id && auth.id.name || ''}}</span>
        </md-toolbar>

        <md-button id="qsLoginBtn" class="md-raised" v-if="!authenticated" @click="login">Log In</md-button>

        <md-button id="qsLogoutBtn" class="md-raised" v-if="authenticated" @click="logout">Log Out</md-button>

        <md-button id="qsSave" class="md-raised" v-if="authenticated" @click="save">Save</md-button>

        <md-button id="qsLoad" class="md-raised" v-if="authenticated" @click="load">Load</md-button>

        <md-toolbar class="md-transparent" md-elevation="0">
          <span class="md-title">Add new dataset</span>
        </md-toolbar>
        <DataSetCreator :hideNavigation="hideNavigation"/>
        <md-toolbar class="md-transparent" md-elevation="0">
          <span class="md-title">Demo scene</span>
        </md-toolbar>
          <br>
          <md-button
            id="qsLoad"
            class="md-raised"
            @click="$store.dispatch('loadFromFirestore', {user: 'auth0|5c75750cde5574341f0e2ffb'})"
          >Load</md-button>
      </md-app-drawer>
      <md-app-content style="min-height: 100vh; margin-top: 64px;">
        <DataSets/>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import DataSets from "./components/DataSets.vue";
import DataSetCreator from "./components/DataSetCreator.vue";
import auth from "./Auth/AuthService";

export default {
  name: "app",
  components: {
    DataSets,
    DataSetCreator
  },
  data() {
    return {
      auth,
      authenticated: auth.authenticated,
      showNavigation: false
    };
  },
  created() {
    auth.authNotifier.on("authChange", authState => {
      this.authenticated = authState.authenticated;
      if (auth.getAuthenticatedFlag() === "true") {
        this.$store.dispatch("loadFromFirestore", { user: auth.sub });
        this.showNavigation = false;
      }
    });

    if (auth.getAuthenticatedFlag() === "true") {
      auth.renewSession();
    }

    auth.handleAuthentication();
  },
  methods: {
    login() {
      auth.login();
    },
    logout() {
      auth.logout();
    },
    hideNavigation() {
      this.showNavigation = false;
    },
    save() {
      this.$store.dispatch("saveToFirestore", { user: auth.sub });
    },
    load() {
      this.$store.dispatch("loadFromFirestore", { user: auth.sub });
      this.showNavigation = false;
    }
  }
};
</script>

<style>
@import url("//fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons");
.md-app,
#app {
  position: absolute;
  top: 0px; /* Header Height */
  bottom: 0px; /* Footer Height */
  width: 100%;
}
</style>
