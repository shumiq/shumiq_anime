import axios from 'axios';
import { getAccessToken } from '../utils/userDetail';

const accessToken = getAccessToken();
const PhotoApi = {
    getAlbums: async () => {
      const response = await axios.get(`https://photoslibrary.googleapis.com/v1/albums?access_token=` + accessToken);
      return response;
    }
}

export default PhotoApi;