var mysql = require('mysql2');
require('dotenv').config()

var msqlConfig = {
  host: 'localhost',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: 'planilha_sptech'
}

var connection = mysql.createConnection(msqlConfig);

function executar(query) {
  return new Promise(function(resolve, reject){
    connection.query(query, function(error, results, fields){
      if(error){
        reject(error);
      }else{
        resolve(results);
      }
    });
  });
}

module.exports = {
  executar
};