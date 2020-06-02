import shareRouter from './router/share';
import serverless from 'serverless-http';
import express from 'express';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/.netlify/functions/api/v1/share', shareRouter);

exports.handler = serverless(app);
