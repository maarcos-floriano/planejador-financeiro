const ctx = document.getElementById("chart");

let mainChart = new Chart(ctx,  {
  type: 'bar',
  data: {
    labels: [],
      datasets: [{
        type: 'bar',
        label: 'Informações sobre sua receita',
        data: [],
        borderWidth: 1,
        backgroundColor: [
          '#218837',
          '#ce2d05',
          '#F2AB27'
        ]
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

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
  const query = "SELECT * FROM registro_financeiro ORDER BY data DESC";
  const method = "GET";
  const result = await consultaBanco(query, method);
  createSpreadSheet(result)
}

function createSpreadSheet(objets) {
  const listCard = document.getElementById("listCard");
  listCard.innerHTML = "";

  for (const obj of objets) {
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

async function updateChart() {
  const query = `
    SELECT receita.total receita, despesa.total despesa, (receita.total - despesa.total) total 
    FROM 
      (SELECT COALESCE(SUM(valor), 0) AS total 
      FROM registro_financeiro where categoria = "Despesa") AS despesa, 
      (SELECT COALESCE(SUM(valor), 0) AS total 
      FROM registro_financeiro WHERE categoria = "Receita") AS receita
    `;
  const method = "GET";
  const result = await consultaBanco(query, method);
  const labels = Object.keys(result[0]);
  const data = Object.values(result[0]).map(val => Number.parseInt(val))
  
  mainChart.data.labels = labels;
  mainChart.data.datasets[0].data = data; 
  mainChart.update();
}


obterPlanilhas();
updateChart();

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