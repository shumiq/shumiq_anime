import axios from 'axios';
import UserDetail from '../utils/userdetail';
import {
  GooglePhotoAlbumResponse,
  GooglePhotoMediaResponse,
} from '../utils/types';

const pageSize = 50;
const includeAlbum = '[Anime]';
const excludeAlbum = 'Detective Conan';

const GooglePhotoApi = {
  getAlbums: async (
    nextPageToken: string | null
  ): Promise<{
    albums: GooglePhotoAlbumResponse[];
    nextPageToken: string | null;
  }> => {
    const response: {
      data: {
        albums: GooglePhotoAlbumResponse[];
        nextPageToken: string | null;
      };
    } = await axios.get(
      'https://photoslibrary.googleapis.com/v1/albums?access_token=' +
        UserDetail.getAccessToken() +
        '&pageToken=' +
        (nextPageToken || '') +
        '&pageSize=' +
        pageSize.toString()
    );
    const albums: GooglePhotoAlbumResponse[] = [];
    response.data.albums.forEach((album) => {
      if (
        album.title.includes(includeAlbum) &&
        !album.title.includes(excludeAlbum)
      )
        albums.push(album);
    });
    return { albums: albums, nextPageToken: response.data.nextPageToken };
  },
  getAllAlbums: async (
    token: string
  ): Promise<{
    albums: GooglePhotoAlbumResponse[];
    nextPageToken: string | null;
  }> => {
    const albums: GooglePhotoAlbumResponse[] = [];
    let nextPageToken: string | null = token;
    while (true) {
      const response: {
        albums: GooglePhotoAlbumResponse[];
        nextPageToken: string | null;
      } = await GooglePhotoApi.getAlbums(nextPageToken);
      response.albums.forEach((album) => {
        albums.push(album);
      });
      nextPageToken = response.nextPageToken;
      if (!response.nextPageToken) break;
    }
    return { albums: albums, nextPageToken: null };
  },
  getMedias: async (albumId: string): Promise<GooglePhotoMediaResponse[]> => {
    const medias: GooglePhotoMediaResponse[] = [];
    let nextPageToken: string | null = '';
    while (true) {
      const response: {
        data: {
          mediaItems: GooglePhotoMediaResponse[];
          nextPageToken: string | null;
        };
      } = await axios.post(
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
