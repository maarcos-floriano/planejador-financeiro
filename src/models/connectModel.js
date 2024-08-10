var database = require('../database/config');

function conexao(query) {
  return database.executar(query);
}
module.exports = {
  conexao
};