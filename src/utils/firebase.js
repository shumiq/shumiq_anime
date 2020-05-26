import { setLocalStorage } from './localstorage';
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

export const Database = {
  onFirebaseDatabaseUpdate: (callback) => {
    firebase
      .database()
      .ref()
      .on('value', function (snapshot) {
        const database = snapshot.val()?.database;
        setLocalStorage('database', database);
        callback(database);
      });
  },
  saveAnime: (key, anime) => {
    firebase
      .database()
      .ref('database/animeList/' + key)
      .set(anime);
  },
  saveConan: (conanList) => {
    firebase.database().ref('database/conanList/').set(conanList);
  },
  saveKeyaki: (keyakiList) => {
    firebase.database().ref('database/keyakiList/').set(keyakiList);
  },
};

export const Auth = {
  onFirebaseAuthUpdate: (callback) => {
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
};
