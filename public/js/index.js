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
  event.preventDefault();
  const valorBttn = event.submitter.value;
  let categoria;

  const item = event.target[0].value;
  const valor = event.target[1].value;

  if (valorBttn == "income") {
    categoria = "Receita";
  } else {
    categoria = "Despesa";
  }

  // if (event.)

  const query = `INSERT INTO registro_financeiro (id, categoria, item, valor, fkUser) VALUES ('${categoria}', '${item}', ${valor}, ${sessionStorage.getItem("id")})`;
  const method = "POST";

  event.target[0].value = ""
  event.target[1].value = ""
  
  const result = await consultaBanco(query, method);
  obterPlanilhas();
  updateChart()
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
    <div onclick="editar(this)" id="card_${obj.id}" class="card">
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
      FROM registro_financeiro 
      WHERE categoria = "Despesa" 
      AND MONTH(data) = MONTH(curdate()) 
      AND YEAR(data) = YEAR(curdate())) AS despesa, 
      (Select COALESCE(SUM(valor), 0) AS total 
      FROM registro_financeiro 
      WHERE categoria = "Receita" 
      AND MONTH(data) = MONTH(curdate()) 
      AND YEAR(data) = YEAR(curdate())) AS receita;
    `
    ;
  const method = "GET";
  const result = await consultaBanco(query, method);
  const labels = Object.keys(result[0]);
  const data = Object.values(result[0]).map(val => Number.parseInt(val))
  
  mainChart.data.labels = labels;
  mainChart.data.datasets[0].data = data; 
  mainChart.update();
}

function editar(event) {
  const card = event.currentTarget;
  const valores = card.querySelectorAll('.card > p');

  const item = valores[0].innerHTML;
  const valor = valores[1].innerHTML;

  document.getElementById("item").value = item; 
  document.getElementById("value").value = valor;


} 

obterPlanilhas();
updateChart();

function converterData(data) {
  let newData = new Date(data).toLocaleDateString();
  return newData.slice(-7);
}

async function consultaBanco(caminho, metodo) {
  return fetch(`/connect/${caminho}`, {
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

const initWindow = document.createElement('div');
initWindow.id = "initWindow";
initWindow.classList = "init-window";
initWindow.innerHTML = `<img src="https://moodle.sptech.school/pluginfile.php/1/core_admin/logo/0x200/1692971033/sptech_principal_ciano.png" alt="SPTech - São Paulo Tech School"></img>`;
document.body.appendChild(initWindow);

window.onload = () => {
  const time = setTimeout(() => {
    document.getElementById("initWindow").style.opacity = 0;
    document.querySelectorAll("section").forEach(section => {
      section.style.visibility = "visible";
      section.style.opacity = 1;
    });
  }, 2500);
}
