const admin = require('../firebase/firebase');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Adiciona os dados do usuário ao objeto req
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = authenticate;
