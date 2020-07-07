import opengraphGenerator from './utils/animeOg';
import { NowRequest, NowResponse } from '@vercel/node';
import admin, { ServiceAccount } from 'firebase-admin';
// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.env.local' });
const serviceAccount = {
  type: 'service_account',
  project_id: 'shumiq-anime',
  private_key_id: '698e04aa6455b9f5702209a938a70bfb10ade19a',
  private_key: process.env.GOOGLE_APPLICATION_PRIVATE_KEY,
  client_email: 'firebase-adminsdk-gt4ye@shumiq-anime.iam.gserviceaccount.com',
  client_id: '103418106253556858172',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-gt4ye%40shumiq-anime.iam.gserviceaccount.com',
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
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
