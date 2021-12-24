import axios from 'axios';
import storage from '../../utils/LocalStorage/LocalStorage';
import { ListResponse, SignInResModel } from '../../models/SynologyApi';
import LocalStorage from '../../utils/LocalStorage/LocalStorage';

const endPoint = `${
  process.env.REACT_APP_API_ENDPOINT?.toString() ||
  'https://app-api.shumiq.synology.me'
}/api`;
const additional = '&additional=["size","time"]';
const sortBy = {
  name: '&sort_by=name',
  date: '&sort_by=mtime&sort_direction=desc',
};

let latestErrorCode = 200;

const SynologyApi = {
  signIn: async (): Promise<string> => {
    try {
      const firebaseIdToken = LocalStorage.get('firebase_id_token') || '';
      const response: {
        data: SignInResModel;
      } = await axios.get(
        encodeURI(`${endPoint}/drive/signin?token=${firebaseIdToken}`)
      );
      const sid = response.data.success ? response.data.data.sid : '';
      storage.set('synology_sid', sid);
      return sid;
    } catch (e) {
      return '';
    }
  },
  testSid: async (sid = ''): Promise<ListResponse> => {
    try {
      const response: { data: ListResponse; status: string } = await axios.get(
        encodeURI(`${endPoint}/drive/list?path=Anime&_sid=${sid}`)
      );
      if (response.data.error) latestErrorCode = response.data.error.code;
      if (response.data.success) latestErrorCode = 200;
      return response.data;
    } catch (e) {
      return { data: {}, success: false };
    }
  },
  list: async (
    path: string,
    sortByDate = false,
    isAdditional = false
  ): Promise<ListResponse> => {
    try {
      let sid = storage.get('synology_sid');
      if (!sid || sid.length === 0 || latestErrorCode === 119)
        sid = await SynologyApi.signIn();
      const reqPath = `${encodeURIComponent(path)}${
        sortByDate ? sortBy.date : sortBy.name
      }${isAdditional ? additional : ''}&_sid=${sid}`;
      const response: { data: ListResponse; status: string } = await axios.get(
        encodeURI(`${endPoint}/drive/list?path=${encodeURIComponent(reqPath)}`)
      );
      if (response.data.error) latestErrorCode = response.data.error.code;
      if (response.data.success) latestErrorCode = 200;
      return response.data;
    } catch (e) {
      return { data: {}, success: false };
    }
  },
  getDownloadURL: (path: string): string => {
    return `${endPoint}/file/video?path=${encodeURIComponent(path)}`;
  },
  move: async (from: string, to: string) => {
    const sid = storage.get('synology_sid') || '';
    try {
      from = from.startsWith('/public_video')
        ? encodeURIComponent(from)
        : encodeURIComponent(`/public_video${from}`);
      to = to.startsWith('/public_video')
        ? encodeURIComponent(to)
        : encodeURIComponent(`/public_video${to}`);
      await axios.get(
        `${endPoint}/drive/move?from=${from}&to=${to}&sid=${sid}`
      );
      return true;
    } catch (e) {
      return false;
    }
  },
};

export default SynologyApi;
