import mockDatabase from '../../../models/mock/database.json';
import { FilterEnum } from '../../../models/Constants';
import { AnimeFilter, SeasonList } from '../../Anime/Anime.filter';
import { Anime, Database } from '../../../models/Type';

const mockAnimeList: Record<
  string,
  Anime
> = ((mockDatabase as unknown) as Database).anime;

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
    expect(result[0]).toStrictEqual(['abc350', mockAnimeList['abc350']]);
    expect(result.length).toBe(1);
  });

  it('should return all season and sort by season', () => {
    const result = AnimeFilter(mockAnimeList, {
      season: FilterEnum.ALL_SEASON,
    });
    expect(result[0]).toStrictEqual(['abc350', mockAnimeList['abc350']]);
    expect(result[1]).toStrictEqual(['abc352', mockAnimeList['abc352']]);
    expect(result.length).toBe(2);
  });

  it('should return all season and sort by score', () => {
    const result = AnimeFilter(mockAnimeList, {
      season: FilterEnum.ALL_SEASON,
      orderby: FilterEnum.SORT_BY_SCORE,
    });
    expect(result[0]).toStrictEqual(['abc350', mockAnimeList['abc350']]);
    expect(result[1]).toStrictEqual(['abc352', mockAnimeList['abc352']]);
    expect(result.length).toBe(2);
  });

  it('should return only unseen anime of all season', () => {
    const result = AnimeFilter(mockAnimeList, {
      category: FilterEnum.ONLY_UNSEEN,
    });
    expect(result[0]).toStrictEqual(['abc352', mockAnimeList['abc352']]);
    expect(result.length).toBe(1);
  });

  it('should return only unfinish anime of all season', () => {
    const result = AnimeFilter(mockAnimeList, {
      category: FilterEnum.ONLY_UNFINISH,
    });
    expect(result[0]).toStrictEqual(['abc352', mockAnimeList['abc352']]);
    expect(result.length).toBe(1);
  });

  it('should return only finish anime of current season', () => {
    const result = AnimeFilter(mockAnimeList, {
      category: FilterEnum.ONLY_FINISH,
    });
    expect(result[0]).toStrictEqual(['abc350', mockAnimeList['abc350']]);
    expect(result.length).toBe(1);
  });

  it('should return only anime with keyword for all season', () => {
    const result = AnimeFilter(mockAnimeList, {
      keyword: 'Princess Fantasy Winter',
    });
    expect(result[0]).toStrictEqual(['abc352', mockAnimeList['abc352']]);
    expect(result.length).toBe(1);
  });
});
