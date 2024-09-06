const bcrypt = require('bcrypt');
const db = require('../banco/db'); // Ajuste o caminho conforme necessário

const hashPassword = async (senha) => {
  const saltRounds = 10;
  return bcrypt.hash(senha, saltRounds);
};

const saveAtendente = async (nome, email, senha) => {
  const hashedPassword = await hashPassword(senha);
  await db.query('INSERT INTO atendentes (nome, email, senha) VALUES (?, ?, ?)', [nome, email, hashedPassword]);
};

module.exports = { saveAtendente };
