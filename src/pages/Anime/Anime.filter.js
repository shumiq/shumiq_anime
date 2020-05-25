import { FilterEnum, SeasonEnum } from '../../utils/enum';

export const defaultFilter = {
  season: FilterEnum.LATEST_SEASON,
  category: FilterEnum.ALL_ANIME,
  keyword: '',
  orderby: FilterEnum.SORT_BY_SEASON,
};

export const AnimeFilter = (animeList, inputFilter = {}) => {
  if (animeList == null) return [];
  animeList = animeList.filter((anime) => anime?.key);
  let result = [];
  let filter = JSON.parse(JSON.stringify(defaultFilter));
  Object.assign(filter, inputFilter);

  // ParseInt if not int
  filter.category = parseInt(filter.category);
  filter.orderby = parseInt(filter.orderby);

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
      season = Object.keys(seasonList).sort().pop();
    result = animeList.filter(
      (anime) => season === anime.year + ',' + anime.season
    );
  } else {
    result = animeList.filter((anime) => true);
  }

  // Filter by Category
  if (filter.category === FilterEnum.ONLY_UNSEEN) {
    result = result.filter(
      (anime) => anime.view.toString() !== anime.download.toString()
    );
  }
  if (filter.category === FilterEnum.ONLY_UNFINISH) {
    result = result.filter(
      (anime) => anime.all_episode.toString() !== anime.download.toString()
    );
  }
  if (filter.category === FilterEnum.ONLY_FINISH) {
    result = result.filter(
      (anime) => anime.all_episode.toString() === anime.download.toString()
    );
  }

  // Filter by Keyword
  if (filter.keyword.trim().length > 0) {
    result = result.filter((anime) => {
      const animeKeywords = [
        anime.title.toString().toLowerCase(),
        anime.studio.toString().toLowerCase(),
        anime.genres.toString().toLowerCase(),
        anime.year.toString().toLowerCase(),
        SeasonEnum[anime.season].toString().toLowerCase(),
      ];
      let isInclude = true;
      filter.keyword
        .toLowerCase()
        .trim()
        .split(' ')
        .forEach((keyword) => {
          if (!animeKeywords.find((k) => k.includes(keyword)))
            isInclude = false;
        });
      return isInclude;
    });
  }

  // Sort Result
  if (filter.orderby === FilterEnum.SORT_BY_SEASON) {
    result = result.sort((animeA, animeB) => {
      const animeASeason = animeA.year + ',' + animeA.season;
      const animeBSeason = animeB.year + ',' + animeB.season;
      if (animeASeason !== animeBSeason)
        return animeASeason > animeBSeason ? -1 : 1;
      else return animeA.title < animeB.title ? -1 : 1;
    });
  }
  if (filter.orderby === FilterEnum.SORT_BY_SCORE) {
    result = result.sort((animeA, animeB) => animeB.score - animeA.score);
  }

  return result;
};

export const SeasonList = (animeList) => {
  if (animeList == null) return {};
  animeList = animeList.filter((anime) => anime?.key);
  let seasonList = {};
  animeList.forEach((anime) => {
    const season = anime.year + ',' + anime.season;
    if (!seasonList[season]) seasonList[season] = 0;
    seasonList[season]++;
  });
  return seasonList;
};
