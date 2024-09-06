const express = require('express');
const verifyToken = require('../middlewares/auth');
const db = require('../banco/db');
const router = express.Router();

module.exports = (io) => {
  // Rota para enviar mensagem
  router.post('/', verifyToken, async (req, res) => {
    const { conversa_id, mensagem } = req.body;

    try {
      // Insere a mensagem no banco de dados
      const insertQuery = 'INSERT INTO mensagens (conversa_id, mensagem, atendente_id) VALUES (?, ?, ?)';
      await db.query(insertQuery, [conversa_id, mensagem, req.user.id]);

      // Emite a mensagem para os outros clientes conectados
      io.emit('mensagemRecebida', { conversa_id, mensagem });

      res.json({ message: 'Mensagem enviada com sucesso!' });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  });

  return router;
};
