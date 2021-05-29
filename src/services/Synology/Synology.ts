import axios from 'axios';
import { storage } from '../../utils/LocalStorage/LocalStorage';
import { ListResponse, SignInResModel } from '../../models/SynologyApi';

const hostName = 'http://shumiq.synology.me:5000';
const endPoint = `${
  process.env.REACT_APP_API_ENDPOINT?.toString() || 'http//:localhost:3000'
}/api/drive`;
const downloadPath =
  '/webapi/entry.cgi?api=SYNO.FileStation.Download&version=2&method=download&path=';
const additional = '&additional=["size","time"]';
const sortBy = {
  name: '&sort_by=name',
  date: '&sort_by=mtime&sort_direction=desc',
};
const forceDownload = '&mode=download';

const SynologyApi = {
  signIn: async (): Promise<string> => {
    try {
      const response: {
        data: SignInResModel;
      } = await axios.get(encodeURI(`${endPoint}/signin`));
      const sid = response.data.success ? response.data.data.sid : '';
      storage.set('synology_sid', sid);
      return sid;
    } catch (e) {
      return '';
    }
  },
  list: async (
    path: string,
    sortByDate = false,
    isAdditional = false
  ): Promise<ListResponse> => {
    try {
      let sid = storage.get('synology_sid');
      if (!sid || sid.length === 0) sid = await SynologyApi.signIn();
      const reqPath = `${path}${sortByDate ? sortBy.date : sortBy.name}${
        isAdditional ? additional : ''
      }&_sid=${sid}`;
      const response: { data: ListResponse; status: string } = await axios.get(
        encodeURI(`${endPoint}/list?path=${encodeURIComponent(reqPath)}`)
      );
      return response.data;
    } catch (e) {
      return { data: {}, success: false };
    }
  },
  getDownloadURL: (path: string, isDownload = false): string => {
    return `${hostName}${downloadPath}${path}${
      isDownload ? forceDownload : ''
    }`;
  },
  getAuthDownloadURL: (url: string): string => {
    const sid = storage.get('synology_sid');
    if (sid && sid.length > 0) return encodeURI(`${url}&_sid=${sid}`);
    return '';
  },
};

export default SynologyApi;
