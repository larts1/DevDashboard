import auth0 from 'auth0-js'
import EventEmitter from 'eventemitter3'

class AuthService {
    auth0 = new auth0.WebAuth({
        domain: 'ohsiha.auth0.com',
        clientID: 'TPCs9Xt3jgAnEF4GV9RpXAjWawNJAvLH',
        audience: 'https://us-central1-serviceworker-api.cloudfunctions.net/',
        redirectUri: 'http://localhost:8080/',
        responseType: 'token id_token',
        scope: 'openid profile email'
    })
    accessToken
    idToken
    expiresAt
    authenticated = this.isAuthenticated()
    authNotifier = new EventEmitter()

    login () {
        this.auth0.authorize()
    }

    handleAuthentication () {
    this.auth0.parseHash((err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult)
        }
    })
    }

    setSession (authResult) {
        this.accessToken = authResult.accessToken
        this.idToken = authResult.idToken
        this.expiresAt = authResult.expiresIn * 1000 + new Date().getTime()

        this.authNotifier.emit('authChange', { authenticated: true })

        localStorage.setItem('loggedIn', true)
    }

    renewSession () {
        this.auth0.checkSession({}, (err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
            this.setSession(authResult)
            } else if (err) {
            this.logout()
            }
        })
    }

    logout () {
        // Clear access token and ID token from local storage
        this.accessToken = null
        this.idToken = null
        this.expiresAt = null

        this.userProfile = null
        this.authNotifier.emit('authChange', false)
        localStorage.removeItem('loggedIn')
    }

    getAuthenticatedFlag () {
        return localStorage.getItem('loggedIn')
    }

    isAuthenticated () {
        return new Date().getTime() < this.expiresAt && this.getAuthenticatedFlag() === 'true'
    }
}

export default new AuthService()