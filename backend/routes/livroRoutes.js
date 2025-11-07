

const express = require('express');
const router = express.Router();
const pool = require('../db');


// Cadastrar novo livro

router.post('/', async (req, res) => {
  const { isbn, titulo, disponivel } = req.body;

  if (!isbn || !titulo) {
    return res.status(400).send('ISBN e título são obrigatórios.');
  }

  try {
    await pool.query(
      `INSERT INTO livro (isbn, titulo, disponivel)
       VALUES ($1, $2, COALESCE($3, true))`,
      [isbn, titulo, disponivel]
    );
    res.send('Livro cadastrado com sucesso!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao cadastrar livro: ' + err.message);
  }
});

//  Listar todos os livros

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM livro ORDER BY titulo');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao listar livros: ' + err.message);
  }
});


// Buscar livro por ISBN

router.get('/:isbn', async (req, res) => {
  const { isbn } = req.params;

  try {
    const result = await pool.query('SELECT * FROM livro WHERE isbn = $1', [isbn]);
    if (result.rows.length === 0) {
      return res.status(404).send('Livro não encontrado.');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar livro: ' + err.message);
  }
});


// Atualizar livro

router.put('/:isbn', async (req, res) => {
  const { isbn } = req.params;
  const { titulo, disponivel } = req.body;

  try {
    await pool.query(
      `UPDATE livro 
       SET titulo = $1, disponivel = $2 
       WHERE isbn = $3`,
      [titulo, disponivel, isbn]
    );
    res.send('Livro atualizado com sucesso!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar livro: ' + err.message);
  }
});


//  Excluir livro

router.delete('/:isbn', async (req, res) => {
  const { isbn } = req.params;

  try {
    await pool.query('DELETE FROM livro WHERE isbn = $1', [isbn]);
    res.send('Livro excluído com sucesso!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao excluir livro: ' + err.message);
  }
});

module.exports = router;
