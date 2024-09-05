const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');

router.get('/protected', authenticate, (req, res) => {
  // dados do usuário
  res.json({ message: 'Acesso concedido', user: req.user });
});

module.exports = router;
