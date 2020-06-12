import { Database, Anime, Conan, Keyaki } from './types';

export const validateDatabase = (db: Database): Database | boolean => {
  return {
    ...db,
    animeList: db.animeList.map((anime) => validateAnime(anime)),
    conanList: db.conanList.map((conan) => validateConan(conan)),
    keyakiList: db.keyakiList.map((keyaki) => validateKeyaki(keyaki)),
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

export const validateConan = (conan: Conan | null): Conan | null => {
  if (conan === null) return null;
  return {
    ...conan,
    case: parseInt(conan.case.toString()),
    name: conan.name?.toString() || '',
  };
};

export const validateKeyaki = (keyaki: Keyaki | null): Keyaki | null => {
  if (keyaki === null) return null;
  return {
    ...keyaki,
    ep: parseInt(keyaki.ep.toString()),
    name: keyaki.name?.toString() || '',
  };
};
