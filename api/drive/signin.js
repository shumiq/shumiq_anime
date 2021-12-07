require('dotenv').config({ path: '.env' });
const express = require('express');
const axios = require('axios');
const router = express.Router();
const admin = require('../utils/firebase');

const signInUrl =
  'https://shumiq.synology.me:5001/webapi/auth.cgi?api=SYNO.API.Auth&version=3&method=login&account=__USERNAME__&passwd=__PASSWORD__&session=FileStation&format=sid';

router.get('/', async (req, res) => {
  const token = req.query.token?.toString() || '';
  const currentUser =
    token === '' ? null : await admin.auth().verifyIdToken(token);
  const adminUID = process.env.FIREBASE_ADMIN_UID || 'undefined';
  let username = process.env.SYNOLOGY_API_GUEST_USERNAME || 'undefined';
  let password = process.env.SYNOLOGY_API_GUEST_PASSWORD || 'undefined';
  let role = 'guest';
  if (adminUID === currentUser?.uid) {
    username = process.env.SYNOLOGY_API_ADMIN_USERNAME || username;
    password = process.env.SYNOLOGY_API_ADMIN_PASSWORD || password;
    role = 'admin';
  }
  const signInRes = await axios.get(
    signInUrl
      .replace('__USERNAME__', username)
      .replace('__PASSWORD__', password)
  );
  res.send({ role: role, ...signInRes.data });
});

module.exports = router;
