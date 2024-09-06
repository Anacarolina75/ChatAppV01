const express = require('express');
const verifyToken = require('../middlewares/auth');
const db = require('../banco/db');
const router = express.Router();

module.exports = (io) => {
  // Rota para listar as conversas
  router.get('/', verifyToken, async (req, res) => {
    try {
      const conversas = await db.query('SELECT * FROM conversas WHERE atendente_id = ?', [req.user.id]);
      res.json(conversas);
    } catch (error) {
      console.error('Erro ao listar conversas:', error);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  });

  return router;
};
