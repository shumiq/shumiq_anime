import videoGenerator from './utils/animeView';
import { NowRequest, NowResponse } from '@vercel/node';
export default (req: NowRequest, res: NowResponse): void => {
  const url = req.query.url.toString();
  const resHtml = videoGenerator(url);
  res.send(resHtml);
};
