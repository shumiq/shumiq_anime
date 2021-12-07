import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';
import axios from 'axios';
import { Database } from '../../models/Type';
import LocalStorage from '../../utils/LocalStorage/LocalStorage';

const firebaseCore = {
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

firebase.initializeApp(firebaseCore);

export default {
  database: {
    set: (path: string, value: unknown): void => {
      void firebase.database().ref(path).set(value);
    },
    push: (path: string, value: unknown): void => {
      void firebase.database().ref(path).push(value);
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
      firebase.auth().onAuthStateChanged((user): void => {
        callback();
      });
    },
    signIn: (tokenId: string): void => {
      const creds = firebase.auth.GoogleAuthProvider.credential(tokenId);
      void firebase
        .auth()
        .signInWithCredential(creds)
        .then((result) => {
          result?.user
            ? void result.user.getIdToken().then((idToken) => {
                LocalStorage.set('firebase_id_token', idToken);
              })
            : LocalStorage.remove('firebase_id_token');
        });
    },
    signOut: (): void => {
      LocalStorage.remove('firebase_id_token');
      void firebase.auth().signOut();
    },
  },
  storage: {
    backup: 'backup',
    list: async (
      path: string
    ): Promise<
      {
        name: string;
        timeCreated: number;
        generation: string;
        customMetadata: Record<string, string>;
        data: unknown;
        download: string;
      }[]
    > => {
      const list = await firebase.storage().ref(path).listAll();
      const files: {
        name: string;
        download: string;
        data: unknown;
        generation: string;
        timeCreated: number;
        customMetadata: Record<string, string>;
      }[] = [];
      for (const file of list.items) {
        const metadata = (await file.getMetadata()) as {
          name: string;
          download: string;
          data: unknown;
          generation: string;
          timeCreated: number;
          customMetadata: Record<string, string>;
        };
        metadata.download = (await file.getDownloadURL()) as string;
        metadata.data = (await axios.get(metadata.download)).data as unknown;
        files.push(metadata);
      }
      return files.sort((a, b) => (a.name < b.name ? -1 : 1));
    },
    create: async (
      path: string,
      fileName: string,
      text: string,
      metadata: firebase.storage.UploadMetadata
    ): Promise<void> => {
      await firebase
        .storage()
        .ref(path)
        .child(fileName)
        .putString(text, 'raw', metadata);
    },
    delete: async (path: string, fileName: string): Promise<void> => {
      await firebase.storage().ref(path).child(fileName).delete();
    },
  },
};

export const currentTimestamp = firebase.database.ServerValue.TIMESTAMP;
