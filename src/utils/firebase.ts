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
import {
  validateDatabase,
  validateAnime,
  validateConan,
  validateKeyaki,
} from './validation';

export const Database = {
  subscribe: (callback: (database: DatabaseType) => void): void => {
    Firebase.database.subscribe('/database', (database: DatabaseType): void => {
      setLocalStorage('database', database);
      callback(getLocalStorage('database') as DatabaseType);
    });
  },
  status: (): DatabaseStatus => {
    const database = getLocalStorage('database') as DatabaseType;
    if (!database) return {};
    let sumAnime = 0;
    database.animeList.forEach((anime) => {
      if (anime) {
        sumAnime += anime.download;
      }
    });
    let sumViewAnime = 0;
    database.animeList.forEach((anime) => {
      if (anime) {
        sumViewAnime += anime.view;
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
  backup: (): void => {
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
    Firebase.storage.create(
      'backup',
      fileName,
      JSON.stringify(database),
      metadata
    );
  },
  deleteBackup: (fileName: string): void => {
    Firebase.storage.delete('backup', fileName);
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
      try {
        Firebase.database.set('database', validateDatabase(db));
      } catch (error) {
        console.error('Update database failed: Database has invalid format');
        console.error(error);
      }
    },
    anime: (key: number, anime: Anime | null): void => {
      try {
        Firebase.database.set(
          'database/animeList/' + key.toString(),
          validateAnime(anime)
        );
      } catch (error) {
        console.error('Update anime failed: Anime has invalid format');
        console.error(error);
      }
    },
    conan: (conanList: Conan[]): void => {
      try {
        Firebase.database.set(
          'database/conanList/',
          conanList.map((conan) => validateConan(conan))
        );
      } catch (error) {
        console.error('Update conan failed: Conan has invalid format');
        console.error(error);
      }
    },
    keyaki: (keyakiList: Keyaki[]): void => {
      try {
        Firebase.database.set(
          'database/keyakiList/',
          keyakiList.map((keyaki) => validateKeyaki(keyaki))
        );
      } catch (error) {
        console.error('Update keyaki failed: Keyaki has invalid format');
      }
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
    ('0' + (ts.getMonth() + 1).toString()).slice(-2) +
    ('0' + ts.getDate().toString()).slice(-2)
  );
};
