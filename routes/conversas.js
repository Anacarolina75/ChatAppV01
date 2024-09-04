const express = require('express');
const router = express.Router();
const db = require('../banco/db');
//const authenticate = require('../middlewares/middlewares');

// Listar todas as conversas
router.get('/', (req, res) => {
  db.query('SELECT * FROM conversas', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Adicionar uma nova conversa
router.post('/', (req, res) => {
  const { idCliente, idAtendente } = req.body;
  const query = 'INSERT INTO conversas (idCliente, idAtendente) VALUES (?, ?)';
  db.query(query, [idCliente, idAtendente], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: results.insertId, idCliente, idAtendente });
  });
});


// Atribuir uma conversa a um atendente
router.put('/:id/atribuir', (req, res) => {
  const { id } = req.params;
  const { idAtendente } = req.body;

  // Verificar se o usuário autenticado é admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Permissão negada' });
  }

  const query = 'UPDATE conversas SET idAtendente = ? WHERE id = ?';
  db.query(query, [idAtendente, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Conversa atribuída com sucesso' });
  });
});

// Atualizar uma conversa existente
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { idCliente, idAtendente, arquivada } = req.body;
  const query = 'UPDATE conversas SET idCliente = ?, idAtendente = ?, arquivada = ? WHERE id = ?';
  db.query(query, [idCliente, idAtendente, arquivada, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id, idCliente, idAtendente, arquivada });
  });
});

// Excluir uma conversa
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM conversas WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Conversa excluída com sucesso' });
  });
});

module.exports = router;
