const express = require('express');
const router = express.Router();
const db = require('../banco/db');

// Adicione uma referência ao Socket.IO para emissão de eventos
module.exports = (io) => {

  // Listar todas as conversas
  router.get('/', (req, res) => {
    db.query('SELECT * FROM conversas', (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  });

  // Adicionar uma nova conversa
  router.post('/', (req, res) => {
    const { cliente_id, atendente_id } = req.body;
    const query = 'INSERT INTO conversas (cliente_id, atendente_id) VALUES (?, ?)';
    db.query(query, [cliente_id, atendente_id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ conversa_id: results.insertId, cliente_id, atendente_id });
    });
  });

  // Atribuir uma conversa a um atendente
  router.put('/:conversa_id/atribuir', (req, res) => {
    const { conversa_id } = req.params;
    const { atendente_id } = req.body;

    // Verificar se o usuário autenticado é admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Permissão negada' });
    }

    const query = 'UPDATE conversas SET atendente_id = ? WHERE conversa_id = ?';
    db.query(query, [atendente_id, conversa_id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      // Emitir evento para notificar sobre a atribuição de conversa
      io.emit('conversaAtribuida', { conversa_id, atendente_id });

      res.json({ message: 'Conversa atribuída com sucesso' });
    });
  });

  // Atualizar uma conversa existente
  router.put('/:conversa_id', (req, res) => {
    const { conversa_id } = req.params;
    const { cliente_id, atendente_id, arquivada } = req.body;
    const query = 'UPDATE conversas SET cliente_id = ?, atendente_id = ?, arquivada = ? WHERE conversa_id = ?';
    db.query(query, [cliente_id, atendente_id, arquivada, conversa_id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ conversa_id, cliente_id, atendente_id, arquivada });
    });
  });

  // Excluir uma conversa
  router.delete('/:conversa_id', (req, res) => {
    const { conversa_id } = req.params;
    const query = 'DELETE FROM conversas WHERE conversa_id = ?';
    db.query(query, [conversa_id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Conversa excluída com sucesso' });
    });
  });

  return router;
};
