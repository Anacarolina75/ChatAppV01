const express = require('express');
const router = express.Router();
const db = require('../banco/db');

module.exports = (io) => {
  router.post('/', async (req, res) => {
    const { numeroDestinatario, numeroOriginario, mensagem } = req.body;

    try {
      // Insere a mensagem recebida no banco de dados
      const insertQuery = 'INSERT INTO mensagens (numero_originario, numero_destinatario, texto) VALUES (?, ?, ?)';
      await db.query(insertQuery, [numeroOriginario, numeroDestinatario, mensagem]);

      // Emite a mensagem recebida para os clientes conectados
      io.emit('mensagemRecebida', { numeroDestinatario, numeroOriginario, mensagem });

      res.json({ message: 'Mensagem recebida com sucesso!' });
    } catch (error) {
      console.error('Erro ao receber mensagem:', error);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  });

  return router;
};
