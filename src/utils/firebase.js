import { setLocalStorage, getLocalStorage } from './localstorage';
import Firebase from './config/firebaseConfig';

export const Database = {
  subscribe: (callback) => {
    Firebase.database.subscribe('/database', (snapshot) => {
      const database = snapshot.val();
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
    let sumViewAnime = 0;
    database.animeList.forEach((anime) => {
      if (anime) {
        sumViewAnime += parseInt(anime.view);
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
  backup: async () => {
    const database = getLocalStorage('database');
    const fileName = currentDate() + '.json';
    const status = Database.status();
    const metadata = {
      customMetadata: {
        animeSeries: status.anime.series,
        animeFiles: status.anime.files,
        animeView: status.anime.view,
        conanCases: status.conan.cases,
        conanFiles: status.conan.files,
        keyakiEpisodes: status.keyaki.episodes,
        keyakiFiles: status.keyaki.files,
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
  deleteBackup: async (fileName) => {
    await Firebase.storage.delete('backup', fileName);
  },
  backupFiles: async () => {
    const response = await Firebase.storage.list('backup');
    return response.reverse();
  },
  runAutoBackup: async () => {
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
  runAutoDelete: async () => {
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
    database: (db) => {
      Firebase.database.set('database', db);
    },
    anime: (key, anime) => {
      Firebase.database.set('database/animeList/' + key, anime);
    },
    conan: (conanList) => {
      Firebase.database.set('database/conanList/', conanList);
    },
    keyaki: (keyakiList) => {
      Firebase.database.set('database/keyakiList/', keyakiList);
    },
  },
};

export const Auth = {
  subscribe: (callback) => {
    Firebase.auth.subscribe(callback);
  },
  signIn: (tokenId) => {
    Firebase.auth.signIn(tokenId);
  },
  signOut: () => {
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
