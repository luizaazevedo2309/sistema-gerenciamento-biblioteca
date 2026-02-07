const express = require('express');
const router = express.Router();
const pool = require('../db');

// Cadastrar categoria
router.post('/', async (req, res) => {
  const { codigo, nome } = req.body;

  if (!codigo || !nome) {
    return res.status(400).send('Código e nome são obrigatórios.');
  }

  try {
    await pool.query(
      `INSERT INTO categoria (codigo, nome) VALUES ($1, $2)`,
      [codigo, nome]
    );
    res.send('Categoria cadastrada com sucesso!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao cadastrar categoria: ' + err.message);
  }
});

// Listar categorias
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categoria ORDER BY codigo');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Erro ao listar categorias: ' + err.message);
  }
});

// Buscar categoria por código
router.get('/:codigo', async (req, res) => {
  const { codigo } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM categoria WHERE codigo = $1',
      [codigo]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('Categoria não encontrada.');
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Erro ao buscar categoria: ' + err.message);
  }
});

// Atualizar categoria
router.put('/:codigo', async (req, res) => {
  const { codigo } = req.params;
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).send('O nome é obrigatório.');
  }

  try {
    const result = await pool.query(
      `UPDATE categoria SET nome = $1 WHERE codigo = $2`,
      [nome, codigo]
    );

    if (result.rowCount === 0) {
      return res.status(404).send('Categoria não encontrada.');
    }

    res.send('Categoria atualizada com sucesso!');
  } catch (err) {
    res.status(500).send('Erro ao atualizar categoria: ' + err.message);
  }
});

// Excluir categoria
router.delete('/:codigo', async (req, res) => {
  const { codigo } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM categoria WHERE codigo = $1',
      [codigo]
    );

    if (result.rowCount === 0) {
      return res.status(404).send('Categoria não encontrada.');
    }

    res.send('Categoria excluída com sucesso!');
  } catch (err) {
    res.status(500).send('Erro ao excluir categoria: ' + err.message);
  }
});

module.exports = router;
