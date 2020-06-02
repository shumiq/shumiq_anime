import opengraphGenerator from '../utils/animeOg';
import express from 'express';
import axios from 'axios';

const rest_url = 'https://shumiq-anime.firebaseio.com/database/animeList/';

let router = express.Router();
router.get('/:key', async (req, res) => {
  const response = await axios.get(rest_url + req.params.key + '.json');
  const anime = response.data;
  const resHtml = opengraphGenerator(anime);
  res.send(resHtml);
});

export default router;
