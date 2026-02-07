const express = require('express');
const router = express.Router();
const pool = require('../db');

// Cadastrar relação livro-categoria
router.post('/', async (req, res) => {
  const { isbn, codigo } = req.body;

  if (!isbn || !codigo) {
    return res.status(400).send('ISBN e código da categoria são obrigatórios.');
  }

  try {
    await pool.query(
      `INSERT INTO livro_categoria (isbn, codigo) VALUES ($1, $2)`,
      [isbn, codigo]
    );
    res.send('Relação livro-categoria cadastrada com sucesso!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao cadastrar relação: ' + err.message);
  }
});

// Listar todas as relações
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM livro_categoria ORDER BY isbn');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Erro ao listar relações: ' + err.message);
  }
});

// Buscar relações por ISBN
router.get('/:isbn', async (req, res) => {
  const { isbn } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM livro_categoria WHERE isbn = $1',
      [isbn]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('Nenhuma categoria encontrada para este livro.');
    }

    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Erro ao buscar relação: ' + err.message);
  }
});

// Atualizar relação (trocar categoria)
router.put('/:isbn/:codigo', async (req, res) => {
  const { isbn, codigo } = req.params;
  const { novoCodigo } = req.body;

  if (!novoCodigo) {
    return res.status(400).send('O novo código da categoria é obrigatório.');
  }

  try {
    const result = await pool.query(
      `UPDATE livro_categoria 
       SET codigo = $1
       WHERE isbn = $2 AND codigo = $3`,
      [novoCodigo, isbn, codigo]
    );

    if (result.rowCount === 0) {
      return res.status(404).send('Relação não encontrada.');
    }

    res.send('Relação atualizada com sucesso!');
  } catch (err) {
    res.status(500).send('Erro ao atualizar relação: ' + err.message);
  }
});

// Excluir relação
router.delete('/:isbn/:codigo', async (req, res) => {
  const { isbn, codigo } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM livro_categoria WHERE isbn = $1 AND codigo = $2',
      [isbn, codigo]
    );

    if (result.rowCount === 0) {
      return res.status(404).send('Relação não encontrada.');
    }

    res.send('Relação excluída com sucesso!');
  } catch (err) {
    res.status(500).send('Erro ao excluir relação: ' + err.message);
  }
});

module.exports = router;
