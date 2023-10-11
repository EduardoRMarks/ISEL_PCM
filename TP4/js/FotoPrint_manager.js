"use strict";
/**FOTOPRINT - TP4 - 22/23 - PCM

REALIZADO POR:
43498 Roman Ishchuk
45977 Eduardo Marques

DOCENTE:
Rui Jesus**/
let app = null;

/**
 * Função main vai inicializar todos os canvas.
 * No canvas do select, vai desenhar os objetos, e adicionar o evento click, que  seleciona o item.
 *
 * No canvas do draw, vai adicionar o evento double click, que cria um item novo, e mouse down, que
 * permite fazer drag and drop.
 */
function main() {
  //canvas select
  let cnv2 = document.getElementById("select");
  drawCanvasRect(cnv2);
  cnv2.style.backgroundColor = "white";
  app = new FotoPrint();
  app.init();
  app.drawObj(cnv2);
  cnv2.addEventListener("click", selectitem, false);

  //canvas draw
  let cnv = document.getElementById("draw");
  drawCanvasRect(cnv);
  cnv.style.backgroundColor = "white";
  cnv.addEventListener("dblclick", makenewitem, false);
  cnv.addEventListener("mousedown", drag, false);
}

/**
 * Limpa o canvas, desenha o canvas e a borda do canvas.
 * @param {canvas} cnv
 */
function drawCanvasRect(cnv) {
  let ctx = cnv.getContext("2d");

  ctx.clearRect(0, 0, cnv.width, cnv.height);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, cnv.width, cnv.height);
}

//Drag & Drop operation
//drag
function drag(ev) {
  let mx = null;
  let my = null;
  let cnv = document.getElementById("draw");

  let xPos = 0;
  let yPos = 0;
  [xPos, yPos] = getMouseCoord(cnv);
  mx = ev.x - xPos;
  my = ev.y - yPos;

  if (app.dragObj(mx, my)) {
    cnv.style.cursor = "pointer";
    cnv.addEventListener("mousemove", move, false);
    cnv.addEventListener("mouseup", drop, false);
  }
}

//Drag & Drop operation
//move
function move(ev) {
  let mx = null;
  let my = null;
  let cnv = document.getElementById("draw");

  let xPos = 0;
  let yPos = 0;
  [xPos, yPos] = getMouseCoord(cnv);
  mx = ev.x - xPos;
  my = ev.y - yPos;

  app.moveObj(mx, my);
  drawCanvasRect(cnv);
  app.drawObj2(cnv);
}

//Drag & Drop operation
//drop
function drop() {
  let cnv = document.getElementById("draw");

  cnv.removeEventListener("mousemove", move, false);
  cnv.removeEventListener("mouseup", drop, false);
  cnv.style.cursor = "crosshair";
}

//Insert a new Object on Canvas
//dblclick Event
function makenewitem(ev) {
  let mx = null;
  let my = null;
  let cnv = document.getElementById("draw");

  let xPos = 0;
  let yPos = 0;
  [xPos, yPos] = getMouseCoord(cnv);
  mx = ev.x - xPos;
  my = ev.y - yPos;

  if (app.insertObj(mx, my)) {
    drawCanvasRect(cnv);
    app.drawObj2(cnv);
  } else {
    if (app.isSelected) {
      drawselected(ev);
    }
  }
}

/**
 * A função selectitem vai ver se o click foi por cima de um objeto do
 * canvas select. Caso seja, limpa o canvas, faz highlight e desenha os objetos outra vez.
 * @param {click} ev
 */
function selectitem(ev) {
  let mx = null;
  let my = null;
  let cnv = document.getElementById("select");

  let xPos = 0;
  let yPos = 0;
  [xPos, yPos] = getMouseCoord(cnv);
  mx = ev.x - xPos;
  my = ev.y - yPos;

  app.selectObj(mx, my);
  drawCanvasRect(cnv);
  app.highlight(cnv);
  app.drawObj(cnv);
}

/**
 * Limpa o canvas e desenha todos os objetos, incluindo o selecionado.
 * @param {double click} ev
 */
function drawselected(ev) {
  let mx = null;
  let my = null;
  let cnv = document.getElementById("draw");

  let xPos = 0;
  let yPos = 0;
  [xPos, yPos] = getMouseCoord(cnv);
  mx = ev.x - xPos;
  my = ev.y - yPos;

  if (app.insertSelectedObj(mx, my)) {
    drawCanvasRect(cnv);
    app.drawObj2(cnv);
  }
}

//Delete button
//Onclick Event
function remove() {
  let cnv = document.getElementById("draw");

  app.removeObj();
  drawCanvasRect(cnv);
  app.drawObj2(cnv);
}

//Save button
//Onclick Event
function saveasimage() {
  try {
    let link = document.createElement("a");
    link.download = "imagecanvas.png";
    let canvas = document.getElementById("draw");
    link.href = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet- stream");
    link.click();
  } catch (err) {
    alert("You need to change browsers OR upload the file to a server.");
  }
}

//Mouse Coordinates for all browsers
function getMouseCoord(el) {
  let xPos = 0;
  let yPos = 0;

  while (el) {
    if (el.tagName === "BODY") {
      // deal with browser quirks with body/window/document and page scroll
      let xScroll = el.scrollLeft || document.documentElement.scrollLeft;
      let yScroll = el.scrollTop || document.documentElement.scrollTop;

      xPos += el.offsetLeft - xScroll + el.clientLeft;
      yPos += el.offsetTop - yScroll + el.clientTop;
    } else {
      // for all other non-BODY elements
      xPos += el.offsetLeft - el.scrollLeft + el.clientLeft;
      yPos += el.offsetTop - el.scrollTop + el.clientTop;
    }

    el = el.offsetParent;
  }
  return [xPos, yPos];
}

/**
 * Vai buscar a cor do input do html, e guarda na classe Fotoprint.
 */
function changeColor() {
  app.ObjColor = document.getElementById("cor").value;
}

/**
 * Muda a cor do background com a cor selecionada no input do html.
 */
function changeBackgroundColor() {
  app.BackgroundColor = document.getElementById("cor").value;

  let cnv = document.getElementById("draw");
  cnv.style.backgroundColor = app.BackgroundColor;
  drawCanvasRect(cnv);
  app.drawObj2(cnv);
}
/**
 *
 * @returns cor do input do html
 */
function cColor() {
  let color = document.getElementById("cor").value;
  return color;
}

/**
 * input do texto.
 */
function getText() {
  let textIn = document.getElementById("enter").value;
  let cnv = document.getElementById("draw");
  /*temos que fazer este cColor para guardar a cor de cada texto, caso contrario
    cada vez que arrastamos um texto, todos os textos mudam de cor*/
  let textOut = new Text(100, 100, textIn, cColor());
  app.insert.insert(textOut);
  app.drawObj2(cnv);
}

/**
 * Vai buscar o ficheiro, cria uma instância picture com o path deste ficheiro, e desenha no canvas.
 * @param {choose file} input
 */
function getPhoto(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.addEventListener("load", function () {
      var img = new Image();
      var src = reader.result;
      img.src = src;
      let cnv = document.getElementById("draw");
      let picture = new Picture(100, 100, 500, 500, src);
      app.insert.insert(picture);
      app.drawObj2(cnv);
    });
  }
  reader.readAsDataURL(input.files[0]);
}
