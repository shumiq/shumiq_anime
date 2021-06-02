import {
  setLocalStorage,
  getLocalStorage,
} from '../../utils/LocalStorage/LocalStorage';
import Firebase from './FirebaseCore';
import firebase from 'firebase/app';
import {
  Database as DatabaseType,
  DatabaseStatus,
  Anime,
  Conan,
  Keyaki,
  Sakura,
} from '../../models/Type';
import {
  validateDatabase,
  validateAnime,
  validateConan,
  validateKeyaki,
  validateSakura,
} from '../../utils/Validation';

const databasePath = 'myanimelist_database';

export const Database = {
  subscribe: (callback: (database: DatabaseType) => void): void => {
    Firebase.database.subscribe(
      '/' + databasePath,
      (database: DatabaseType): void => {
        setLocalStorage('database', validateDatabase(database));
        callback(getLocalStorage('database') as DatabaseType);
      }
    );
  },
  status: (database: DatabaseType): DatabaseStatus => {
    let sumAnime = 0;
    Object.keys(database.anime).forEach((key) => {
      if (database.anime[key]) {
        sumAnime += database.anime[key].download;
      }
    });
    let sumViewAnime = 0;
    Object.keys(database.anime).forEach((key) => {
      if (database.anime[key]) {
        sumViewAnime += database.anime[key].view;
      }
    });
    let sumConan = 0;
    Object.keys(database.conan).forEach((key) => {
      if (database.conan[key]) {
        sumConan += Object.keys(database.conan[key].episodes).length;
      }
    });
    let sumKeyaki = 0;
    Object.keys(database.keyaki).forEach((key) => {
      if (database.keyaki[key]) {
        sumKeyaki += Object.keys(database.keyaki[key].sub).length;
      }
    });
    let sumSakura = 0;
    Object.keys(database.sakura).forEach((key) => {
      if (database.sakura[key]) {
        sumSakura += Object.keys(database.sakura[key].sub).length;
      }
    });
    return {
      anime: {
        series: Object.keys(database.anime).length,
        files: sumAnime,
        view: sumViewAnime,
      },
      conan: {
        cases: Object.keys(database.conan).length,
        files: sumConan,
      },
      keyaki: {
        episodes: Object.keys(database.keyaki).length,
        files: sumKeyaki,
      },
      sakura: {
        episodes: Object.keys(database.sakura).length,
        files: sumSakura,
      },
    };
  },
  backup: async (database: DatabaseType): Promise<void> => {
    const fileName = currentDate() + '.json';
    const status = Database.status(database);
    const metadata: firebase.storage.UploadMetadata = {
      customMetadata: {
        animeSeries: status.anime?.series.toString() || '',
        animeFiles: status.anime?.files.toString() || '',
        animeView: status.anime?.view.toString() || '',
        conanCases: status.conan?.cases.toString() || '',
        conanFiles: status.conan?.files.toString() || '',
        keyakiEpisodes: status.keyaki?.episodes.toString() || '',
        keyakiFiles: status.keyaki?.files.toString() || '',
        sakuraEpisodes: status.sakura?.episodes.toString() || '',
        sakuraFiles: status.sakura?.files.toString() || '',
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
  // runAutoBackup: async (): Promise<boolean> => {
  //   const autoBackupInterval = 1000 * 60 * 60 * 24 * 14; // 2 Week
  //   const currentTime = Date.now();
  //   let latestBackup = Number(getLocalStorage('last_backup')) || 0;
  //   if (latestBackup === 0) {
  //     const backupFiles = await Database.backupFiles();
  //     latestBackup =
  //       backupFiles.length > 0
  //         ? new Date(backupFiles[0].timeCreated).getTime()
  //         : 0;
  //     setLocalStorage('last_backup', latestBackup);
  //   }
  //   const timeDiff = currentTime - latestBackup;
  //   if (timeDiff > autoBackupInterval) {
  //     void (await Database.backup());
  //     setLocalStorage('last_backup', currentTime);
  //   }
  //   return timeDiff > autoBackupInterval;
  // },
  // runAutoDelete: async (): Promise<boolean> => {
  //   const autoDeleteInterval = 1000 * 60 * 60 * 24 * 30; // 1 month
  //   const currentTime = Date.now();
  //   let backupFiles = [] as {
  //     name: string;
  //     timeCreated: number;
  //     generation: string;
  //     customMetadata: Record<string, string>;
  //     data: unknown;
  //     download: string;
  //   }[];
  //   let oldestBackup = Number(getLocalStorage('oldest_backup')) || 0;
  //   if (oldestBackup === 0) {
  //     backupFiles = await Database.backupFiles();
  //     oldestBackup =
  //       backupFiles.length > 0
  //         ? new Date(backupFiles[backupFiles.length - 1].timeCreated).getTime()
  //         : 0;
  //     setLocalStorage('oldest_backup', oldestBackup);
  //   }
  //   const timeDiff = currentTime - oldestBackup;
  //   if (timeDiff > autoDeleteInterval) {
  //     if (backupFiles.length === 0) backupFiles = await Database.backupFiles();
  //     for (const file of backupFiles) {
  //       const createdTime = new Date(file.timeCreated).getTime();
  //       const timeDiff = currentTime - createdTime;
  //       if (timeDiff > autoDeleteInterval) {
  //         void (await Firebase.storage.delete('backup', file.name));
  //       } else {
  //         setLocalStorage('oldest_backup', createdTime);
  //       }
  //     }
  //   }
  //   return true;
  // },
  add: {
    anime: (anime: Anime): void => {
      try {
        Firebase.database.push(databasePath + '/anime/', validateAnime(anime));
      } catch (error) {
        console.error('Push anime failed: Anime has invalid format');
        console.error(error);
      }
    },
    conan: (conan: Conan): void => {
      try {
        Firebase.database.push(databasePath + '/conan/', validateConan(conan));
      } catch (error) {
        console.error('Push conan failed: Conan has invalid format');
        console.error(error);
      }
    },
    keyaki: (keyaki: Keyaki): void => {
      try {
        Firebase.database.push(
          databasePath + '/keyaki/',
          validateKeyaki(keyaki)
        );
      } catch (error) {
        console.error('Push keyaki failed: Keyaki has invalid format');
        console.error(error);
      }
    },
    sakura: (sakura: Sakura): void => {
      try {
        Firebase.database.push(
          databasePath + '/sakura/',
          validateSakura(sakura)
        );
      } catch (error) {
        console.error('Push sakura failed: Sakura has invalid format');
        console.error(error);
      }
    },
  },
  update: {
    database: (db: DatabaseType): void => {
      try {
        Firebase.database.set(databasePath, validateDatabase(db));
        // tempNewDatabaseOperation(db);
      } catch (error) {
        console.error('Update database failed: Database has invalid format');
        console.error(error);
      }
    },
    anime: (key: string, anime: Anime | null): void => {
      try {
        Firebase.database.set(
          databasePath + '/anime/' + key,
          anime ? validateAnime(anime) : null
        );
      } catch (error) {
        console.error('Update anime failed: Anime has invalid format');
        console.error(error);
      }
    },
    conan: (key: string, conan: Conan): void => {
      try {
        Firebase.database.set(
          databasePath + '/conan/' + key,
          conan ? validateConan(conan) : null
        );
      } catch (error) {
        console.error('Update conan failed: Conan has invalid format');
        console.error(error);
      }
    },
    keyaki: (key: string, keyaki: Keyaki): void => {
      try {
        Firebase.database.set(
          databasePath + '/keyaki/' + key,
          keyaki ? validateKeyaki(keyaki) : null
        );
      } catch (error) {
        console.error('Update keyaki failed: Keyaki has invalid format');
        console.error(error);
      }
    },
    sakura: (key: string, sakura: Sakura): void => {
      try {
        Firebase.database.set(
          databasePath + '/sakura/' + key,
          sakura ? validateSakura(sakura) : null
        );
      } catch (error) {
        console.error('Update sakura failed: Sakura has invalid format');
        console.error(error);
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
