import UserDetail from '../utils/userdetail';
import axios from 'axios';

const pageSize = 50;
const includeAlbum = '[Anime]';
const excludeAlbum = 'Detective Conan';

const GooglePhotoApi = {
  getAlbums: async (nextPageToken) => {
    const response = await axios.get(
      'https://photoslibrary.googleapis.com/v1/albums?access_token=' +
        UserDetail.getAccessToken() +
        '&pageToken=' +
        nextPageToken +
        '&pageSize=' +
        pageSize
    );
    let albums = [];
    response.data.albums.forEach((album) => {
      if (
        album.title.includes(includeAlbum) &&
        !album.title.includes(excludeAlbum)
      )
        albums.push(album);
    });
    return { albums: albums, nextPageToken: response.data.nextPageToken };
  },
  getAllAlbums: async (token) => {
    let albums = [];
    let nextPageToken = token;
    while (true) {
      const response = await GooglePhotoApi.getAlbums(nextPageToken);
      response.albums.forEach((album) => {
        albums.push(album);
      });
      nextPageToken = response.nextPageToken;
      if (!response.nextPageToken) break;
    }
    return { albums: albums, nextPageToken: null };
  },
  getMedias: async (albumId) => {
    let medias = [];
    let nextPageToken = '';
    while (true) {
      const response = await axios.post(
        'https://photoslibrary.googleapis.com/v1/mediaItems:search?access_token=' +
          UserDetail.getAccessToken(),
        {
          albumId: albumId,
          pageToken: nextPageToken,
          pageSize: pageSize,
        }
      );
      response.data.mediaItems.forEach((media) => {
        medias.push(media);
      });
      nextPageToken = response.data.nextPageToken;
      if (!nextPageToken) break;
    }
    return medias;
  },
};

export default GooglePhotoApi;
