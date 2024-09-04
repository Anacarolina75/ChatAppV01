const express = require('express');
const router = express.Router();
const db = require('../banco/db');

// Listar todas as mensagens de uma conversa específica
router.get('/:idConversa', (req, res) => {
  const { idConversa } = req.params;
  const query = 'SELECT * FROM mensagens WHERE idConversa = ?';
  db.query(query, [idConversa], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Adicionar uma nova mensagem
router.post('/', (req, res) => {
  const { idConversa, idAtendente, texto, tipoMidia, caminhoMidia } = req.body;
  const query = 'INSERT INTO mensagens (idConversa, idAtendente, texto, tipoMidia, caminhoMidia) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [idConversa, idAtendente, texto, tipoMidia, caminhoMidia], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: results.insertId, idConversa, idAtendente, texto, tipoMidia, caminhoMidia });
  });
});

// Atualizar uma mensagem existente
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { texto, tipoMidia, caminhoMidia } = req.body;
  const query = 'UPDATE mensagens SET texto = ?, tipoMidia = ?, caminhoMidia = ? WHERE id = ?';
  db.query(query, [texto, tipoMidia, caminhoMidia, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id, texto, tipoMidia, caminhoMidia });
  });
});

// Excluir uma mensagem
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM mensagens WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Mensagem excluída com sucesso' });
  });
});


async function adicionarMensagem(servidor, contato, mensagem) {
  try {
    // Passo 1: Buscar o servidor
    let [servidores] = await db.execute('SELECT id FROM servidores WHERE nome = ?', [servidor]);
    let servidor = servidores[0];
    let servidorId;

    if (servidor) {
      servidorId = servidor.id;
    } else {
      // Criar um novo servidor se não existir
      const [result] = await db.execute('INSERT INTO servidores (nome) VALUES (?)', [servidor]);
      servidorId = result.insertId;
    }

    // Passo 2: Buscar o contato
    let [contatos] = await db.execute(
      'SELECT id, mensagens FROM contatos WHERE servidor_id = ? AND email = ?',
      [servidorId, contatoEmail]
    );
    let contato = contatos[0];

    if (contato) {
      // Atualizar as mensagens do contato existente
      const mensagensAtualizadas = contato.mensagens + '\n' + mensagem;
      await db.execute('UPDATE contatos SET mensagens = ? WHERE id = ?', [mensagensAtualizadas, contato.id]);
    } else {
      // Criar um novo contato e adicionar a mensagem
      await db.execute(
        'INSERT INTO contatos (servidor_id, email, mensagens) VALUES (?, ?, ?)',
        [servidorId, contatoEmail, mensagem]
      );
    }

    console.log('Mensagem adicionada com sucesso!');
  } catch (error) {
    console.error('Erro ao adicionar mensagem:', error);
  }
}


module.exports = router;
