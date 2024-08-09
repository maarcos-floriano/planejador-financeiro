const category = document.getElementById("category");
const suggestions = document.getElementById("suggestion");

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


async function obterPlanilhas() {
  const query = "SELECT * FROM registro_financeiro";
  const method = "GET";
  const result = await consultaBanco(query, method);
  console.log(result);
  createSpreadSheet(result)
}

function createSpreadSheet(objets) {
  const areaResults = document.getElementById("areaResults");

  for (const obj of objets) {
    console.log(obj);
    const classColor = obj.categoria.toLowerCase(); 
    areaResults.innerHTML += `<div onclick="editar(this)" class="card"><p class="tag ${classColor}" >${obj.categoria}</p><p>Item: ${obj.item}</p><p>Valor ${obj.valor}</p></div>`
  }
}

obterPlanilhas();

async function consultaBanco(caminho, metodo) {
  return fetch(`http://localhost:3000/connect/${caminho}`, {
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