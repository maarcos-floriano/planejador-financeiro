if (!sessionStorage.getItem("id")) {
  window.location.href = "/index.html";
}

const TIMEOUT_DURATION = 90000; // 15 minutos

let inactivityTimer;

resetInactivityTimer();

function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(logout, TIMEOUT_DURATION);
}

function logout() {
  localStorage.removeItem("password");
  window.location.href = "/login.html"; // Redirecionar para a página de login
}

const ctx = document.getElementById("chart");
let idCard = null;

let mainChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      {
        type: "bar",
        label: "Informações sobre sua receita",
        data: [],
        borderWidth: 1,
        backgroundColor: ["#218837", "#ce2d05", "#F2AB27"],
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

async function registra(event) {
  event.preventDefault();
  const valorBttn = event.submitter.value;
  let id = idCard;
  let categoria;

  const item = event.target[0].value;
  const valor = event.target[1].value;

  if (valorBttn == "income") {
    categoria = "Receita";
  } else {
    categoria = "Despesa";
  }

  let query;
  let method;

  if (id == null) {
    query = `INSERT INTO registro_financeiro (categoria, item, valor, fkUser) VALUES ('${categoria}', '${item}', ${valor}, ${sessionStorage.getItem(
      "id"
    )})`;
    method = "POST";
  } else {
    query = `UPDATE registro_financeiro SET categoria = '${categoria}', item = '${item}', valor = ${valor} WHERE id = ${id}`;
    method = "PUT";
  }
  event.target[0].value = "";
  event.target[1].value = "";


  console.log(query);
  console.log(method);

  const result = await consultaBanco(query, method);
  
  console.log("result");
  console.log(result);

  obterPlanilhas();
  updateChart();
  resetInactivityTimer();
}

async function obterPlanilhas() {
  const query = "SELECT * FROM registro_financeiro ORDER BY data DESC";
  const method = "GET";
  const result = await consultaBanco(query, method);
  createSpreadSheet(result);
}

function createSpreadSheet(objets) {
  const listCard = document.getElementById("listCard");
  listCard.innerHTML = "";

  for (const obj of objets) {
    const data = converterData(obj.data);

    const classColor = obj.categoria.toLowerCase();
    listCard.innerHTML += `
    <div onclick="editar(this)" ondblclick="deletar(this)" id="card_${obj.id}" class="card">
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
    </div>`;
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
    `;
  const method = "GET";
  const result = await consultaBanco(query, method);
  const labels = Object.keys(result[0]);
  const data = Object.values(result[0]).map((val) => Number.parseInt(val));

  mainChart.data.labels = labels;
  mainChart.data.datasets[0].data = data;
  mainChart.update();
  resetInactivityTimer();
}

function editar(event) {
  const card = event;
  const valores = card.querySelectorAll(".card > p");

  const item = valores[0].innerHTML.slice(6);
  const valor = valores[1].innerHTML.slice(9);

  idCard = card.id.slice(5);
  document.getElementById("item").value = item;
  document.getElementById("value").value = valor;
  resetInactivityTimer();
}

async function deletar(event) {
  const card = event;
  const id = card.id.slice(5);

  const query = `DELETE FROM registro_financeiro WHERE id = ${id}`;
  const method = "DELETE";

  const result = await consultaBanco(query, method);
  idCard = null;
  obterPlanilhas();
  updateChart();
  resetInactivityTimer();
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

const initWindow = document.createElement("div");
initWindow.id = "initWindow";
initWindow.classList = "init-window";
initWindow.innerHTML = `<img src="https://moodle.sptech.school/pluginfile.php/1/core_admin/logo/0x200/1692971033/sptech_principal_ciano.png" alt="SPTech - São Paulo Tech School"></img>`;
document.body.appendChild(initWindow);

window.onload = () => {
  const time = setTimeout(() => {
    document.getElementById("initWindow").style.opacity = 0;
    document.querySelectorAll("section").forEach((section) => {
      section.style.visibility = "visible";
      section.style.opacity = 1;
    });
  }, 2500);
};

document.addEventListener("mousemove", resetInactivityTimer);
document.addEventListener("keydown", resetInactivityTimer);
document.addEventListener("click", resetInactivityTimer);
