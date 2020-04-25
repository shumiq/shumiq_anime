import axios from 'axios';
import AnilistApi, { searchAnimeQueryBuilder } from './anilist'

jest.mock('axios');

describe('AnilistApi', () => {
    describe('searchAnime', () => {
        it('should call api', async () => {
            const keyword = "keyword";
            await AnilistApi.searchAnime(keyword);
            expect(axios.post).toHaveBeenCalledWith('https://graphql.anilist.co', { query: searchAnimeQueryBuilder(keyword) });
        });
    });
});
