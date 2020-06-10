export interface Database {
  animeList: (Anime | null)[];
  conanList: (Conan | null)[];
  keyakiList: (Keyaki | null)[];
}

export interface DatabaseStatus {
  anime?: {
    series: number;
    files: number;
    view: number;
  };
  conan?: {
    cases: number;
    files: number;
  };
  keyaki?: {
    episodes: number;
    files: number;
  };
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

export interface File {
  photoUrl: string | null;
  url: string;
}

export interface Conan {
  case: number;
  name: string;
  episodes: Record<number, File>;
}

export interface Keyaki {
  ep: number;
  name: string;
  sub: Record<string, File>;
}

export interface Router {
  path: string;
  exact: boolean;
  component: React.ComponentClass | unknown; // to be remove after convert all to ts
  auth: string[];
}

export interface User {
  email?: string;
  familyName?: string;
  givenName?: string;
  googleId?: string;
  imageUrl?: string;
  name?: string;
}
