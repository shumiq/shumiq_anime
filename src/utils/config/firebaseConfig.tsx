import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';
import axios from 'axios';
import { Database } from '../types';

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
    set: (path: string, value: unknown): void => {
      void firebase.database().ref(path).set(value);
    },
    subscribe: (path: string, callback: (database: Database) => void): void => {
      firebase
        .database()
        .ref(path)
        .on('value', (snapshot: firebase.database.DataSnapshot): void => {
          callback(snapshot.val() as Database);
        });
    },
  },
  auth: {
    subscribe: (callback: () => void): void => {
      firebase.auth().onAuthStateChanged((): void => {
        callback();
      });
    },
    signIn: (tokenId: string): void => {
      const creds = firebase.auth.GoogleAuthProvider.credential(tokenId);
      void firebase.auth().signInWithCredential(creds);
    },
    signOut: (): void => {
      void firebase.auth().signOut();
    },
  },
  storage: {
    backup: 'backup',
    list: async (
      path: string
    ): Promise<{ name: string; timeCreated: number }[]> => {
      const list = await firebase.storage().ref(path).listAll();
      const files: {
        name: string;
        download: string;
        data: unknown;
        timeCreated: number;
      }[] = [];
      for (const file of list.items) {
        const metadata = (await file.getMetadata()) as {
          name: string;
          download: string;
          data: unknown;
          timeCreated: number;
        };
        metadata.download = (await file.getDownloadURL()) as string;
        metadata.data = (await axios.get(metadata.download)).data as unknown;
        files.push(metadata);
      }
      return files.sort((a, b) => (a.name < b.name ? -1 : 1));
    },
    create: (
      path: string,
      fileName: string,
      text: string,
      metadata: firebase.storage.UploadMetadata
    ): void => {
      void firebase
        .storage()
        .ref(path)
        .child(fileName)
        .putString(text, 'raw', metadata);
    },
    delete: (path: string, fileName: string): void => {
      void firebase.storage().ref(path).child(fileName).delete();
    },
  },
};
