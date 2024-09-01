const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar todas as mensagens de uma conversa específica
router.get('/:idConversa', (req, res) => {
  const { idConversa } = req.params;
  const query = 'SELECT * FROM mensagens WHERE idConversa = ?';
  db.query(query, [idConversa], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Adicionar uma nova mensagem
router.post('/', (req, res) => {
  const { idConversa, idAtendente, texto, tipoMidia, caminhoMidia } = req.body;
  const query = 'INSERT INTO mensagens (idConversa, idAtendente, texto, tipoMidia, caminhoMidia) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [idConversa, idAtendente, texto, tipoMidia, caminhoMidia], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: results.insertId, idConversa, idAtendente, texto, tipoMidia, caminhoMidia });
  });
});

// Atualizar uma mensagem existente
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { texto, tipoMidia, caminhoMidia } = req.body;
  const query = 'UPDATE mensagens SET texto = ?, tipoMidia = ?, caminhoMidia = ? WHERE id = ?';
  db.query(query, [texto, tipoMidia, caminhoMidia, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id, texto, tipoMidia, caminhoMidia });
  });
});

// Excluir uma mensagem
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM mensagens WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Mensagem excluída com sucesso' });
  });
});

module.exports = router;
