const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');

app.listen(port, () => console.log(`Listening on port ${port}`));
app.use(cors());

app.use('/api/drive/signin', require('./drive/signin'));
app.use('/api/drive/list', require('./drive/list'));
app.use('/api/drive/move', require('./drive/move'));
app.use('/api/share', require('./share'));
