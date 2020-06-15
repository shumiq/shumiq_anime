import shareRouter from './router/share';
import serverless from 'serverless-http';
import express from 'express';

const app: express.Application = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/.netlify/functions/api/v1/share', shareRouter);

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
exports.handler = serverless(app);
