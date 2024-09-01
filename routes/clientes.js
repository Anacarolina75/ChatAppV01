const express = require('express');
const router = express.Router();
const db = require('../db'); // Arquivo para centralizar a conexão com o banco de dados

// Listar todos os clientes
router.get('/', (req, res) => {
  const query = 'SELECT * FROM clientes';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Adicionar um novo cliente
router.post('/', (req, res) => {
  const { nome, telefone, email } = req.body;
  const query = 'INSERT INTO clientes (nome, telefone, email) VALUES (?, ?, ?)';
  db.query(query, [nome, telefone, email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: results.insertId, nome, telefone, email });
  });
});

// Atualizar um cliente existente
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nome, telefone, email } = req.body;
  const query = 'UPDATE clientes SET nome = ?, telefone = ?, email = ? WHERE id = ?';
  db.query(query, [nome, telefone, email, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id, nome, telefone, email });
  });
});

// Excluir um cliente
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM clientes WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Cliente excluído com sucesso' });
  });
});

module.exports = router;
