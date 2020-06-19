import { Database, Anime, Conan, Keyaki, File } from './types';

export const validateDatabase = (db: Database): Database | boolean => {
  if (Array.isArray(db.animeList)) {
    const objectAnimeList: Record<string, Anime> = {};
    Object.keys(db.animeList).forEach((key) => {
      if (db.animeList[key]) {
        const newKey = key.includes('anime') ? key : 'anime' + key;
        objectAnimeList[newKey] = {
          ...validateAnime(db.animeList[key]),
          key: newKey,
        };
      }
    });
    db.animeList = objectAnimeList;
  }
  if (Array.isArray(db.conanList)) {
    const objectConanList: Record<string, Conan> = {};
    Object.keys(db.conanList).forEach((key) => {
      if (db.conanList[key]) {
        const newKey = key.includes('case') ? key : 'case' + key;
        objectConanList[newKey] = validateConan(db.conanList[key]);
      }
    });
    db.conanList = objectConanList;
  }
  Object.keys(db.conanList).forEach((key) => {
    if (db.conanList[key]) {
      db.conanList[key] = validateConan(db.conanList[key]);
    }
  });
  if (Array.isArray(db.keyakiList)) {
    const objectKeyakiList: Record<string, Keyaki> = {};
    Object.keys(db.keyakiList).forEach((key) => {
      if (db.keyakiList[key]) {
        const newKey = key.includes('ep') ? key : 'ep' + key;
        objectKeyakiList[newKey] = validateKeyaki(db.keyakiList[key]);
      }
    });
    db.keyakiList = objectKeyakiList;
  }
  return {
    ...db,
    animeList: db.animeList,
    conanList: db.conanList,
    keyakiList: db.keyakiList,
  };
};

export const validateAnime = (anime: Anime): Anime => {
  return {
    ...anime,
    key: anime.key.toString(),
    all_episode: anime.all_episode?.toString() || '?',
    cover_url: anime.cover_url?.toString() || '',
    download: parseInt(anime.download.toString()),
    download_url: anime.download_url?.toString() || '',
    genres: anime.genres?.toString() || '',
    gdriveid: anime.gdriveid?.toString() || '',
    gdriveid_public: anime.gdriveid_public?.toString() || '',
    gphotoid: anime.gphotoid?.toString() || '',
    info: anime.info?.toString() || '',
    score: anime.score?.toString() || '0.0',
    season: parseInt(anime.season.toString()),
    studio: anime.studio?.toString() || '',
    title: anime.title?.toString() || '',
    url: anime.url?.toString() || '',
    view: parseInt(anime.view.toString()),
    year: parseInt(anime.year.toString()),
  };
};

export const validateConan = (conan: Conan): Conan => {
  if (Array.isArray(conan.episodes)) {
    const objectEpisodeList: Record<string, File> = {};
    Object.keys(conan.episodes).forEach((key) => {
      if (conan.episodes[key]) objectEpisodeList[key] = conan.episodes[key];
    });
    conan.episodes = objectEpisodeList;
  }
  return {
    ...conan,
    case: parseInt(conan.case.toString()),
    name: conan.name?.toString() || '',
    episodes: conan.episodes,
  };
};

export const validateKeyaki = (keyaki: Keyaki): Keyaki => {
  return {
    ...keyaki,
    ep: parseInt(keyaki.ep.toString()),
    name: keyaki.name?.toString() || '',
  };
};
