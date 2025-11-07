const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'gerenciamentobiblioteca',
  password: '123',
  port: 5432
});

pool.connect()
  .then(() => console.log('Conectado ao PostgreSQL com sucesso!'))
  .catch(err => console.error('Erro ao conectar no PostgreSQL:', err));

module.exports = pool;
