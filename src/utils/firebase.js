import { setLocalStorage, getLocalStorage } from './localstorage';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

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

firebase
  .database()
  .ref()
  .on('value', function (snapshot) {
    let database = snapshot.val();
    setLocalStorage('database', database);
    databaseOnUpdate(database);
  });

firebase.auth().onAuthStateChanged(function (currentUser) {
  const database = getLocalStorage('database');
  databaseOnUpdate(database);
  authUpdate(currentUser);
});

let databaseOnUpdate = () => {};
let authUpdate = () => {};

export const onFirebaseDatabaseUpdate = (callback) => {
  databaseOnUpdate = callback;
};

export const onFirebaseAuthUpdate = (callback) => {
  authUpdate = callback;
};

export const SignIn = (tokenId) => {
  const creds = firebase.auth.GoogleAuthProvider.credential(tokenId);
  firebase
    .auth()
    .signInWithCredential(creds)
    .then((user) => {
      const database = getLocalStorage('database');
      databaseOnUpdate(database);
      authUpdate(user);
    });
};

export const SignOut = () => {
  firebase.auth().signOut();
};

export const SaveAnime = (key, anime) => {
  firebase
    .database()
    .ref('animelist/' + key)
    .set(anime);
};

export const SaveConan = (conanList) => {
  firebase.database().ref('conanlist/').set(conanList);
};
