require('dotenv').config({ path: '.env' });
const admin = require('firebase-admin');

const serviceAccount = {
    type: 'service_account',
    project_id: 'shumiq-anime',
    private_key_id: '698e04aa6455b9f5702209a938a70bfb10ade19a',
    private_key: process.env.GOOGLE_APPLICATION_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: 'firebase-adminsdk-gt4ye@shumiq-anime.iam.gserviceaccount.com',
    client_id: '103418106253556858172',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url:
        'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-gt4ye%40shumiq-anime.iam.gserviceaccount.com',
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://shumiq-anime.firebaseio.com',
});

module.exports = admin;