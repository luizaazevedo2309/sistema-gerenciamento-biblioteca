const express = require('express');
const cors = require('cors');
const pool = require('./db'); 

const app = express();
const port = 3000;


app.use(cors());
app.use(express.json());

// Importa as rotas
const pessoaRoutes = require('./routes/pessoaRoutes');
const authRoutes = require('./routes/authRoutes');
const livroRoutes = require('./routes/livroRoutes'); 
const categoriaRoutes = require('./routes/categoriaRoutes');
const livroCategoriaRoutes = require('./routes/livroCategoriaRoutes');
const emprestimoRoutes = require('./routes/emprestimoRoutes');





// Usa as rotas
app.use('/pessoas', pessoaRoutes);
app.use('/login', authRoutes);
app.use('/livros', livroRoutes); 
app.use('/categoria', categoriaRoutes);
app.use('/livroCategoria', livroCategoriaRoutes);
app.use('/emprestimos', emprestimoRoutes);




// Rota de teste
app.get('/', (req, res) => res.send('Servidor da Biblioteca funcionando'));

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
