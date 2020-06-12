import axios from 'axios';
import UserDetail from '../utils/userdetail';
import GoogleDriveApi from './googledrive';

jest.mock('axios');
jest.mock('../utils/userdetail');

describe('GoogleDriveApi', () => {
  const flushPromises = () => new Promise(setImmediate);
  const mockAnime = {
    key: 5,
    all_episode: '?',
    cover_url: 'string',
    download: 5,
    download_url: 'string',
    genres: 'string',
    gdriveid: '',
    gdriveid_public: '',
    gphotoid: '',
    info: 'string',
    score: '0.0',
    season: 1,
    studio: 'string',
    title: 'title',
    url: '',
    view: 0,
    year: 2020,
  };

  describe('Get Files', () => {
    it('should call api', async () => {
      // Given
      (UserDetail.getAccessToken as jest.Mock).mockReturnValue('access_token');
      (axios.get as jest.Mock).mockResolvedValue({ data: { files: [] } });
      const folderId = 'folder_id';
      // When
      await GoogleDriveApi.getFiles(folderId);
      await flushPromises();
      // Then
      expect(axios.get).toHaveBeenCalledWith(
        'https://www.googleapis.com/drive/v3/files?access_token=' +
          UserDetail.getAccessToken() +
          "&pageToken=&q='" +
          folderId +
          "' in parents"
      );
    });
    it('should call api with upload folder id', async () => {
      // Given
      (UserDetail.getAccessToken as jest.Mock).mockReturnValue('access_token');
      (axios.get as jest.Mock).mockResolvedValue({ data: { files: [] } });
      const folderId = '1yO9pvMdrRrR5pIm9kAxYp9SEiwqpE_r6';
      // When
      await GoogleDriveApi.getUploadFiles();
      await flushPromises();
      // Then
      expect(axios.get).toHaveBeenCalledWith(
        'https://www.googleapis.com/drive/v3/files?access_token=' +
          UserDetail.getAccessToken() +
          "&pageToken=&q='" +
          folderId +
          "' in parents"
      );
    });
    it('should call api with private anime folder id', async () => {
      // Given
      (UserDetail.getAccessToken as jest.Mock).mockReturnValue('access_token');
      (axios.get as jest.Mock).mockResolvedValue({ data: { files: [] } });
      const folderId = '1teaWviknfgbuDsoFarRIsnny1HQ8zQe2';
      // When
      await GoogleDriveApi.getPrivateAnimeFolders();
      await flushPromises();
      // Then
      expect(axios.get).toHaveBeenCalledWith(
        'https://www.googleapis.com/drive/v3/files?access_token=' +
          UserDetail.getAccessToken() +
          "&pageToken=&q='" +
          folderId +
          "' in parents"
      );
    });
    it('should call api with public anime folder id', async () => {
      // Given
      (UserDetail.getAccessToken as jest.Mock).mockReturnValue('access_token');
      (axios.get as jest.Mock).mockResolvedValue({ data: { files: [] } });
      const folderId = '16MJ-jTxpa041WDc4nDjjLpIiSyNCEI4h';
      // When
      await GoogleDriveApi.getPublicAnimeFolders();
      await flushPromises();
      // Then
      expect(axios.get).toHaveBeenCalledWith(
        'https://www.googleapis.com/drive/v3/files?access_token=' +
          UserDetail.getAccessToken() +
          "&pageToken=&q='" +
          folderId +
          "' in parents"
      );
    });
  });

  describe('Get Folder id', () => {
    it('should return private folder id when folder available', async () => {
      //Given
      (UserDetail.getAccessToken as jest.Mock).mockReturnValue('access_token');
      const mockFolderId = 'folder_id';
      (axios.get as jest.Mock).mockResolvedValue({
        data: { files: [{ name: mockAnime.title, id: mockFolderId }] },
      });
      // When
      const response = await GoogleDriveApi.getPrivateFolderId(mockAnime);
      await flushPromises();
      // Then
      expect(response).toBe(mockFolderId);
    });

    it('should return private folder id when folder not available', async () => {
      //Given
      (UserDetail.getAccessToken as jest.Mock).mockReturnValue('access_token');
      const mockFolderId = 'folder_id';
      (axios.get as jest.Mock).mockResolvedValue({ data: { files: [] } });
      (axios.post as jest.Mock).mockResolvedValue({ id: mockFolderId });
      // When
      const response = await GoogleDriveApi.getPrivateFolderId(mockAnime);
      await flushPromises();
      // Then
      expect(response).toBe(mockFolderId);
    });

    it('should return public folder id', async () => {
      //Given
      (UserDetail.getAccessToken as jest.Mock).mockReturnValue('access_token');
      const mockFolderId = 'folder_id';
      (axios.get as jest.Mock).mockResolvedValue({
        data: { files: [{ name: mockAnime.title, id: mockFolderId }] },
      });
      // When
      const response = await GoogleDriveApi.getPublicFolderId(mockAnime);
      await flushPromises();
      // Then
      expect(response).toBe(mockFolderId);
    });

    it('should return public folder id when folder not available', async () => {
      //Given
      (UserDetail.getAccessToken as jest.Mock).mockReturnValue('access_token');
      const mockFolderId = 'folder_id';
      (axios.get as jest.Mock).mockResolvedValue({ data: { files: [] } });
      (axios.post as jest.Mock).mockResolvedValue({ id: mockFolderId });
      // When
      const response = await GoogleDriveApi.getPublicFolderId(mockAnime);
      await flushPromises();
      // Then
      expect(response).toBe(mockFolderId);
    });
  });

  describe('Create folder', () => {
    it('should call api', async () => {
      // Given
      (UserDetail.getAccessToken as jest.Mock).mockReturnValue('access_token');
      const folderName = 'name';
      const parentId = 'parent';
      // When
      await GoogleDriveApi.createFolder(folderName, parentId);
      await flushPromises();
      // Then
      expect(axios.post).toHaveBeenCalledWith(
        'https://www.googleapis.com/drive/v3/files?access_token=' +
          UserDetail.getAccessToken(),
        {
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [parentId],
        }
      );
    });
  });

  describe('Move files', () => {
    it('should call api', async () => {
      // Given
      (UserDetail.getAccessToken as jest.Mock).mockReturnValue('access_token');
      const fileId = 'file';
      const sourceId = '1yO9pvMdrRrR5pIm9kAxYp9SEiwqpE_r6';
      const destinationId = 'destination';
      // When
      await GoogleDriveApi.moveUploadFile(fileId, destinationId);
      await flushPromises();
      // Then
      expect(axios.patch).toHaveBeenCalledWith(
        'https://www.googleapis.com/drive/v3/files/' +
          fileId +
          '?access_token=' +
          UserDetail.getAccessToken() +
          '&addParents=' +
          destinationId +
          '&removeParents=' +
          sourceId
      );
    });
  });
});
