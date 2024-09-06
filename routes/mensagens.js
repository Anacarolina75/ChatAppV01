const express = require('express');
const verifyToken = require('../middlewares/auth');
const db = require('../banco/db');
const router = express.Router();

module.exports = (io) => {
  // Rota para enviar mensagem
  router.post('/', verifyToken, async (req, res) => {
    const { conversa_id, mensagem, tipo, anexo } = req.body;

    try {
      // Insere a mensagem no banco de dados
      const insertQuery = 'INSERT INTO mensagens (conversa_id, texto, enviado_por, tipo, anexo) VALUES (?, ?, ?, ?, ?)';
      await db.query(insertQuery, [conversa_id, mensagem || null, req.user.id, tipo || 'texto', anexo || null]);

      // Emite a mensagem para os outros clientes conectados
      io.emit('mensagemRecebida', { conversa_id, mensagem, tipo, anexo });

      res.json({ message: 'Mensagem enviada com sucesso!' });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  });

  return router;
};
