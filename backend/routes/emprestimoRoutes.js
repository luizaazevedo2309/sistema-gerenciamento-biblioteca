const express = require('express');
const router = express.Router();
const pool = require('../db');

// Cadastrar empréstimo
router.post('/', async (req, res) => {
const { data_emprestimo, data_devolucao, cpf, isbn, status } = req.body;

if (!data_emprestimo || !data_devolucao || !cpf || !isbn || !status) {
  return res.status(400).send('Todos os campos são obrigatórios.');
}


  try {
    await pool.query(
      `INSERT INTO emprestimo (data_emprestimo, data_devolucao, cpf, isbn, status)
       VALUES ($1, $2, $3, $4, $5)`,
      [data_emprestimo, data_devolucao, cpf, isbn, status]
    );

    res.send('Empréstimo cadastrado com sucesso!');
  } catch (err) {
    res.status(500).send('Erro ao cadastrar empréstimo: ' + err.message);
  }
});

// Listar todos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM emprestimo ORDER BY id_emprestimo');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Erro ao listar empréstimos: ' + err.message);
  }
});



// DEVOLUÇÃO CRIADA AGORA 


// Buscar empréstimos ativos por CPF (com nome do livro)
router.get('/ativos/cliente/:cpf', async (req, res) => {
  const { cpf } = req.params;

  try {
    const result = await pool.query(`
      SELECT e.id_emprestimo, l.titulo
      FROM emprestimo e
      JOIN livro l ON l.isbn = e.isbn
      WHERE e.cpf = $1 AND LOWER(e.status) = 'emprestado'
      ORDER BY e.id_emprestimo
    `, [cpf]);

    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Erro ao buscar empréstimos ativos: ' + err.message);
  }
});




// Buscar por ID
router.get('/:id_emprestimo', async (req, res) => {
  const { id_emprestimo } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM emprestimo WHERE id_emprestimo = $1',
      [id_emprestimo]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('Empréstimo não encontrado.');
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Erro ao buscar empréstimo: ' + err.message);
  }
});


  router.put('/:id_emprestimo', async (req, res) => {
  const { id_emprestimo } = req.params;
  const { data_devolucao, isbn, cpf } = req.body;

  if (!data_devolucao || !isbn || !cpf) {
    return res.status(400).send('Data de devolução, ISBN e CPF são obrigatórios.');
  }

  try {
    const result = await pool.query(
      `UPDATE emprestimo
       SET data_devolucao = $1,
           isbn = $2,
           cpf = $3
       WHERE id_emprestimo = $4`,
      [data_devolucao, isbn, cpf, id_emprestimo]
    );

    if (result.rowCount === 0) {
      return res.status(404).send('Empréstimo não encontrado.');
    }

    res.send('Empréstimo atualizado com sucesso!');
  } catch (err) {
    res.status(500).send('Erro ao atualizar: ' + err.message);
  }
});

// Marcar devolução automaticamente para HOJE
router.put('/devolver/cpf/:cpf', async (req, res) => {
  const { cpf } = req.params;

  try {
    const result = await pool.query(
      `UPDATE emprestimo
       SET data_devolucao = CURRENT_DATE,
           status = 'devolvido'
       WHERE cpf = $1 AND status = 'emprestado'`,
      [cpf]
    );

    if (result.rowCount === 0) {
      return res.status(404).send('Nenhum empréstimo ativo encontrado para este CPF.');
    }

    res.send('Devolução registrada com sucesso!');
  } catch (err) {
    res.status(500).send('Erro ao registrar devolução: ' + err.message);
  }
});

// Devolver por ID do empréstimo
router.put('/devolver/:id_emprestimo', async (req, res) => {
  const { id_emprestimo } = req.params;

  try {
    const result = await pool.query(`
      UPDATE emprestimo
      SET data_devolucao = CURRENT_DATE,
          status = 'devolvido'
      WHERE id_emprestimo = $1 AND LOWER(status) = 'emprestado'
    `, [id_emprestimo]);

    if (result.rowCount === 0) {
      return res.status(404).send('Empréstimo não encontrado ou já devolvido.');
    }

    res.send('Devolução registrada com sucesso!');
  } catch (err) {
    res.status(500).send('Erro ao registrar devolução: ' + err.message);
  }
});

// Excluir um empréstimo
router.delete('/:id_emprestimo', async (req, res) => {
  const { id_emprestimo } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM emprestimo WHERE id_emprestimo = $1',
      [id_emprestimo]
    );

    if (result.rowCount === 0) {
      return res.status(404).send('Empréstimo não encontrado.');
    }

    res.send('Empréstimo excluído com sucesso!');
  } catch (err) {
    res.status(500).send('Erro ao excluir empréstimo: ' + err.message);
  }
});

  // Listar empréstimos por CPF (cliente) 
router.get('/cliente/:cpf', async (req, res) => {
  const { cpf } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        e.id_emprestimo,
        l.titulo AS titulo,
        e.data_emprestimo,
        e.data_devolucao,
        e.status
      FROM emprestimo e
      JOIN livro l ON l.isbn = e.isbn
      WHERE e.cpf = $1
      ORDER BY e.id_emprestimo
    `, [cpf]);

    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Erro ao buscar empréstimos do cliente.');
  }
});





module.exports = router;
