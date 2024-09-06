const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../banco/db'); // Certifique-se de que o caminho está correto
const router = express.Router();

// Função para criar hash da senha
const hashPassword = async (senha) => {
  const saltRounds = 10;
  return bcrypt.hash(senha, saltRounds);
};

// Função para salvar um atendente no banco de dados
const saveAtendente = async (nome, email, senha) => {
  const hashedPassword = await hashPassword(senha);
  await db.query('INSERT INTO atendentes (nome, email, senha) VALUES (?, ?, ?)', [nome, email, hashedPassword]);
};

// Rota para registrar um atendente
router.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    // Validação básica
    if (!nome || !email || !senha) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    // Salva o atendente no banco de dados
    await saveAtendente(nome, email, senha);

    // Retorna sucesso
    res.status(201).json({ message: 'Atendente registrado com sucesso' });
  } catch (error) {
    console.error('Erro ao registrar atendente:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Rota para login de atendentes
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Consulta o atendente pelo email
    const [rows] = await db.query('SELECT * FROM atendentes WHERE email = ?', [email]);
    
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const atendente = rows[0];

    // Compara a senha fornecida com o hash armazenado
    const match = await bcrypt.compare(senha, atendente.senha);
    if (!match) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Gera o token JWT
    const token = jwt.sign({ id: atendente.id, email: atendente.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });

  } catch (error) {
    console.error('Erro ao autenticar:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

module.exports = router;
