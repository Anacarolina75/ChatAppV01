require('dotenv').config();
const mysql = require('mysql2');

// Configuração da conexão com o banco de dados usando variáveis de ambiente
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Conectando ao banco de dados
db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    process.exit(1);
  }
  console.log('Conectado ao banco de dados MySQL');
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
      'SELECT id, mensagens FROM contatos WHERE servidor_id = ? AND tefelone = ?',
      [servidor, contatoEmail]
    );
    let contato = contatos[0];

    if (contato) {
      // Atualizar as mensagens do contato existente
      const mensagensAtualizadas = contato.mensagens + '\n' + novaMensagem;
      await db.execute('UPDATE contatos SET mensagens = ? WHERE id = ?', [mensagensAtualizadas, contato.id]);
    } else {
      // Criar um novo contato e adicionar a mensagem
      await db.execute(
        'INSERT INTO contatos (servidor_id, email, mensagens) VALUES (?, ?, ?)',
        [servidorId, contatoEmail, novaMensagem]
      );
    }

    console.log('Mensagem adicionada com sucesso!');
  } catch (error) {
    console.error('Erro ao adicionar mensagem:', error);
  }
}


module.exports = db;
