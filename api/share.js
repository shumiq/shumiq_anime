const express = require('express');
const router = express.Router();
const opengraphGenerator = require('./utils/animeOg');
const admin = require('./utils/firebase');

router.get('/', async (req, res) => {
  const snapshot = await admin
    .database()
    .ref('myanimelist_database/anime/' + req.query.anime.toString())
    .once('value');
  const anime = snapshot.val();
  const resHtml = opengraphGenerator(anime);
  res.send(resHtml);
});

module.exports = router;