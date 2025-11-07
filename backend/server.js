const express = require('express');
const cors = require('cors');
const pool = require('./db'); // conexão com o banco

const app = express();
const port = 3000;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Importa as rotas
const pessoaRoutes = require('./routes/pessoaRoutes');
const authRoutes = require('./routes/authRoutes');
const livroRoutes = require('./routes/livroRoutes'); 

// Usa as rotas
app.use('/pessoas', pessoaRoutes);
app.use('/login', authRoutes);
app.use('/livros', livroRoutes); 

// Rota de teste
app.get('/', (req, res) => res.send('Servidor da Biblioteca funcionando'));

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
