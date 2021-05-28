export interface AnilistInfoResponse {
  id: number;
  title: {
    romaji: string;
    english: string;
    userPreferred?: string;
  };
  season: string;
  description: string;
  startDate: { year: number };
  episodes: number | null;
  source: string;
  coverImage: {
    large: string;
  };
  bannerImage: string | null;
  genres: string[];
  meanScore: number;
  averageScore: number;
  popularity: number;
  relations: {
    nodes: { title: { userPreferred: string }; type: string }[];
  };
  studios: {
    nodes: { name: string }[];
  };
  nextAiringEpisode: {
    timeUntilAiring: number;
    episode: number;
  };
}
