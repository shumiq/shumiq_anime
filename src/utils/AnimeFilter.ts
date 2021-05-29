import { FilterOption, Season } from '../models/Constants';
import { Anime, AnimeFilter } from '../models/Type';

const defaultFilter: AnimeFilter = {
  season: FilterOption.LATEST_SEASON,
  category: FilterOption.ALL_ANIME,
  keyword: '',
  orderBy: FilterOption.SORT_BY_SEASON,
};

export const Filter = (
  animeList: Record<string, Anime>,
  inputFilter: AnimeFilter
): [string, Anime][] => {
  if (animeList == null) return [];
  let result: [string, Anime][] = [];
  const filter = { ...defaultFilter, ...inputFilter };

  // Replace season to all season when..
  if (filter.category === FilterOption.ONLY_UNFINISH)
    filter.season = FilterOption.ALL_SEASON;
  if (filter.category === FilterOption.ONLY_UNSEEN)
    filter.season = FilterOption.ALL_SEASON;
  if (filter.keyword.trim().length > 0) filter.season = FilterOption.ALL_SEASON;

  // Filter by Season
  const seasonList = SeasonList(animeList);
  if (filter.season.toString() !== FilterOption.ALL_SEASON.toString()) {
    let season = filter.season;
    if (season.toString() === FilterOption.LATEST_SEASON.toString())
      season = Object.keys(seasonList).sort().pop() || 'undefined';
    result = Object.entries(animeList).filter((entries) => {
      const anime = entries[1];
      return season === anime.year.toString() + ',' + anime.season.toString();
    });
  } else {
    result = Object.entries(animeList);
  }

  // Filter by Category
  if (filter.category === FilterOption.ONLY_UNSEEN) {
    result = result.filter(
      (entries) => entries[1].view !== entries[1].download
    );
  }
  if (filter.category === FilterOption.ONLY_UNFINISH) {
    result = result.filter(
      (entries) =>
        entries[1].all_episode !== entries[1].download.toString() ||
        entries[1].download_url.length > 0
    );
  }
  if (filter.category === FilterOption.ONLY_FINISH) {
    result = result.filter(
      (entries) => entries[1].all_episode === entries[1].download.toString()
    );
  }

  // Filter by Keyword
  if (filter.keyword.trim().length > 0) {
    result = result.filter((entries) => {
      const anime = entries[1];
      if (anime !== null) {
        const animeKeywords = [
          anime.title.toString().toLowerCase(),
          anime.studio.toString().toLowerCase(),
          anime.genres.toString().toLowerCase(),
          anime.year.toString().toLowerCase(),
          (Season[anime.season] as string).toString().toLowerCase(),
        ];
        let isInclude = true;
        filter.keyword
          .toLowerCase()
          .trim()
          .split(' ')
          .forEach((keyword) => {
            if (
              !animeKeywords.find((k: string): boolean => k.includes(keyword))
            )
              isInclude = false;
          });
        return isInclude;
      } else return false;
    });
  }

  // Sort Result
  if (filter.orderBy === FilterOption.SORT_BY_SEASON) {
    result = result.sort((entriesA, entriesB) => {
      const animeA = entriesA[1];
      const animeB = entriesB[1];
      if (animeA !== null && animeB !== null) {
        const animeASeason =
          animeA.year.toString() + ',' + animeA.season.toString();
        const animeBSeason =
          animeB.year.toString() + ',' + animeB.season.toString();
        if (animeASeason !== animeBSeason)
          return animeASeason > animeBSeason ? -1 : 1;
        else return animeA.title < animeB.title ? -1 : 1;
      } else {
        return 0;
      }
    });
  }
  if (filter.orderBy === FilterOption.SORT_BY_SCORE) {
    result = result.sort((entriesA, entriesB) => {
      const animeA = entriesA[1];
      const animeB = entriesB[1];
      if (animeA !== null && animeB !== null) {
        return parseFloat(animeB.score) - parseFloat(animeA.score);
      } else {
        return 0;
      }
    });
  }

  return result;
};

export const SeasonList = (
  animeList: Record<string, Anime>
): Record<string, number> => {
  if (animeList == null) return {};
  const seasonList = {};
  Object.keys(animeList).forEach((key) => {
    const anime = animeList[key];
    if (anime !== null) {
      const season = anime.year.toString() + ',' + anime.season.toString();
      if (!seasonList[season]) seasonList[season] = 0;
      seasonList[season]++;
    }
  });
  return seasonList;
};
