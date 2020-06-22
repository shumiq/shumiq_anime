import opengraphGenerator from './utils/animeOg';
import axios from 'axios';
import { NowRequest, NowResponse } from '@vercel/node';

const rest_url =
  'https://shumiq-anime.firebaseio.com/myanimelist_database/anime/';

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  console.log(req.query.anime);
  const response: {
    data: {
      title: string;
      score: string;
      year: number;
      season: number;
      download: number;
      info: string;
      cover_url: string;
    };
  } = await axios.get(rest_url + req.query.anime.toString() + '.json');
  const anime = response.data;
  const resHtml = opengraphGenerator(anime);
  res.send(resHtml);
};
