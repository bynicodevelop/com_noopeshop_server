const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.createUser = functions.https.onCall((data, context) => {
  return admin.auth().createUser(data);
});

