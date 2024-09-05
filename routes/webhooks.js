const express = require('express');
const router = express.Router();
const db = require('../banco/db'); // Supondo que você tenha configurado sua conexão MySQL

router.post('/webhooks', async (req, res) => {
  try {
    const { servidor, telefoneCliente, mensagem } = req.body;

    // Validar os dados recebidos
    if (!servidor || !telefoneCliente || !mensagem) {
      return res.status(400).json({ error: 'Dados insuficientes' });
    }

    // Passo 2: Verificar se o cliente já existe no banco de dados
    const [cliente] = await db.query(
      'SELECT * FROM clientes WHERE telefone = ?',
      [telefoneCliente]
    );

    let clienteId;
    if (cliente) {
      clienteId = cliente.id;
    } else {
      // Se o cliente não existir, criar um novo cliente
      const [novoCliente] = await db.query(
        'INSERT INTO clientes (nome, telefone) VALUES (?, ?)',
        [telefoneCliente, telefoneCliente] // Aqui, o nome do cliente será o número até que um nome seja fornecido
      );
      clienteId = novoCliente.insertId;
    }

    // Passo 3: Verificar se já existe uma conversa para o cliente
    const [conversa] = await db.query(
      'SELECT * FROM conversas WHERE idCliente = ? AND arquivada = FALSE',
      [clienteId]
    );

    let conversaId;
    if (conversa) {
      conversaId = conversa.id;
    } else {
      // Se não houver conversa, criar uma nova
      const [novaConversa] = await db.query(
        'INSERT INTO conversas (idCliente) VALUES (?)',
        [clienteId]
      );
      conversaId = novaConversa.insertId;
    }

    // Passo 4: Inserir a mensagem na tabela de mensagens
    await db.query(
      'INSERT INTO mensagens (idConversa, texto, dataEnvio) VALUES (?, ?, NOW())',
      [conversaId, mensagem]
    );

    return res.status(200).json({ message: 'Mensagem processada com sucesso' });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
});

module.exports = router;


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



