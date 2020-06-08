import axios from 'axios';
import UserDetail from '../utils/userdetail';

const uploadFolderId = '1yO9pvMdrRrR5pIm9kAxYp9SEiwqpE_r6';
const privateAnimeFolderId = '1teaWviknfgbuDsoFarRIsnny1HQ8zQe2';
const publicAnimeFolderId = '16MJ-jTxpa041WDc4nDjjLpIiSyNCEI4h';

const GoogleDriveApi = {
  getFiles: async (folderId) => {
    let files = [];
    let nextPageToken = '';
    while (true) {
      const response = await axios.get(
        'https://www.googleapis.com/drive/v3/files?access_token=' +
          UserDetail.getAccessToken() +
          '&pageToken=' +
          nextPageToken +
          "&q='" +
          folderId +
          "' in parents"
      );
      response.data.files.forEach((file) => {
        files.push(file);
      });
      nextPageToken = response.data.nextPageToken;
      if (!nextPageToken) break;
    }
    return files;
  },
  getUploadFiles: async () => {
    const response = await GoogleDriveApi.getFiles(uploadFolderId);
    return response;
  },
  getPrivateAnimeFolders: async () => {
    const response = await GoogleDriveApi.getFiles(privateAnimeFolderId);
    return response;
  },
  getPublicAnimeFolders: async () => {
    const response = await GoogleDriveApi.getFiles(publicAnimeFolderId);
    return response;
  },
  getPrivateFolderId: async (anime) => {
    if (anime.gdriveid) return anime.gdriveid;
    const folderList = await GoogleDriveApi.getPrivateAnimeFolders();
    const animeFolder = folderList.filter(
      (folder) => folder.name === anime.title
    )[0];
    if (animeFolder?.id) return animeFolder?.id;
    const newFolder = await GoogleDriveApi.createFolder(
      anime.title,
      privateAnimeFolderId
    );
    return newFolder.id;
  },
  getPublicFolderId: async (anime) => {
    if (anime.gdriveid_public) return anime.gdriveid_public;
    const folderList = await GoogleDriveApi.getPublicAnimeFolders();
    const animeFolder = folderList.filter(
      (folder) => folder.name === anime.title
    )[0];
    if (animeFolder?.id) return animeFolder?.id;
    const newFolder = await GoogleDriveApi.createFolder(
      anime.title,
      publicAnimeFolderId
    );
    return newFolder.id;
  },
  createFolder: async (name, parentId) => {
    const response = await axios.post(
      'https://www.googleapis.com/drive/v3/files?access_token=' +
        UserDetail.getAccessToken(),
      {
        name: name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentId],
      }
    );
    return response;
  },
  moveUploadFile: async (fileId, destinationId) => {
    await axios.patch(
      'https://www.googleapis.com/drive/v3/files/' +
        fileId +
        '?access_token=' +
        UserDetail.getAccessToken() +
        '&addParents=' +
        destinationId +
        '&removeParents=' +
        uploadFolderId
    );
  },
};

export default GoogleDriveApi;
