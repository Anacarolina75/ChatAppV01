
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const db = require('./banco/db');

// Configura dotenv para carregar variáveis de ambiente
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(bodyParser.json());

// Importando e utilizando as rotas
const authRoutes = require('./routes/auths');
const clienteRoutes = require('./routes/clientes');
const conversaRoutes = require('./routes/conversas');
const mensagemRoutes = require('./routes/mensagens');
const tagRoutes = require('./routes/tags');
const atendenteRoutes = require('./routes/atendentes');

// Configuração das rotas
app.use('/auths', authRoutes);
app.use('/clientes', clienteRoutes);
app.use('/conversas', conversaRoutes(io)); // Passa o io para conversas
app.use('/mensagens', mensagemRoutes(io)); // Passa o io para mensagens
app.use('/tags', tagRoutes);
app.use('/atendentes', atendenteRoutes);

// Configuração das rotas de webhook
const webhookRoutes = require('./routes/webhooks');
app.use('/webhooks', webhookRoutes(io)); // Passa o io para webhooks

// Inicializa o Socket.IO
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

// Porta para o servidor HTTP
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log('Server is running on port 8000');
});

// Porta para o Socket.IO
const SOCKET_PORT = process.env.SOCKET_PORT;

server.listen(SOCKET_PORT, () => {
  console.log(`Servidor Socket.IO rodando na porta ${SOCKET_PORT}`);
});
