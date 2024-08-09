document.getElementById('finance-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const descricao = document.getElementById('description').value;
  const valor = parseFloat(document.getElementById('amount').value);
  const tipo = document.getElementById('type').value;

  if (descricao === '' || isNaN(valor)) return;

  const listaEntradas = document.getElementById('entries-list');
  const li = document.createElement('li');
  li.textContent = `${descricao} - ${tipo === 'income' ? '+' : '-'}${valor.toFixed(2)}`;
  listaEntradas.appendChild(li);

  atualizarResumo(tipo, valor);
  limparFormulario();
});

function atualizarResumo(tipo, valor) {
  const receitaTotalElem = document.getElementById('total-income');
  const despesaTotalElem = document.getElementById('total-expenses');
  const saldoElem = document.getElementById('balance');

  let receitaTotal = parseFloat(receitaTotalElem.textContent);
  let despesaTotal = parseFloat(despesaTotalElem.textContent);

  if (tipo === 'income') {
      receitaTotal += valor;
      receitaTotalElem.textContent = receitaTotal.toFixed(2);
  } else {
      despesaTotal += valor;
      despesaTotalElem.textContent = despesaTotal.toFixed(2);
  }

  const saldo = receitaTotal - despesaTotal;
  saldoElem.textContent = saldo.toFixed(2);
}

function limparFormulario() {
  document.getElementById('description').value = '';
  document.getElementById('amount').value = '';
}


function obterPlanilhas() {
  const query = "SELECT "
  consultaBanco(query);
}

async function consultaBanco(caminho, metodo) {
  return await fetch(`${caminho}`, {
    method: `${metodo}`,
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (resposta) {
      if (resposta.ok) {
        return resposta.json();
      }
    })
    .catch(function (resposta) {
      console.log(`#ERRO: ${resposta}`);
    });
}