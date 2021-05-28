export interface Database {
  anime: Record<string, Anime>;
  conan: Record<string, Conan>;
  keyaki: Record<string, Keyaki>;
  sakura: Record<string, Sakura>;
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
  sakura?: {
    episodes: number;
    files: number;
  };
}

export interface Anime {
  all_episode: string;
  cover_url: string;
  download: number;
  download_url: string;
  genres: string;
  blacklist?: number[];
  path: string;
  size: number;
  info: string;
  score: string;
  season: number;
  studio: string;
  title: string;
  view: number;
  year: number;
}

export interface Conan {
  case: number;
  name: string;
  episodes: Record<string, string>;
}

export interface Keyaki {
  ep: number;
  name: string;
  sub: Record<string, string>;
}

export interface Sakura {
  ep: number;
  name: string;
  sub: Record<string, string>;
}

export interface User {
  email?: string;
  familyName?: string;
  givenName?: string;
  googleId?: string;
  imageUrl?: string;
  name?: string;
}
