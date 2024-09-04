const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const http = require('http');
const admin = require('firebase-admin');

// Importando e utilizando as rotas
app.use('/auths', require('./routes/auths'));
app.use('/webhooks', require('./routes/webhooks'));
app.use('/clientes', require('./routes/clientes'));
app.use('/conversas', require('./routes/conversas'));
app.use('/mensagens', require('./routes/mensagens'));
app.use('/tags', require('./routes/tags'));
app.use('/atendentes', require('./routes/atendentes'));

app.use(bodyParser.json());
dotenv.config();

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:8000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }
});


app.post('/webhooks', async (req, res) => {
  const mensagem = req.body.mensagem;
  const servidor = req.body.servidor;
  const contato = req.body.contato;

  console.log(`Servidor: ${servidor}, Contato: ${contato}, Mensagem: ${mensagem}`);

  try {
    await adicionarMensagem(servidor, contato, mensagem);
    res.status(200).send('Mensagem processada com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao processar a mensagem.');
  }
});


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log('Server is running on port 8000');
});

const SOCKET_PORT = process.env.SOCKET_PORT || 3001;

server.listen(SOCKET_PORT, () => {
  console.log(`Servidor Socket.IO rodando na porta ${SOCKET_PORT}`);
});


// Evento de conexão do Socket.IO
io.on('connection', (socket) => {
  console.log('Novo cliente conectado:', socket.id);

  // Escuta por novas mensagens
  socket.on('novaMensagem', (dados) => {
    // Envia a nova mensagem para todos os clientes conectados
    io.emit('mensagemRecebida', dados);
  });

  // Desconexão
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});


// Rota principal
app.get('/', (req, res) => {
    res.send('API do WhatsApp Clone');
  });

