const admin = require('firebase-admin');
const functions = require('firebase-functions');
const express = require('express');
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
var bodyParser = require('body-parser')
var cors = require('cors')
var app = express();

//admin.initializeApp(functions.config().firebase);

var serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://serviceworker-api.firebaseio.com"
});

var db = admin.firestore();
db.settings({timestampsInSnapshots: true});

var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://ohsiha.auth0.com/.well-known/jwks.json"
    }),
    issuer: "https://ohsiha.auth0.com/",
    algorithms: ['RS256']
});

app.use(jwtCheck);
app.use(cors({ origin: true }));
app.use(bodyParser.json());

app.use('/feeds', require('./feeds'));

exports.api = functions.https.onRequest(app);