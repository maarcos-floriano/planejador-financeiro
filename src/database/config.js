const { Pool } = require('pg');
require('dotenv').config();

// Configuração do pool de conexões
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL // Usando a variável de ambiente para a URL de conexão
});

// Função para executar consultas
async function executar(query, params = []) {
  const client = await pool.connect(); // Obtém um cliente do pool
  try {
    // Executa a consulta passando parâmetros (se houver)
    const res = await client.query(query, params);
    return res.rows; // Retorna os resultados
  } catch (error) {
    throw new Error(`Erro ao executar a consulta: ${error.message}`);
  } finally {
    client.release(); // Libere o cliente de volta ao pool
  }
}

// Exporta a função para uso em outros módulos
module.exports = {
  executar
};
