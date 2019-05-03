import auth0 from "auth0-js";
import EventEmitter from "eventemitter3";
var jwt = require("jsonwebtoken");


class AuthService {
  auth0 = new auth0.WebAuth({
    domain: "ohsiha.auth0.com",
    clientID: "TPCs9Xt3jgAnEF4GV9RpXAjWawNJAvLH",
    audience: "https://us-central1-serviceworker-api.cloudfunctions.net/",
    redirectUri: window.location.href.includes('localhost')
      ? "http://localhost:8080/"
      : "https://serviceworker-api.firebaseapp.com/",
    responseType: "token id_token",
    scope: "openid profile email"
  });
  accessToken = localStorage.getItem("accessToken");
  idToken = localStorage.getItem("idToken");
  sub =
    this.idToken && jwt.decode(this.idToken, { complete: true }).payload.sub;
  id = this.idToken && jwt.decode(this.idToken, { complete: true }).payload;
  expiresAt;
  authenticated = this.isAuthenticated();
  authNotifier = new EventEmitter();

  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      }
    });
  }

  setSession(authResult) {
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.expiresAt = authResult.expiresIn * 10000 + new Date().getTime();

    this.authNotifier.emit("authChange", { authenticated: true });

    localStorage.setItem("loggedIn", true);

    //sub.verify through database rules and token header
    const parsed = jwt.decode(authResult.idToken, { complete: true }); 
    this.sub = parsed.payload.sub;
    this.id = parsed.payload;
    localStorage.setItem("idToken", this.idToken);
    localStorage.setItem("accessToken", this.accessToken);
    window.location.href = window.location.origin + window.location.pathname;
  }

  renewSession() {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        //this.logout()
      }
    });
  }

  logout() {
    // Clear access token and ID token from local storage
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = null;
    this.id = null;
    this.sub = null;

    this.userProfile = null;
    this.authNotifier.emit("authChange", false);
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("idToken");
  }

  getAuthenticatedFlag() {
    return localStorage.getItem("loggedIn");
  }

  isAuthenticated() {
    this.accessToken = localStorage.getItem("accessToken");
    this.idToken = localStorage.getItem("idToken");
    return (
      this.getAuthenticatedFlag() === "true" && this.idToken && this.accessToken
    );
  }
}

export default new AuthService();
