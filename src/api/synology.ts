import axios from 'axios';

const hostName = 'http://shumiq.synology.me:5000';
const endPoint = `${
  process.env.REACT_APP_API_ENDPOINT?.toString() || 'http//:localhost:3000'
}/api/drive`;
const downloadPath =
  '/webapi/entry.cgi?api=SYNO.FileStation.Download&version=2&method=download&mode=open&path=';
const additional = '&additional=["size","time"]';
const sortBy = {
  name: '&sort_by=name',
  date: '&sort_by=mtime&sort_direction=desc',
};

interface signInResModel {
  data: {
    sid: string;
  };
  success: boolean;
}

export interface listResModel {
  data: {
    files: {
      additional?: {
        size: number;
        time: {
          atime: number;
          crtime: number;
          ctime: number;
          mtime: number;
        };
      };
      isdir?: boolean;
      name: string;
      path: string;
    }[];
    offset?: number;
    total?: number;
  };
  success?: boolean;
}

const SynologyApi = {
  signIn: async (): Promise<string> => {
    const response: {
      data: signInResModel;
    } = await axios.get(`${endPoint}/signin`);
    const sid = response.data.success ? response.data.data.sid : '';
    localStorage.setItem('synology_sid', sid);
    return sid;
  },
  list: async (
    path: string,
    sortByDate = false,
    isAdditional = false,
    isRetry = false
  ): Promise<listResModel> => {
    let sid = localStorage.getItem('synology_sid');
    if (!sid || sid.length === 0) sid = await SynologyApi.signIn();
    const reqPath = `${path}${sortByDate ? sortBy.date : sortBy.name}${
      isAdditional ? additional : ''
    }&_sid=${sid}`;
    const response: { data: listResModel; status: string } = await axios.get(
      `${endPoint}/list?path=${encodeURIComponent(reqPath)}`
    );
    if (response.data.success || !isRetry) {
      return response.data;
    } else {
      await SynologyApi.signIn();
      return SynologyApi.list(path, sortByDate, isAdditional, false);
    }
  },
  getDownloadURL: (path: string): string => {
    return `${hostName}${downloadPath}${path}`;
  },
  getAuthDownloadURL: (url: string): string => {
    const sid = localStorage.getItem('synology_sid');
    if (sid && sid.length > 0) return `${url}&_sid=${sid}`;
    return '';
  },
};

export default SynologyApi;
