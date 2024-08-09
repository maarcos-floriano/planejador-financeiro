var conexaoModel = require('../models/connectModel');

function conexao(req, res){
  var query = req.params.query;
  conexaoModel.conexao(query)
  .then(function(resultados){
    res.json(resultados);
  })
  .catch(function(erro){
    console.log("[ERRO] erro ao executar o comando::"+ erro);
    res.status(500).json(erro.sqlMessage);
  });
}

module.exports = {
  conexao
};