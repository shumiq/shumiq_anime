require('dotenv').config({ path: '.env' });
const admin = require('firebase-admin');

const serviceAccount = {
  "type": "service_account",
  "project_id": "shumiq-backend",
  "private_key_id": "0c4901d7358b3d093e369e207412292f34c65a4f",
  "private_key": process.env.GOOGLE_APPLICATION_PRIVATE_KEY.replace(/\\n/g, '\n'),
  "client_email": "firebase-adminsdk-h5sup@shumiq-backend.iam.gserviceaccount.com",
  "client_id": "102282889088527081660",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-h5sup%40shumiq-backend.iam.gserviceaccount.com"
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://shumiq-backend-default-rtdb.asia-southeast1.firebasedatabase.app',
});

module.exports = admin;
