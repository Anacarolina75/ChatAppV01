const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./banco/db');

// Configura dotenv para carregar variáveis de ambiente
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000', // URL do frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Importa as rotas
const authRoutes = require('./routes/auths');
const clienteRoutes = require('./routes/clientes');
const conversaRoutes = require('./routes/conversas');
const mensagemRoutes = require('./routes/mensagens');
const tagRoutes = require('./routes/tags');
const atendenteRoutes = require('./routes/atendentes');
const webhookRoutes = require('./routes/webhooks');

// Configura as rotas
app.use('/auths', authRoutes);
app.use('/clientes', clienteRoutes);
app.use('/conversas', conversaRoutes(io)); // Passa o io para conversas
app.use('/mensagens', mensagemRoutes(io)); // Passa o io para mensagens
app.use('/tags', tagRoutes);
app.use('/atendentes', atendenteRoutes);
app.use('/webhooks', webhookRoutes(io)); // Passa o io para webhooks

// Inicializa o Socket.IO
io.on('connection', (socket) => {
  console.log('Novo cliente conectado:', socket.id);

  socket.on('novaMensagem', (dados) => {
    io.emit('mensagemRecebida', dados);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Porta do servidor
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
