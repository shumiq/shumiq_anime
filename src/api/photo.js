import axios from 'axios';
import { getAccessToken } from '../utils/userDetail';

const pageSize = 50;

const PhotoApi = {
    getAlbums: async nextPageToken => {
        const response = await axios.get('https://photoslibrary.googleapis.com/v1/albums?access_token=' + getAccessToken() + '&pageToken=' + nextPageToken + '&pageSize=' + pageSize);
        return response.data;
    },
    getAllAlbums: async token => {
        let albums = [];
        let nextPageToken = token;
        while (true) {
            const response = await PhotoApi.getAlbums(nextPageToken);
            response.albums.forEach(album => {
                albums.push(album);
            })
            nextPageToken = response.nextPageToken;
            if (!response.nextPageToken) break;
        }
        return { albums: albums, nextPageToken: null };
    }
}

export default PhotoApi;