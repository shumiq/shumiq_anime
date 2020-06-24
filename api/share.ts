import opengraphGenerator from './utils/animeOg';
import { NowRequest, NowResponse } from '@vercel/node';
import admin from 'firebase-admin';

const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS || '{}';

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccount)),
  databaseURL: 'https://shumiq-anime.firebaseio.com',
});

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  const snapshot = await admin
    .database()
    .ref('myanimelist_database/anime/' + req.query.anime.toString())
    .once('value');
  const anime = snapshot.val() as {
    title: string;
    score: string;
    year: number;
    season: number;
    download: number;
    info: string;
    cover_url: string;
  };
  const resHtml = opengraphGenerator(anime);
  res.send(resHtml);
};
