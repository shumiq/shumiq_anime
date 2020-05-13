import axios from 'axios';
import { getAccessToken } from '../utils/userdetail';

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
    },
    getMedias: async albumId => {
        let medias = [];
        let nextPageToken = '';
        while (true) {
            const response = await axios.post('https://photoslibrary.googleapis.com/v1/mediaItems:search?access_token=' + getAccessToken(), {
                albumId: albumId,
                pageToken: nextPageToken,
                pageSize: pageSize
            });
            response.data.mediaItems.forEach(media => {
                medias.push(media);
            })
            nextPageToken = response.data.nextPageToken;
            if (!nextPageToken) break;
        }
        return medias;
    }
}

export default PhotoApi;