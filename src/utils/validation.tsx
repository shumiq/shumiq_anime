import { Database, Anime, Conan, Keyaki } from './types';

export const validateDatabase = (db: Database): Database | boolean => {
  if (Array.isArray(db.conanList)) {
    const objectConanList: Record<string, Conan> = {};
    Object.keys(db.conanList).forEach((key) => {
      if (db.conanList[key])
        objectConanList[key] = validateConan(db.conanList[key]);
    });
    db.conanList = objectConanList;
  }
  if (Array.isArray(db.keyakiList)) {
    const objectKeyakiList: Record<string, Keyaki> = {};
    Object.keys(db.keyakiList).forEach((key) => {
      if (db.keyakiList[key])
        objectKeyakiList[key] = validateKeyaki(db.keyakiList[key]);
    });
    db.keyakiList = objectKeyakiList;
  }
  return {
    ...db,
    animeList: db.animeList.map((anime) => validateAnime(anime)),
    conanList: db.conanList,
    keyakiList: db.keyakiList,
  };
};

export const validateAnime = (anime: Anime | null): Anime | null => {
  if (anime === null) return null;
  return {
    ...anime,
    key: parseInt(anime.key.toString()),
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
  return {
    ...conan,
    case: parseInt(conan.case.toString()),
    name: conan.name?.toString() || '',
  };
};

export const validateKeyaki = (keyaki: Keyaki): Keyaki => {
  return {
    ...keyaki,
    ep: parseInt(keyaki.ep.toString()),
    name: keyaki.name?.toString() || '',
  };
};
