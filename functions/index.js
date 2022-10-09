const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {info} = require('firebase-functions/logger');

const {
  createUser,
  updateUser,
  deleteUser,
  getUserList,
} = require('./controllers/user');

admin.initializeApp();

exports.createCommon = functions.https.onCall(async (data, context) => {
  const {collection, data: docData} = data;

  if (collection == 'users') {
    const records = await Promise.all(
        docData.map(async (user) => createUser(user)),
    );

    return {
      'result': 'success',
      'data': records,
    };
  }

  return {
    'result': 'error',
  };
});

exports.updateCommon = functions.https.onCall(async (data, context) => {
  const {collection, data: docData} = data;

  if (collection == 'users') {
    const records = await Promise.all(
        docData.map(async (user) => updateUser(user)),
    );

    return {
      'result': 'success',
      'data': records,
    };
  }

  return {
    'result': 'error',
  };
});

exports.deleteCommon = functions.https.onCall(async (data, context) => {
  info('Delete common function is called');

  const {collection, uid} = data;

  if (collection === 'users') {
    await deleteUser(uid);

    return {
      'result': 'success',
    };
  }

  return {
    'result': 'error',
  };
});

exports.listCommon = functions.https.onCall(async (data, context) => {
  info('List common function is called');

  const {collection} = data;

  if (collection === 'users') {
    return {
      'result': 'success',
      'data': await getUserList(),
    };
  }

  return {
    'result': 'error',
    'data': [],
    'reason': 'collection not found',
  };
});
