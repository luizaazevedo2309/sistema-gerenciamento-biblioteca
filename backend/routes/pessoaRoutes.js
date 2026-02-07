
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { v4: uuidv4 } = require('uuid'); 



const tokensEmMemoria = {}; 

//  CADASTRAR CLIENTE (público - tela inicial)

router.post('/', async (req, res) => {
  const { cpf, nome, email, telefone, senha } = req.body;

  if (!cpf || !nome || !senha) {
    return res.status(400).send('cpf, nome e senha são obrigatórios.');
  }

  try {
    await pool.query(
      `INSERT INTO pessoa (cpf, nome, email, senha, telefone, tipo)
       VALUES ($1, $2, $3, $4, $5, 'cliente')`,
      [cpf, nome, email || null, senha, telefone || null]
    );

    res.send('Cliente cadastrado com sucesso!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao cadastrar cliente: ' + err.message);
  }
});


// CADASTRAR FUNCIONÁRIO (feito por outro funcionário)

router.post('/funcionario', async (req, res) => {
  const { cpf, nome, email, telefone, senha } = req.body;

  if (!cpf || !nome || !senha) {
    return res.status(400).send('cpf, nome e senha são obrigatórios.');
  }

  try {
    await pool.query(
      `INSERT INTO pessoa (cpf, nome, email, senha, telefone, tipo)
       VALUES ($1, $2, $3, $4, $5, 'funcionario')`,
      [cpf, nome, email || null, senha, telefone || null]
    );

    res.send('Funcionário cadastrado com sucesso!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao cadastrar funcionário: ' + err.message);
  }
});


//(clientes e funcionários)

router.post('/login', async (req, res) => {
  const { cpf, senha } = req.body;
  if (!cpf || !senha) {
    return res.status(400).send('CPF e senha são obrigatórios.');
  }

  try {
    const result = await pool.query(
      'SELECT cpf, nome, tipo FROM pessoa WHERE cpf = $1 AND senha = $2',
      [cpf, senha]
    );

    if (result.rows.length === 0) {
      return res.status(401).send('CPF ou senha incorretos.');
    }

    const usuario = result.rows[0];
    const token = uuidv4(); 
    tokensEmMemoria[token] = usuario;

    res.json({
      ok: true,
      token,
      usuario,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao fazer login: ' + err.message);
  }
});


// LISTAR TODAS AS PESSOAS

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT cpf, nome, email, telefone, tipo FROM pessoa ORDER BY nome'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Erro ao listar pessoas: ' + err.message);
  }
});

//ADICIONEI ISSO AGORAAA, CASO DE ERRO É SO TIRAR

// LISTAR APENAS FUNCIONÁRIOS
router.get('/funcionario', async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT cpf, nome, email, telefone, tipo FROM pessoa WHERE tipo = 'funcionario' ORDER BY nome"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Erro ao listar funcionários: ' + err.message);
  }
});







//  BUSCAR PESSOA POR CPF

router.get('/:cpf', async (req, res) => {
  const { cpf } = req.params;
  try {
    const result = await pool.query(
      'SELECT cpf, nome, email, telefone, tipo FROM pessoa WHERE cpf = $1',
      [cpf]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Pessoa não encontrada');
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Erro ao buscar pessoa: ' + err.message);
  }
});


//  ATUALIZAR PESSOA

router.put('/:cpf', async (req, res) => {
  const { cpf } = req.params;
  const { nome, email, senha, telefone, tipo } = req.body;

  try {
    await pool.query(
      `UPDATE pessoa 
       SET nome = $1, email = $2, senha = $3, telefone = $4, tipo = $5
       WHERE cpf = $6`,
      [nome, email, senha, telefone, tipo, cpf]
    );
    res.send('Pessoa atualizada com sucesso!');
  } catch (err) {
    res.status(500).send('Erro ao atualizar pessoa: ' + err.message);
  }
});


//  DELETAR PESSOA

router.delete('/:cpf', async (req, res) => {
  const { cpf } = req.params;
  try {
    await pool.query('DELETE FROM pessoa WHERE cpf = $1', [cpf]);
    res.send('Pessoa excluída com sucesso!');
  } catch (err) {
    res.status(500).send('Erro ao excluir pessoa: ' + err.message);
  }
});


module.exports = router;
