// Rota para autenticação (login). 
// Gera um token simples (UUID) e guarda em memória para desenvolvimento.

const express = require('express');
const router = express.Router();
const pool = require('../db');
const { v4: uuidv4 } = require('uuid');

// armazenamento simples de tokens em memória: { token: { cpf, nome, tipo } }
const tokensEmMemoria = {};
module.exports.tokensEmMemoria = tokensEmMemoria; // exporta pra middleware acessar

// POST /login
// body: { cpf, senha }
router.post('/', async (req, res) => {
  const { cpf, senha } = req.body;
  if (!cpf || !senha)
    return res.status(400).send('CPF e senha são obrigatórios.');

  try {
    // Busca pessoa com cpf e senha
    const result = await pool.query(
      'SELECT cpf, nome, tipo FROM pessoa WHERE cpf = $1 AND senha = $2',
      [cpf, senha]
    );

    if (result.rows.length === 0) {
      return res.status(401).send('CPF ou senha inválidos.');
    }

    const usuario = result.rows[0];

    // Gera token e salva em memória
    const token = uuidv4();
    tokensEmMemoria[token] = {
      cpf: usuario.cpf,
      nome: usuario.nome,
      tipo: usuario.tipo
    };

    // Retorna token e dados básicos do usuário
    res.json({ ok: true, token, usuario: tokensEmMemoria[token] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no login: ' + err.message);
  }
});

module.exports = router;
