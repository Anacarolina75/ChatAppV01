const express = require('express');
const router = express.Router();
const db = require('../banco/db');

module.exports = (io) => {
  router.post('/', async (req, res) => {
    try {
      const { numero, texto } = req.body;
      
      // Identificar o servidor pelo número
      const servidorQuery = 'SELECT * FROM servidor WHERE numero = ?';
      const [servidores] = await db.promise().query(servidorQuery, [numero]);
      
      if (servidores.length === 0) {
        return res.status(404).json({ message: 'Servidor não encontrado' });
      }

      // Verificar se o número já está cadastrado como contato
      const contatoQuery = 'SELECT * FROM clientes WHERE telefone = ?';
      const [contatos] = await db.promise().query(contatoQuery, [numero]);
      
      if (contatos.length > 0) {
        const cliente_id = contatos[0].cliente_id;
        const conversaQuery = 'SELECT * FROM conversas WHERE cliente_id = ? AND atendente_id IS NOT NULL';
        const [conversas] = await db.promise().query(conversaQuery, [cliente_id]);
        
        if (conversas.length > 0) {
          const conversa_id = conversas[0].conversa_id;
          const mensagemQuery = 'INSERT INTO mensagens (conversa_id, texto) VALUES (?, ?)';
          await db.promise().query(mensagemQuery, [conversa_id, texto]);
          
          io.emit('mensagemRecebida', { cliente_id, texto });
          
          return res.status(200).json({ message: 'Mensagem adicionada ao contato existente' });
        }
      }
      
      // Criar novo contato e adicionar a mensagem
      const clienteQuery = 'INSERT INTO clientes (telefone) VALUES (?)';
      const [result] = await db.promise().query(clienteQuery, [numero]);
      const novo_cliente_id = result.insertId;
      
      const novaConversaQuery = 'INSERT INTO conversas (cliente_id) VALUES (?)';
      const [novaConversa] = await db.promise().query(novaConversaQuery, [novo_cliente_id]);
      const nova_conversa_id = novaConversa.insertId;
      
      const novaMensagemQuery = 'INSERT INTO mensagens (conversa_id, texto) VALUES (?, ?)';
      await db.promise().query(novaMensagemQuery, [nova_conversa_id, texto]);
      
      io.emit('mensagemRecebida', { cliente_id: novo_cliente_id, texto });
      
      res.status(201).json({ message: 'Novo contato criado e mensagem adicionada' });
    } catch (error) {
      console.error('Erro no webhook:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  return router;
};
