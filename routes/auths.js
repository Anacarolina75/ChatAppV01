const express = require('express');
const router = express.Router();
const admin = require('../firebase/firebase');
const db = require('../banco/db'); // Conexão com o banco de dados MySQL

// Registro
router.post('/register', async (req, res) => {
  const { email, password, nome } = req.body;

  try {
    // Criação do usuário no Firebase
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: nome,
    });

    // Armazenamento das informações no MySQL
    const query = 'INSERT INTO atendentes (nome, email, tagUsuario) VALUES (?, ?, ?)';
    db.query(query, [nome, email, 'agent'], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ uid: userRecord.uid });
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await admin.auth().getUserByEmail(email);
    const token = await admin.auth().createCustomToken(user.uid);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
