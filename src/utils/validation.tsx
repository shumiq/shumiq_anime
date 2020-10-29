import { Database, Anime, Conan, Keyaki, Sakura, File } from './types';

export const validateDatabase = (db: Database): Database | boolean => {
  Object.keys(db.conan).forEach((key) => {
    if (db.conan[key]) {
      db.conan[key] = validateConan(db.conan[key]);
    }
  });
  return {
    ...db,
    anime: db.anime,
    conan: db.conan,
    keyaki: db.keyaki,
    sakura: db.sakura,
  };
};

export const validateAnime = (anime: Anime): Anime => {
  return {
    ...anime,
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

export const validateSakura = (sakura: Sakura): Sakura => {
  return {
    ...sakura,
    ep: parseInt(sakura.ep.toString()),
    name: sakura.name?.toString() || '',
  };
};
