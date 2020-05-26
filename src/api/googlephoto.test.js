import UserDetail from '../utils/userdetail';
import GooglePhotoApi from './googlephoto';
import axios from 'axios';

jest.mock('axios');
jest.mock('../utils/userdetail');

describe('GooglePhotoApi', () => {
  const flushPromises = () => new Promise(setImmediate);

  describe('Albums', () => {
    it('should call api', async () => {
      // Given
      UserDetail.getAccessToken.mockReturnValue('access_token');
      axios.get.mockResolvedValue({ data: { albums: [] } });
      // When
      await GooglePhotoApi.getAlbums('');
      await flushPromises();
      // Then
      expect(axios.get).toHaveBeenCalledWith(
        'https://photoslibrary.googleapis.com/v1/albums?access_token=' +
          UserDetail.getAccessToken() +
          '&pageToken=&pageSize=50'
      );
    });
    it('should call api 2 times when get all albums', async () => {
      // Given
      UserDetail.getAccessToken.mockReturnValue('access_token');
      const first_request =
        'https://photoslibrary.googleapis.com/v1/albums?access_token=' +
        UserDetail.getAccessToken() +
        '&pageToken=&pageSize=50';
      axios.get.mockImplementation((request) =>
        request === first_request
          ? Promise.resolve({
              data: { albums: [], nextPageToken: 'next_page' },
            })
          : Promise.resolve({ data: { albums: [], nextPageToken: '' } })
      );
      // When
      await GooglePhotoApi.getAllAlbums('');
      await flushPromises();
      // Then
      expect(axios.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('Medias', () => {
    it('should call api', async () => {
      // Given
      UserDetail.getAccessToken.mockReturnValue('access_token');
      axios.post.mockResolvedValue({ data: { mediaItems: [] } });
      const albumId = 'album_id';
      // When
      await GooglePhotoApi.getMedias(albumId);
      await flushPromises();
      // Then
      expect(
        axios.post
      ).toHaveBeenCalledWith(
        'https://photoslibrary.googleapis.com/v1/mediaItems:search?access_token=' +
          UserDetail.getAccessToken(),
        { albumId: albumId, pageSize: 50, pageToken: '' }
      );
    });
  });
});
