const express = require('express');
const router = express.Router();
const db = require('../banco/db');

module.exports = (io) => {
  // Listar todas as mensagens de uma conversa específica
  router.get('/:conversa_id', (req, res) => {
    const { conversa_id } = req.params;
    const query = 'SELECT * FROM mensagens WHERE conversa_id = ?';
    db.query(query, [conversa_id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });

  // Adicionar uma nova mensagem a uma conversa existente
  router.post('/:conversa_id', (req, res) => {
    const { conversa_id } = req.params;
    const { atendente_id, texto, tipoMidia, caminhoMidia } = req.body;
    const sql = 'INSERT INTO mensagens (conversa_id, atendente_id, texto, tipoMidia, caminhoMidia) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [conversa_id, atendente_id, texto, tipoMidia, caminhoMidia], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      const novaMensagem = {
        conversa_id,
        atendente_id,
        texto,
        tipoMidia,
        caminhoMidia
      };

      // Emitir o evento da nova mensagem via Socket.IO
      io.emit('mensagemRecebida', novaMensagem);

      res.json({ message: 'Mensagem enviada com sucesso' });
    });
  });

  // Atualizar uma mensagem existente
  router.put('/:mensagem_id', (req, res) => {
    const { mensagem_id } = req.params;
    const { texto, tipoMidia, caminhoMidia } = req.body;
    const query = 'UPDATE mensagens SET texto = ?, tipoMidia = ?, caminhoMidia = ? WHERE mensagem_id = ?';
    db.query(query, [texto, tipoMidia, caminhoMidia, mensagem_id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ mensagem_id, texto, tipoMidia, caminhoMidia });
    });
  });

  // Excluir uma mensagem
  router.delete('/:mensagem_id', (req, res) => {
    const { mensagem_id } = req.params;
    const query = 'DELETE FROM mensagens WHERE mensagem_id = ?';
    db.query(query, [mensagem_id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Mensagem excluída com sucesso' });
    });
  });

  return router;
};
