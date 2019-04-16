<template>
  <div id="app">
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <button
            id="qsLoginBtn"
            class="btn btn-primary btn-margin"
            v-if="!authenticated"
            @click="login">
              Log In
          </button>

          <button
            id="qsLogoutBtn"
            class="btn btn-primary btn-margin"
            v-if="authenticated"
            @click="logout">
              Log Out
          </button>

        </div>
      </div>
    </nav>
    <DataSetCreator />
    <DataSets />
  </div>
</template>

<script>
import DataSets from './components/DataSets.vue'
import DataSetCreator from './components/DataSetCreator.vue'
import auth from './Auth/AuthService'

export default {
  name: 'app',
  components: {
    DataSets,
    DataSetCreator
  },
  data () {
    return {
      auth,
      authenticated: auth.authenticated
    }
  },
  created () {
    auth.authNotifier.on('authChange', authState => {
      this.authenticated = authState.authenticated
    })

    if (auth.getAuthenticatedFlag() === 'true') {
      auth.renewSession()
    }

    auth.handleAuthentication()
  },
  methods: {
    login () { auth.login() },
    logout () { auth.logout() }
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
