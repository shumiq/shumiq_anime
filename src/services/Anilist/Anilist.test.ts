import axios from 'axios';
import AnilistApi, { searchAnimeQueryBuilder } from './Anilist';

jest.mock('axios');

describe('AnilistApi', () => {
  const flushPromises = () => new Promise(setImmediate);

  describe('searchAnime', () => {
    it('should call api', async () => {
      (axios.post as jest.Mock).mockResolvedValue({
        data: {
          data: {
            Page: {
              media: [{ id: 1 }, { id: 2 }],
            },
          },
        },
      });
      const keyword = 'keyword';
      await AnilistApi.searchAnime(keyword);
      expect(axios.post).toHaveBeenCalledWith('https://graphql.anilist.co', {
        query: searchAnimeQueryBuilder(keyword),
      });
    });
  });

  describe('getAnime', () => {
    it('should return first search result', async () => {
      (axios.post as jest.Mock).mockResolvedValue({
        data: {
          data: {
            Page: {
              media: [{ id: 1 }, { id: 2 }],
            },
          },
        },
      });
      const keyword = 'keyword';
      const result = await AnilistApi.getAnime(keyword);
      await flushPromises();
      expect(result).toStrictEqual({ id: 1 });
    });

    it('should return second search result if first is blacklist', async () => {
      (axios.post as jest.Mock).mockResolvedValue({
        data: {
          data: {
            Page: {
              media: [{ id: 1 }, { id: 2 }],
            },
          },
        },
      });
      const keyword = 'keyword';
      const result = await AnilistApi.getAnime(keyword, [1]);
      await flushPromises();
      expect(result).toStrictEqual({ id: 2 });
    });
  });
});
