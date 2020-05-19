import axios from 'axios';

const AnilistApi = {
  searchAnime: async (keyword) => {
    const response = await axios.post('https://graphql.anilist.co', {
      query: searchAnimeQueryBuilder(keyword),
    });
    return response?.data?.data?.Page?.media;
  },
  getAnime: async (keyword, blacklist = []) => {
    const searchResult = await AnilistApi.searchAnime(keyword);
    for (const key in searchResult) {
      let anime = searchResult[key];
      if (!blacklist.includes(anime.id)) {
        return anime;
      }
    }
    return null;
  },
};

export const searchAnimeQueryBuilder = (keyword) => {
  return (
    `{
        Page(page: 1, perPage: 100) {
            pageInfo {
                total
                perPage
                currentPage
                lastPage
                hasNextPage
            }
            media(search: "` +
    keyword +
    `",
            type:ANIME,
            sort:SEARCH_MATCH) {
                id
                title {
                    romaji
                    english
                    native
                    userPreferred
                }
                season
                description(asHtml:false)
                startDate {
                    year
                }
                episodes
                source
                coverImage {
                    large
                    medium
                }
                bannerImage
                genres
                meanScore
                averageScore
                popularity
                relations {
                    nodes {
                        title {
                            userPreferred
                        }
                        type
                    }
                }
                studios (isMain:true) {
                    nodes {
                        name
                    }
                }
                nextAiringEpisode {
                    timeUntilAiring
                    episode
                }
            }
        }
    }`
  );
};

export default AnilistApi;
