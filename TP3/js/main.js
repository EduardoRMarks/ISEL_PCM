/**<
FORMULÁRIO - TP3 - 22/23 - PCM

REALIZADO POR:
43498 Roman Ishchuk
45977 Eduardo Marques

DOCENTE:
Rui Jesus
*/
function FirstOption() {
  let fop = document.forms["fdpessoais"]["q4"].value;
  let sop = document.forms["fdpessoais"]["q5"].value;
  let top = document.forms["fdpessoais"]["q6"].value;
  if (fop == sop) {
    document.getElementById("s" + sop).checked = false;
  }
  if (fop == top) {
    document.getElementById("t" + top).checked = false;
  }
}

function SecondOption() {
  let fop = document.forms["fdpessoais"]["q4"].value;
  let sop = document.forms["fdpessoais"]["q5"].value;
  let top = document.forms["fdpessoais"]["q6"].value;
  if (sop == fop) {
    document.getElementById("f" + fop).checked = false;
  }
  if (sop == top) {
    document.getElementById("t" + top).checked = false;
  }
}

function ThirdOption() {
  let fop = document.forms["fdpessoais"]["q4"].value;
  let sop = document.forms["fdpessoais"]["q5"].value;
  let top = document.forms["fdpessoais"]["q6"].value;
  if (top == fop) {
    document.getElementById("f" + fop).checked = false;
  }
  if (top == sop) {
    document.getElementById("s" + sop).checked = false;
  }
}

function Write_Text() {
  let x = document.forms["fdpessoais"]["q7"].value;
  if (x == "não") {
    document.forms["fdpessoais"]["q8"].disabled = true;
    document.forms["fdpessoais"]["q8"].value = "";
  } else {
    document.forms["fdpessoais"]["q8"].disabled = false;
  }
}

let char = "#";
let xml = "";
let key;

/**
 * Vai buscar só as keys que nos interessam
 * @returns
 */

function getKeys() {
  let keys = [];

  for (let key in window.localStorage) {
    if (key.startsWith(char)) {    
      keys.push(key);
    }
  }
  keys.sort;
  return keys;
}

function getNKeys() {
  let keys = [];
  
    for (let key in window.localStorage) {
      if (key.startsWith(char)) keys.push(key);
    }
    keys.sort;
    return keys.length;
}

/**
 * Valida as forms e guarda em local storage em formato xml
 * @param {nome da form} name
 * @param {numero da pergunta inicial} x
 * @param {numero da pergunta final} y
 */
function validateForm(name, x, y) {
  let numberKeys = getNKeys();
  if (numberKeys == 0) {
    key = char + 1;
  } else {
    if (x == 1) {
      key = char + (numberKeys + 1);
    } else {
      key = char + numberKeys;
    }
  }

  xml = localStorage.getItem(key);

  if (x == 1) {
    xml = "<Questionario>";
  }

  for (let i = x; i <= y; i++) {
    let id_str = "q" + i;
    xml +=
      '<q id="' + id_str + '">' + document.forms[name][id_str].value + "</q>";
  }

  if (y == 23) {
    xml += "</Questionario>";
  }
  localStorage.setItem(key, xml);
}

/**
 * Procura o valor desejado no array.
 * @param {valor desejado} value
 * @param {array} array
 * @returns número de ocorrências
 */
function find(value, array) {
  let aux = 0;
  for (let i = 0; i < array.length; i++) {
    if (value == array[i]) {
      aux += 1;
    }
  }
  return aux;
}

/**
 * Desenha um gráfico de barras
 * @param {Valores da pergunta 17} n
 */
function drawColumnGraph(n) {
  let height = n.length + 20;
  document.write("<h3> Gráfico de barras da pergunta 17</h3>");
  document.write(
    '<canvas id="columnGraph" width="500" height="' + height + '"></canvas>'
  );

  let canvas = document.getElementById("columnGraph");
  let ctx = canvas.getContext("2d");
  let width = 20; // grossura da barra
  let X = 30; // posição da primeira barra

  //desenho dos retangulos
  for (let i = 1; i <= 5; i++) {
    ctx.fillStyle = "#008080";
    let h = find(i, n);
    ctx.fillRect(X, canvas.height - h, width, h);
    X += width + 35;

    // texto por cima
    ctx.fillStyle = "#4da6ff";
    ctx.fillText("Valor " + i + "  " + ":" + h, X - 60, canvas.height - h - 10);
  }
}
/**
 * Desenha o gráfico circular
 * @param {Valores da pergunta 1} n
 */
function drawPieChart(n) {
  document.write("<h3> Gráfico circular da pergunta 1</h3>");
  document.write('<canvas id="pieChart" width="200" height="200"></canvas>');

  let canvas = document.getElementById("pieChart");
  let ctx = canvas.getContext("2d");

  //data da pergunta 1
  let data = [
    {
      label: ">14",
      value: find("menor 14", n),
      color: "pink",
    },
    {
      label: "14-17",
      value: find("14-17", n),
      color: "skyBlue",
    },
    {
      label: "18-25",
      value: find("18-25", n),
      color: "yellow",
    },
    {
      label: "26-35",
      value: find("26-35", n),
      color: "red",
    },
    {
      label: ">35",
      value: find("> 35", n),
      color: "green",
    },
  ];

  //cálculo do número de objetos
  let total = 0;
  for (obj of data) {
    total += obj.value;
  }

  let previousRadian;
  //ponto do meio do canvas
  let middle = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: canvas.height / 2,
  };

  //desenho do circulo a preto
  ctx.beginPath();
  ctx.arc(middle.x, middle.y, middle.radius, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = "black";
  ctx.fill();

  //desenho das várias partes do gráfico
  for (obj of data) {
    previousRadian = previousRadian || 0;
    //cálculo da percentagem
    obj.percentage = parseInt((obj.value / total) * 100);

    ctx.beginPath();
    ctx.fillStyle = obj.color;
    obj.radian = Math.PI * 2 * (obj.value / total);
    ctx.moveTo(middle.x, middle.y);
    ctx.arc(
      middle.x,
      middle.y,
      middle.radius - 2,
      previousRadian,
      previousRadian + obj.radian,
      false
    );
    ctx.closePath();
    ctx.fill();
    ctx.save();
    ctx.translate(middle.x, middle.y);
    ctx.fillStyle = "black";
    ctx.font = middle.radius / 10 + "px Arial";
    ctx.rotate(previousRadian + obj.radian);
    let labelText = "" + obj.label + " -> " + obj.percentage + "%";
    ctx.fillText(labelText, ctx.measureText(labelText).width / 2, 0);
    ctx.restore();

    previousRadian += obj.radian;
  }
}

/**
 * Vai buscar o data do local storage, e guarda num ficheiro html
 */
function getDataForm() {
  let xmlDoc = document.implementation.createDocument(null, "xml", null);
  let todo_index = getKeys();
  let user = 0;
  let dataForColumnChart = [];
  let dataForPieChart = [];
  document.write('<div div class="' + "format" + '">');
  console.log(todo_index[0]);
  for (let i = 0; i < todo_index.length; i++) {
    let pergunta = 0;
    let localStorageRow = window.localStorage.getItem(
      todo_index[i]
    );
    console.log(localStorageRow);
    if (window.DOMParser) {
      let parser = new DOMParser();
      xmlDoc = parser.parseFromString(localStorageRow, "text/xml");
    }
    //console.log(localStorageRow);
    let valores = [];
    let x = xmlDoc.getElementsByTagName("q");

    for (let j = 0; j < x.length; j++) {
      if (x[j].childNodes[0] == undefined) {
        valores.push("Não respondeu");
      } else {
        valores.push(x[j].childNodes[0].nodeValue);
      }
    }
    user = user + 1;
    document.write("<h1>User " + user + "</h1>");

    for (let k = 0; k < x.length; k++) {
      pergunta = pergunta + 1;
      if (k == 0) {
        document.write("<h3>Informações pessoais</h3>");
        dataForPieChart.push(valores[k]);
      }
      if (k == 8) {
        document.write("<h3>Tarefas</h3>");
      }
      if (k == 13) {
        document.write("<h3>Experiência de utilização</h3>");
      }
      if (k == 17) {
        dataForColumnChart.push(valores[k]);
      }

      document.write("<p> Pergunta " + pergunta + ": " + valores[k] + "</p>");
    }

    document.write("<br>");
  }
  drawColumnGraph(dataForColumnChart);
  drawPieChart(dataForPieChart);
  document.write("</div>");
}
