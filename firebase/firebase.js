const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Certifique-se que o caminho está correto

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
