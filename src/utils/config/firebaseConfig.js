import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyC44si2Y_SRkWS8xvpODaLAm7GgMT35Xl4',
  authDomain: 'shumiq-anime.firebaseapp.com',
  databaseURL: 'https://shumiq-anime.firebaseio.com',
  projectId: 'shumiq-anime',
  storageBucket: 'shumiq-anime.appspot.com',
  messagingSenderId: '557663136777',
  appId: '1:557663136777:web:dcebbea6ee80a6bc',
  clientId:
    '557663136777-f5pcv9r46pipto60jqmepd6btmmlp86f.apps.googleusercontent.com',
  measurementId: 'G-FSM2HG5BPG',
  scopes: [
    'email',
    'profile',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/photoslibrary.readonly',
  ],
};

firebase.initializeApp(firebaseConfig);

export default {
  database: {
    set: (path, value) => {
      firebase.database().ref(path).set(value);
    },
    subscribe: (path, callback) => {
      firebase
        .database()
        .ref(path)
        .on('value', function (snapshot) {
          callback(snapshot);
        });
    },
  },
  auth: {
    subscribe: (callback) => {
      firebase.auth().onAuthStateChanged(function (currentUser) {
        callback(currentUser);
      });
    },
    signIn: (tokenId) => {
      const creds = firebase.auth.GoogleAuthProvider.credential(tokenId);
      firebase.auth().signInWithCredential(creds);
    },
    signOut: () => {
      firebase.auth().signOut();
    },
  },
  storage: {
    backup: 'backup',
    list: async (path) => {
      const list = await firebase.storage().ref(path).listAll();
      let files = [];
      for (const file of list.items) {
        const metadata = await file.getMetadata();
        files.push(metadata);
      }
      return files.sort((a, b) => (a.name < b.name ? -1 : 1));
    },
    create: async (path, fileName, text, metadata) => {
      const response = await firebase
        .storage()
        .ref(path)
        .child(fileName)
        .putString(text, 'raw', metadata);
      return response;
    },
    delete: async (path, fileName) => {
      const response = await firebase
        .storage()
        .ref(path)
        .child(fileName)
        .delete();
      return response;
    },
  },
};
