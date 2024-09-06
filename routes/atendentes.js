const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../banco/db');
const router = express.Router();

// Rota para criar um novo atendente
router.post('/register', async (req, res) => {
  const { nome, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const insertQuery = 'INSERT INTO atendentes (nome, email, password) VALUES (?, ?, ?)';
    await db.query(insertQuery, [nome, email, hashedPassword]);

    res.json({ message: 'Atendente cadastrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao cadastrar atendente:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Rota para listar atendentes
router.get('/', async (req, res) => {
  try {
    const atendentes = await db.query('SELECT * FROM atendentes');
    res.json(atendentes);
  } catch (error) {
    console.error('Erro ao listar atendentes:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

module.exports = router;
