var mysql = require('mysql2');

var msqlConfig = {
  host: 'localhost',
  user: 'payment',
  password: 'root',
  database: 'payment'
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