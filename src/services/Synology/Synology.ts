import axios from 'axios';
import storage from '../../utils/LocalStorage/LocalStorage';
import { ListResponse, SignInResModel } from '../../models/SynologyApi';

const hostName = 'https://shumiq.synology.me:5001';
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

let latestErrorCode = 200;

const SynologyApi = {
  signIn: async (
    options = { isAdmin: false, password: '', otp: '' }
  ): Promise<string> => {
    try {
      const response: {
        data: SignInResModel;
      } = await axios.get(
        encodeURI(
          `${endPoint}/signin?admin=${options.isAdmin.toString()}&password=${
            options.password
          }&otp=${options.otp}`
        )
      );
      const sid = response.data.success ? response.data.data.sid : '';
      if (options.isAdmin) storage.set('synology_sid_admin', sid);
      else storage.set('synology_sid', sid);
      return sid;
    } catch (e) {
      return '';
    }
  },
  testSid: async (sid = ''): Promise<ListResponse> => {
    try {
      const response: { data: ListResponse; status: string } = await axios.get(
        encodeURI(`${endPoint}/list?path=Anime&_sid=${sid}`)
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
        encodeURI(`${endPoint}/list?path=${encodeURIComponent(reqPath)}`)
      );
      if (response.data.error) latestErrorCode = response.data.error.code;
      if (response.data.success) latestErrorCode = 200;
      return response.data;
    } catch (e) {
      return { data: {}, success: false };
    }
  },
  getDownloadURL: (path: string, isDownload = false): string => {
    return `${hostName}${downloadPath}${encodeURIComponent(path)}${
      isDownload ? forceDownload : ''
    }`;
  },
  getAuthDownloadURL: (url: string): string => {
    const sid = storage.get('synology_sid');
    if (sid && sid.length > 0) return `${url}&_sid=${sid}`;
    return '';
  },
  move: async (from: string, to: string, sid = '') => {
    if (sid.length === 0) sid = storage.get('synology_sid_admin') || '';
    try {
      from = from.startsWith('/public_video')
        ? encodeURIComponent(from)
        : encodeURIComponent(`/public_video${from}`);
      to = to.startsWith('/public_video')
        ? encodeURIComponent(to)
        : encodeURIComponent(`/public_video${to}`);
      await axios.get(`${endPoint}/move?from=${from}&to=${to}&sid=${sid}`);
      return true;
    } catch (e) {
      return false;
    }
  },
};

export default SynologyApi;
