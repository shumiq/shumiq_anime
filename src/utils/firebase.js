import { setLocalStorage, getLocalStorage } from './localstorage';
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
  status: () => {
    const database = getLocalStorage('database');
    if (!database) return {};
    let sumAnime = 0;
    database.animeList.forEach((anime) => {
      if (anime) {
        sumAnime += parseInt(anime.download);
      }
    });
    let sumConan = 0;
    database.conanList.forEach((conan) => {
      if (conan) {
        sumConan += Object.keys(conan.episodes).length;
      }
    });
    let sumKeyaki = 0;
    database.keyakiList.forEach((keyaki) => {
      if (keyaki) {
        sumKeyaki += Object.keys(keyaki.sub).length;
      }
    });
    return {
      anime: {
        series: database.animeList.filter((anime) => anime != null).length,
        files: sumAnime,
      },
      conan: {
        cases: database.conanList.filter((conan) => conan != null).length,
        files: sumConan,
      },
      keyaki: {
        episodes: database.keyakiList.filter((keyaki) => keyaki != null).length,
        files: sumKeyaki,
      },
    };
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

export const Storage = {
  root: firebase.storage().ref('backup'),
  listBackup: async () => {
    const list = await Storage.root.listAll();
    let files = [];
    for (const file of list.items) {
      const metadata = await file.getMetadata();
      files.push(metadata);
    }
    return files.sort((a, b) => (a.name > b.name ? -1 : 1));
  },
  backup: async () => {
    const database = getLocalStorage('database');
    const fileName = Storage.currentDate() + '.json';
    const status = Database.status();
    const metadata = {
      customMetadata: {
        animeSeries: status.anime.series,
        animeFiles: status.anime.files,
        conanCases: status.conan.cases,
        conanFiles: status.conan.files,
        keyakiEpisodes: status.keyaki.episodes,
        keyakiFiles: status.keyaki.files,
      },
    };
    await Storage.root
      .child(fileName)
      .putString(JSON.stringify(database), 'raw', metadata);
  },
  currentDate: () => {
    const ts = new Date(Date.now());
    return (
      ts.getFullYear().toString() +
      ('0' + (ts.getMonth() + 1)).slice(-2) +
      ('0' + ts.getDate()).slice(-2)
    );
  },
  autoBackup: async () => {
    const backupThreshold = 1000 * 60 * 60 * 24 * 7; // 1 Week
    const currentTime = Date.now();
    const backupFiles = await Storage.listBackup();
    const latestBackup =
      backupFiles.length > 0
        ? new Date(backupFiles[0].timeCreated).getTime()
        : 0;
    const timeDiff = currentTime - latestBackup;
    if (timeDiff > backupThreshold) Storage.backup();
  },
};
