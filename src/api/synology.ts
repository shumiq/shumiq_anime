import axios from 'axios';
import {storage} from "../utils/localstorage";
import {ListResponse, SignInResModel} from "../models/SynologyApiModel";

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

const SynologyApi = {
  signIn: async (): Promise<string> => {
    const response: {
      data: SignInResModel;
    } = await axios.get(`${endPoint}/signin`);
    const sid = response.data.success ? response.data.data.sid : '';
    storage.set('synology_sid', sid);
    return sid;
  },
  list: async (
    path: string,
    sortByDate = false,
    isAdditional = false,
  ): Promise<ListResponse> => {
    let sid = storage.get('synology_sid'); ;
    if (!sid || sid.length === 0) sid = await SynologyApi.signIn();
    const reqPath = `${path}${sortByDate ? sortBy.date : sortBy.name}${
      isAdditional ? additional : ''
    }&_sid=${sid}`;
    const response: { data: ListResponse; status: string } = await axios.get(
      `${endPoint}/list?path=${encodeURIComponent(reqPath)}`
    );
    return response.data;
  },
  getDownloadURL: (path: string): string => {
    return `${hostName}${downloadPath}${path}`;
  },
  getAuthDownloadURL: (url: string): string => {
    let sid = storage.get("synology_sid") ;
    if (sid && sid.length > 0) return `${url}&_sid=${sid}`;
    return '';
  },
};

export default SynologyApi;
