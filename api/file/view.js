require('dotenv').config({ path: '.env' });
const express = require('express');
const router = express.Router();
const fs = require('fs');

const root = process.env.REACT_APP_VIDEO_PATH;

router.get('/', async (req, res) => {
  const path = req.query.path.toString().replace('/public_video/', '');
  const absPath = `${root}${path}`;
  try{
    const stat = fs.statSync(absPath);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(absPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(absPath).pipe(res);
    }
  } catch (e) {
    res.sendStatus(404);
  }

});

module.exports = router;
