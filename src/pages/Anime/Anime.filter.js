import { FilterEnum } from '../../utils/enum'

const defaultFilter = {
    season: FilterEnum.LATEST_SEASON,
    category: FilterEnum.ALL_ANIME,
    keyword: '',
    orderby: FilterEnum.SORT_BY_SEASON
}

export const AnimeFilter = (animelist, inputFilter = defaultFilter) => {
    animelist = animelist.filter(anime => anime?.key);
    let result = [];
    const filter = Object.assign(defaultFilter, inputFilter);

    // Filter by Season
    const seasonList = SeasonList(animelist);
    if (filter.season !== FilterEnum.ALL_SEASON) {
        let season = filter.season;
        if (season === FilterEnum.LATEST_SEASON)
            season = Object.keys(seasonList).sort().pop();
        result = animelist.filter(anime => season === anime.year + "," + anime.season);
    } else {
        result = animelist.filter(anime => true);
    }

    // Filter by Category
    if (filter.category === FilterEnum.ONLY_UNSEEN) {
        result = result.filter(anime => anime.view !== anime.download);
    }
    if (filter.category === FilterEnum.ONLY_UNFINISH) {
        result = result.filter(anime => anime.all_episode !== anime.download);
    }
    if (filter.category === FilterEnum.ONLY_FINISH) {
        result = result.filter(anime => anime.all_episode === anime.download);
    }

    // Sort Result
    if (filter.orderby === FilterEnum.SORT_BY_SEASON) {
        result = result.sort((animeA, animeB) => {
            const animeASeason = animeA.year + "," + animeA.season;
            const animeBSeason = animeB.year + "," + animeB.season;
            if (animeASeason !== animeBSeason)
                return animeASeason > animeBSeason ? -1 : 1;
            else
                return animeA.title < animeB.title ? -1 : 1;
        });
    }
    if (filter.orderby === FilterEnum.SORT_BY_SCORE) {
        result = result.sort((animeA, animeB) => animeB.score - animeA.score);
    }

    return result;
}

export const SeasonList = animelist => {
    let seasonList = {};
    animelist.forEach(anime => {
        const season = anime.year + "," + anime.season;
        if (!seasonList[season]) seasonList[season] = 0;
        seasonList[season]++;
    });
    return seasonList;
}