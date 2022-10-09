const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {info} = require('firebase-functions/logger');

admin.initializeApp();

const createUser = async (user) => {
  const {email: dataEmail, displayName: dataDisplayName} = user;

  const {uid, email, displayName} = await admin.auth().createUser({
    email: dataEmail,
    displayName: dataDisplayName,
  });

  return {uid, email, displayName};
};

const updateUser = async (user) => {
  const {uid, email, displayName} = user;

  await admin.auth().updateUser(uid, {
    email,
    displayName,
  });

  return {uid, email, displayName};
};

const getUserList = async () => {
  const listUsersResult = await admin.auth().listUsers();

  return listUsersResult.users;
};


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
    await admin.auth().deleteUser(uid);

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
      'data': await getUserList(data),
    };
  }

  return {
    'result': 'error',
    'data': [],
    'reason': 'collection not found',
  };
});
