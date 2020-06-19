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
      setLocalStorage('database', validateDatabase(database));
      callback(getLocalStorage('database') as DatabaseType);
    });
  },
  status: (): DatabaseStatus => {
    const database = getLocalStorage('database') as DatabaseType;
    if (!database) return {};
    let sumAnime = 0;
    Object.keys(database.animeList).forEach((key) => {
      if (database.animeList[key]) {
        sumAnime += database.animeList[key].download;
      }
    });
    let sumViewAnime = 0;
    Object.keys(database.animeList).forEach((key) => {
      if (database.animeList[key]) {
        sumViewAnime += database.animeList[key].view;
      }
    });
    let sumConan = 0;
    Object.keys(database.conanList).forEach((key) => {
      if (database.conanList[key]) {
        sumConan += Object.keys(database.conanList[key].episodes).length;
      }
    });
    let sumKeyaki = 0;
    Object.keys(database.keyakiList).forEach((key) => {
      if (database.keyakiList[key]) {
        sumKeyaki += Object.keys(database.keyakiList[key].sub).length;
      }
    });
    return {
      anime: {
        series: Object.keys(database.animeList).length,
        files: sumAnime,
        view: sumViewAnime,
      },
      conan: {
        cases: Object.keys(database.conanList).length,
        files: sumConan,
      },
      keyaki: {
        episodes: Object.keys(database.keyakiList).length,
        files: sumKeyaki,
      },
    };
  },
  backup: async (): Promise<void> => {
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
    await Firebase.storage.create(
      'backup',
      fileName,
      JSON.stringify(database),
      metadata
    );
  },
  deleteBackup: async (fileName: string): Promise<void> => {
    await Firebase.storage.delete('backup', fileName);
  },
  backupFiles: async (): Promise<
    {
      name: string;
      timeCreated: number;
      generation: string;
      customMetadata: Record<string, string>;
      data: unknown;
      download: string;
    }[]
  > => {
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
    if (timeDiff > autoBackupThreshold) void Database.backup();
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
        void Firebase.storage.delete('backup', file.name);
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
    anime: (key: string, anime: Anime | null): void => {
      try {
        Firebase.database.set(
          'database/animeList/' + key,
          anime ? validateAnime(anime) : null
        );
      } catch (error) {
        console.error('Update anime failed: Anime has invalid format');
        console.error(error);
      }
    },
    conan: (conanList: Record<string, Conan>): void => {
      Object.keys(conanList).forEach((key) => {
        conanList[key] = validateConan(conanList[key]);
      });
      try {
        Firebase.database.set('database/conanList/', conanList);
      } catch (error) {
        console.error('Update conan failed: Conan has invalid format');
        console.error(error);
      }
    },
    keyaki: (keyakiList: Record<string, Keyaki>): void => {
      Object.keys(keyakiList).forEach((key) => {
        keyakiList[key] = validateKeyaki(keyakiList[key]);
      });
      try {
        Firebase.database.set('database/keyakiList/', keyakiList);
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
