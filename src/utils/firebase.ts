import { setLocalStorage, getLocalStorage } from './localstorage';
import Firebase from './config/firebaseConfig';
import firebase from 'firebase/app';
import {
  Database as DatabaseType,
  DatabaseStatus,
  Anime,
  Conan,
  Keyaki,
} from './types';

export const Database = {
  subscribe: (callback: (database: DatabaseType) => void): void => {
    Firebase.database.subscribe('/database', (database: DatabaseType): void => {
      setLocalStorage('database', database);
      callback(database);
    });
  },
  status: (): DatabaseStatus => {
    const database = getLocalStorage('database') as DatabaseType;
    if (!database) return {};
    let sumAnime = 0;
    database.animeList.forEach((anime) => {
      if (anime) {
        sumAnime += parseInt(anime.download.toString());
      }
    });
    let sumViewAnime = 0;
    database.animeList.forEach((anime) => {
      if (anime) {
        sumViewAnime += parseInt(anime.view.toString());
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
        view: sumViewAnime,
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
  backup: async (): Promise<firebase.storage.UploadTaskSnapshot> => {
    const database = getLocalStorage('database');
    const fileName = currentDate() + '.json';
    const status = Database.status();
    const metadata: firebase.storage.UploadMetadata = {
      customMetadata: {
        animeSeries: status.anime?.series.toString() || '',
        animeFiles: status.anime?.files.toString() || '',
        animeView: status.anime?.view.toString() || '',
        conanCases: status.conan?.cases.toString() || '',
        conanFiles: status.conan?.files.toString() || '',
        keyakiEpisodes: status.keyaki?.episodes.toString() || '',
        keyakiFiles: status.keyaki?.files.toString() || '',
      },
    };
    const response = await Firebase.storage.create(
      'backup',
      fileName,
      JSON.stringify(database),
      metadata
    );
    return response;
  },
  deleteBackup: async (fileName: string): Promise<unknown> => {
    const res = await Firebase.storage.delete('backup', fileName);
    return res;
  },
  backupFiles: async (): Promise<{ name: string; timeCreated: number }[]> => {
    const response = await Firebase.storage.list('backup');
    return response.reverse();
  },
  runAutoBackup: async (): Promise<boolean> => {
    const autoBackupThreshold = 1000 * 60 * 60 * 24 * 7; // 1 Week
    const currentTime = Date.now();
    const backupFiles = await Database.backupFiles();
    const latestBackup =
      backupFiles.length > 0
        ? new Date(backupFiles[0].timeCreated).getTime()
        : 0;
    const timeDiff = currentTime - latestBackup;
    if (timeDiff > autoBackupThreshold) Database.backup();
    return timeDiff > autoBackupThreshold;
  },
  runAutoDelete: async (): Promise<boolean> => {
    const autoDeleteThreshold = 1000 * 60 * 60 * 24 * 90; // 3 month
    const currentTime = Date.now();
    const backupFiles = await Database.backupFiles();
    backupFiles.forEach((file) => {
      const createdTime = new Date(file.timeCreated).getTime();
      const timeDiff = currentTime - createdTime;
      if (timeDiff > autoDeleteThreshold)
        Firebase.storage.delete('backup', file.name);
    });
    return true;
  },
  update: {
    database: (db: DatabaseType): void => {
      Firebase.database.set('database', db);
    },
    anime: (key: number, anime: Anime): void => {
      Firebase.database.set('database/animeList/' + key, anime);
    },
    conan: (conanList: Conan[]): void => {
      Firebase.database.set('database/conanList/', conanList);
    },
    keyaki: (keyakiList: Keyaki[]): void => {
      Firebase.database.set('database/keyakiList/', keyakiList);
    },
  },
};

export const Auth = {
  subscribe: (callback: () => void): void => {
    Firebase.auth.subscribe(callback);
  },
  signIn: (tokenId: string): void => {
    Firebase.auth.signIn(tokenId);
  },
  signOut: (): void => {
    Firebase.auth.signOut();
  },
};

const currentDate = () => {
  const ts = new Date(Date.now());
  return (
    ts.getFullYear().toString() +
    ('0' + (ts.getMonth() + 1)).slice(-2) +
    ('0' + ts.getDate()).slice(-2)
  );
};
