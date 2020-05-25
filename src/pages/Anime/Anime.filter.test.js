import mockDatabase from '../../mock/database';
import { FilterEnum } from '../../utils/enum';
import { AnimeFilter, SeasonList } from './Anime.filter';

const mockAnimeList = mockDatabase.animeList;

describe('Anime Filter', () => {
  it('should return correct list of season', () => {
    const result = SeasonList(mockAnimeList);
    const expectResult = {
      '2020,1': 1,
      '2020,2': 1,
    };
    expect(result).toStrictEqual(expectResult);
  });

  it('should return latest season as default', () => {
    const result = AnimeFilter(mockAnimeList);
    expect(result[0]).toStrictEqual(mockAnimeList[1]);
    expect(result.length).toBe(1);
  });

  it('should return all season and sort by season', () => {
    const result = AnimeFilter(mockAnimeList, {
      season: FilterEnum.ALL_SEASON,
    });
    expect(result[0]).toStrictEqual(mockAnimeList[1]);
    expect(result[1]).toStrictEqual(mockAnimeList[0]);
    expect(result.length).toBe(2);
  });

  it('should return all season and sort by score', () => {
    const result = AnimeFilter(mockAnimeList, {
      season: FilterEnum.ALL_SEASON,
      orderby: FilterEnum.SORT_BY_SCORE,
    });
    expect(result[0]).toStrictEqual(mockAnimeList[1]);
    expect(result[1]).toStrictEqual(mockAnimeList[0]);
    expect(result.length).toBe(2);
  });

  it('should return only unseen anime of all season', () => {
    const result = AnimeFilter(mockAnimeList, {
      category: FilterEnum.ONLY_UNSEEN,
    });
    expect(result[0]).toStrictEqual(mockAnimeList[0]);
    expect(result.length).toBe(1);
  });

  it('should return only unfinish anime of all season', () => {
    const result = AnimeFilter(mockAnimeList, {
      category: FilterEnum.ONLY_UNFINISH,
    });
    expect(result[0]).toStrictEqual(mockAnimeList[0]);
    expect(result.length).toBe(1);
  });

  it('should return only finish anime of current season', () => {
    const result = AnimeFilter(mockAnimeList, {
      category: FilterEnum.ONLY_FINISH,
    });
    expect(result[0]).toStrictEqual(mockAnimeList[1]);
    expect(result.length).toBe(1);
  });

  it('should return only anime with keyword for all season', () => {
    const result = AnimeFilter(mockAnimeList, {
      keyword: 'Princess Fantasy Winter',
    });
    expect(result[0]).toStrictEqual(mockAnimeList[0]);
    expect(result.length).toBe(1);
  });
});
