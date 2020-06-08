export interface Database {
  animeList: Anime[];
  conanList: any;
  keyakiList: any;
}

export interface Anime {
  key: number;
  all_episode: string;
  cover_url: string;
  download: number;
  download_url: string;
  gdriveid: string;
  gdriveid_public: string;
  gphotoid: string;
  info: string;
  score: string;
  season: number;
  studio: string;
  title: string;
  url: string;
  view: number;
  year: number;
}

interface File {
  photoUrl: string,
  url: string,
}

export interface Conan {
  case: number,
  name: string,
  episodes: File[]
}

export interface Keyaki {
  ep: number,
  name: string,
  sub: File[]
}