const express = require('express');
const router = express.Router();
const db = require('../banco/db');

// Listar todas as tags
router.get('/', (req, res) => {
  const query = 'SELECT * FROM tags';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Adicionar uma nova tag
router.post('/', (req, res) => {
  const { nome, cor, descricao } = req.body;
  const query = 'INSERT INTO tags (nome, cor, descricao) VALUES (?, ?, ?)';
  db.query(query, [nome, cor, descricao], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: results.insertId, nome, cor, descricao });
  });
});

// Atualizar uma tag existente
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nome, cor, descricao } = req.body;
  const query = 'UPDATE tags SET nome = ?, cor = ?, descricao = ? WHERE tag_id = ?';
  db.query(query, [nome, cor, descricao, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id, nome, cor, descricao });
  });
});

// Excluir uma tag
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  // Verificar se a tag está associada a alguma conversa
  const checkAssociationsQuery = 'SELECT COUNT(*) AS count FROM conversa_tags WHERE tag_id = ?';
  db.query(checkAssociationsQuery, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result[0].count > 0) {
      return res.status(400).json({ error: 'Tag está associada a uma conversa e não pode ser excluída.' });
    }
    
    const query = 'DELETE FROM tags WHERE tag_id = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Tag excluída com sucesso' });
    });
  });
});

// Associar uma tag a uma conversa
router.post('/associate', (req, res) => {
  const { idConversa, idTag } = req.body;
  const query = 'INSERT INTO conversa_tags (conversa_id, tag_id) VALUES (?, ?)';
  db.query(query, [idConversa, idTag], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ idConversa, idTag });
  });
});

// Desassociar uma tag de uma conversa
router.delete('/dissociate', (req, res) => {
  const { idConversa, idTag } = req.body;
  const query = 'DELETE FROM conversa_tags WHERE conversa_id = ? AND tag_id = ?';
  db.query(query, [idConversa, idTag], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Tag desassociada da conversa com sucesso' });
  });
});

module.exports = router;
