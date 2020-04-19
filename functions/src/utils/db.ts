import * as admin from 'firebase-admin';

const firestore = admin.initializeApp().firestore();

firestore.settings({
  timestampsInSnapshots: true
});

export default firestore;