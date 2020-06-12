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
  genres: string;
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
  component: React.ComponentClass | (() => JSX.Element);
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

export interface AnilistInfoResponse {
  id: number;
  title: {
    romaji: string;
    english: string;
    userPreferred: string;
  };
  season: string;
  description: string;
  startDate: { year: number };
  episodes: number;
  source: string;
  coverImage: {
    large: string;
  };
  bannerImage: string;
  genres: string[];
  meanScore: number;
  averageScore: number;
  popularity: number;
  relations: {
    nodes: { title: { userPreferred: string } }[];
  };
  studios: {
    nodes: { name: string }[];
  };
  nextAiringEpisode: {
    timeUntilAiring: number;
    episode: number;
  };
}

export interface GooglePhotoAlbumResponse {
  id: string;
  title: string;
  productUrl: string;
  mediaItemsCount: string;
}

export interface GooglePhotoMediaResponse {
  id: string;
  productUrl: string;
  baseUrl: string;
  filename: string;
}

export interface GoogleDriveFileResponse {
  id: string;
  name: string;
}
