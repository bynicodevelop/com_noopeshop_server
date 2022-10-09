const admin = require('firebase-admin');
const {info} = require('firebase-functions/logger');

const createUser = async (user) => {
  const {
    email: dataEmail,
    displayName: dataDisplayName,
    photoURL: dataPhotoURL,
  } = user;

  info('createUser', user);

  const {uid, email, displayName} = await admin.auth().createUser({
    email: dataEmail,
    displayName: dataDisplayName,
    photoURL: dataPhotoURL,
  });

  return {uid, email, displayName};
};

const updateUser = async (user) => {
  const {uid, email, displayName} = user;

  info('updateUser', user);

  await admin.auth().updateUser(uid, {
    email,
    displayName,
  });

  return {uid, email, displayName};
};

const deleteUser = async (uid) => {
  info('deleteUser', {uid});

  await admin.auth().deleteUser(uid);
};

const getUserList = async () => {
  const listUsersResult = await admin.auth().listUsers();

  return listUsersResult.users.map((userRecord) => ({
    uid: userRecord.uid,
    email: userRecord.email,
    displayName: userRecord.displayName,
    photoURL: userRecord.photoURL,
  }));
};

exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.getUserList = getUserList;
