// /routes/auth.js
const express = require('express');
const router = express.Router();
const admin = require('../firebase/firebase');

// Registro
router.post('/register', async (req, res) => {
  const { email, password, nome } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: nome,
    });

    res.status(201).json({ uid: userRecord.uid });
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
