// /routes/webhook.js
const express = require('express');
const router = express.Router();
const db = require('../banco/db');
const axios = require('axios');

// Endpoint para receber webhooks do WhatsApp
router.post('/webhooks', (req, res) => {

  const mensagem = req.body.mensagem;
  const servidor = req.body.servidor;
  const contato = req.body.contato;


  console.log(servidor + contato + mensagem);

  /* identificar o servidor atraves do numero que vem na const servidor e verificar se nesse servidor existe cadastrado o numero originario
    se já existir (contato) no servidor vou adicionar a mensagem ao contato
    se não existir o contato irei criar dentro do servidor e adicionar a mensagem ao contato 
  */


/*
  // Verifica se o cliente já existe no banco
  db.query('SELECT id FROM clientes WHERE telefone = ?', [from], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      db.query('INSERT INTO clientes (telefone) VALUES (?)', [from], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        const clienteId = result.insertId;
        criarConversa(clienteId, text);
      });
    } else {
      const clienteId = results[0].id;
      criarConversa(clienteId, text);
    }
  });

  const criarConversa = (clienteId, texto) => {
    db.query('INSERT INTO conversas (idCliente) VALUES (?)', [clienteId], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      const conversaId = result.insertId;

      db.query('INSERT INTO mensagens (idConversa, texto) VALUES (?, ?)', [conversaId, texto], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.sendStatus(200);
      });
    });
  };
});
*/
})

module.exports = router;
