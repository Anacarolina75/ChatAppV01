const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// Importe das rotas
const clientsRoutes = require('./routes/clientes');
const agentsRoutes = require('./routes/atendentes');
const conversationsRoutes = require('./routes/conversas');
const messagesRoutes = require('./routes/mensagens');
const tagsRoutes = require('./routes/tags');

// Usando as rotas
app.use('/api/clientes', clientsRoutes);
app.use('/api/atendentes', agentsRoutes);
app.use('/api/conversas', conversationsRoutes);
app.use('/api/mensagens', messagesRoutes);
app.use('/api/tags', tagsRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
