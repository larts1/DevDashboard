var app = require('express').Router();
const admin = require('firebase-admin');
var db = admin.firestore();

app.get('/', async (req, res) => {
    var user = await db.collection('users').doc(req.user.sub).get();
    var data = user.data();
    res.send(JSON.stringify(data));
  });
  
  app.post('/', async (req, res) => {
    db.collection('users').doc(req.user.sub).set({
      feeds: admin.firestore.FieldValue.arrayUnion({
        url: req.body.url,
        type: req.body.type,
      })
    }, {merge: true});
    res.send(JSON.stringify(req.user));
  });
  
  app.delete('/', async (req, res) => {
    db.collection('users').doc(req.user.sub).set({
      feeds: admin.firestore.FieldValue.arrayRemove({
        url: req.body.url,
        type: req.body.type,
      })
    }, {merge: true});
    res.send('Removed');
  });

  module.exports = app;