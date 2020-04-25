import axios from 'axios';

const AnilistApi = {
    searchAnime: async keyword => {
        const response = await axios.post('https://graphql.anilist.co', { query: searchAnimeQueryBuilder(keyword) })
        return response?.data?.data?.Page?.media;
    },
    getAnime: async (keyword, blacklist=[]) => {
        const searchResult = await AnilistApi.searchAnime(keyword);
        for (const key in searchResult) {
            let anime = searchResult[key];
            if (!blacklist.includes(anime.id)) {
                const studio = await AnilistApi.getStudio(anime.studios?.nodes[0]?.id);
                anime.studio = studio;
                const relationList = anime.relations.nodes.map(e => e.id).join(", ");
                const related = await AnilistApi.getRelatedAnime(relationList);
                anime.related = related;
                return anime;
            }
        }
        return null;
    },
    getStudio: async studioId => {
        if (studioId === null) return '';
        const response = await axios.post('https://graphql.anilist.co', { query: getStudioQueryBuilder(studioId) })
        return response?.data?.data?.Studio?.name;
    },
    getRelatedAnime: async relationList => {
        const response = await axios.post('https://graphql.anilist.co', { query: getRelationQueryBuilder(relationList) })
        return response?.data?.data?.Page?.media;
    }
};

export const searchAnimeQueryBuilder = keyword => {
    return `{
        Page(page: 1, perPage: 100) {
            pageInfo {
                total
                perPage
                currentPage
                lastPage
                hasNextPage
            }
            media(search: "` + keyword + `",
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
                        id
                    }
                }
                studios (isMain:true) {
                    nodes {
                        id
                    }
                }
                nextAiringEpisode {
                    timeUntilAiring
                    episode
                }
            }
        }
    }`
}

export const getStudioQueryBuilder = studioId => {
    return `{
        Studio(id:` + studioId + `){
            name
        }
    }`;
}

export const getRelationQueryBuilder = relationList => {
    return `{
        Page(page: 1, perPage: 100) {
            pageInfo {
                total
                perPage
                currentPage
                lastPage
                hasNextPage
            }
            media(id_in: [` + relationList + `], type: ANIME) {
                title {
                    userPreferred
                }
                type
            }
        }
    }`;
}

export default AnilistApi;
