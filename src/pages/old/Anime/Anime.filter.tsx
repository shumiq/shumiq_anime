import { FilterEnum, SeasonEnum } from '../../../utils/enum';
import { Anime } from '../../../utils/types';

export const defaultFilter = {
  season: FilterEnum.LATEST_SEASON,
  category: FilterEnum.ALL_ANIME,
  keyword: '',
  orderby: FilterEnum.SORT_BY_SEASON,
};

export const AnimeFilter = (
  animeList: Record<string, Anime>,
  inputFilter: {
    season?: number | string;
    category?: number;
    keyword?: string;
    orderby?: number;
  } = {}
): [string, Anime][] => {
  if (animeList == null) return [];
  let result: [string, Anime][] = [];
  const filter = { ...defaultFilter, ...inputFilter };

  // ParseInt if not int
  // filter.category = parseInt(filter.category);
  // filter.orderby = parseInt(filter.orderby);

  // Replace season to all season when..
  if (filter.category === FilterEnum.ONLY_UNFINISH)
    filter.season = FilterEnum.ALL_SEASON;
  if (filter.category === FilterEnum.ONLY_UNSEEN)
    filter.season = FilterEnum.ALL_SEASON;
  if (filter.keyword.trim().length > 0) filter.season = FilterEnum.ALL_SEASON;

  // Filter by Season
  const seasonList = SeasonList(animeList);
  if (filter.season.toString() !== FilterEnum.ALL_SEASON.toString()) {
    let season = filter.season;
    if (season.toString() === FilterEnum.LATEST_SEASON.toString())
      season = Object.keys(seasonList).sort().pop() || 'undefined';
    result = Object.entries(animeList).filter((entries) => {
      const anime = entries[1];
      return season === anime.year.toString() + ',' + anime.season.toString();
    });
  } else {
    result = Object.entries(animeList);
  }

  // Filter by Category
  if (filter.category === FilterEnum.ONLY_UNSEEN) {
    result = result.filter(
      (entries) => entries[1].view !== entries[1].download
    );
  }
  if (filter.category === FilterEnum.ONLY_UNFINISH) {
    result = result.filter(
      (entries) =>
        entries[1].all_episode !== entries[1].download.toString() ||
        entries[1].download_url.length > 0
    );
  }
  if (filter.category === FilterEnum.ONLY_FINISH) {
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
          (SeasonEnum[anime.season] as string).toString().toLowerCase(),
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
  if (filter.orderby === FilterEnum.SORT_BY_SEASON) {
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
  if (filter.orderby === FilterEnum.SORT_BY_SCORE) {
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
