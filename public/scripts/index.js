async function registra(event) {
  const valorBttn = event.submitter.value;
  let categoria;

  const item = event.target[0].value;
  const valor = event.target[1].value;

  if (valorBttn == "income") {
    categoria = "Receita";
  } else {
    categoria = "Despesa";
  }

  const query = `INSERT INTO registro_financeiro (categoria, item, valor, fkUser) VALUES ('${categoria}', '${item}', ${valor}, 1)`;
  const method = "POST";
  
  const result = await consultaBanco(query, method);  
}

async function obterPlanilhas() {
  const query = "SELECT * FROM registro_financeiro";
  const method = "GET";
  const result = await consultaBanco(query, method);
  console.log(result);
  createSpreadSheet(result)
}

function createSpreadSheet(objets) {
  const listCard = document.getElementById("listCard");
  listCard.innerHTML = "";

  for (const obj of objets) {
    console.log("OBJETO ==> "+ JSON.stringify(obj));
    const data = converterData(obj.data);

    const classColor = obj.categoria.toLowerCase(); 
    listCard.innerHTML += `
    <div onclick="editar(this)" class="card">
      <div class="info-card">
        <b class="tag ${classColor}" >
          ${obj.categoria}
        </b>
        <p>
          ${data}
        </p>
      </div>
      <p>Item: ${obj.item}</p>
      <p>Valor: R$${obj.valor}</p>
    </div>`
  }
}

obterPlanilhas();

function converterData(data) {
  let newData = new Date(data).toLocaleDateString();
  return newData.slice(-7);
}

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