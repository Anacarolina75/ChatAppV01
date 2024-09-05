const express = require('express');
const router = express.Router();
const db = require('../banco/db');

  
  // Listar todos os atendentes
  router.get('/', (req, res) => {
    const query = 'SELECT * FROM atendentes';
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });

  // Adicionar um novo atendente
  router.post('/', (req, res) => {
    const { nome, email, tagUsuario } = req.body;
    const query = 'INSERT INTO atendentes (nome, email, tagUsuario) VALUES (?, ?, ?)';
    db.query(query, [nome, email, tagUsuario], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: results.insertId, nome, email, tagUsuario });
    });
  });

  // Atualizar um atendente existente
  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nome, email, tagUsuario } = req.body;
    const query = 'UPDATE atendentes SET nome = ?, email = ?, tagUsuario = ? WHERE id = ?';
    db.query(query, [nome, email, tagUsuario, id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id, nome, email, tagUsuario });
    });
  });

  // Excluir um atendente
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM atendentes WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Atendente excluído com sucesso' });
    });
  });

  module.exports = router;

