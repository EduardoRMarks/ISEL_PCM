"use strict";
/**FOTOPRINT - TP4 - 22/23 - PCM

REALIZADO POR:
43498 Roman Ishchuk
45977 Eduardo Marques

DOCENTE:
Rui Jesus**/
class FotoPrint {
  /**
   * Construtor
   */
  constructor() {
    this.thingInMotion = null;
    this.offsetx = null;
    this.offsety = null;
    this.isSelected = false;
    this.selectedItem = null;
    this.ObjColor = "#808080";
    this.BackgroundColor = null;
    this.shpinDrawing = new Pool(100);
    this.insert = new Pool(100);
  }

  /**
   * Criação dos objetos que ficam no primeiro canvas, e adicionados à pool shpinDrawing.
   */
  init() {
    let r = new Rect(50, 70, 20, 20, "gray");
    this.shpinDrawing.insert(r);

    let o = new Oval(150, 70, 50, 1, 1, "gray");
    this.shpinDrawing.insert(o);

    let h = new Heart(250, 70, 80, "gray");
    this.shpinDrawing.insert(h);

    let dad = new Picture(300, 50, 70, 70, "imgs/allison1.jpg");
    this.shpinDrawing.insert(dad);

    let bear = new Bear(450, 90, 3, 20, 20, "gray");
    this.shpinDrawing.insert(bear);

    let star = new Star(580, 70, "gray");
    this.shpinDrawing.insert(star);

    let ghost = new Ghost(750, 70, 100, 100, "gray");
    this.shpinDrawing.insert(ghost);
  }

  /**
   * Desenho de todos os objetos na pool shpinDrawing no canvas select.
   * @param {canvas select} cnv
   */
  drawObj(cnv) {
    for (let i = 0; i < this.shpinDrawing.stuff.length; i++) {
      this.shpinDrawing.stuff[i].draw(cnv);
    }
  }
  /**
   * Desenho de todos os objetos na pool insert no canvas draw.
   * @param {canvas draw} cnv
   */
  drawObj2(cnv) {
    //console.log(this.insert.stuff.length);
    for (let i = 0; i < this.insert.stuff.length; i++) {
      this.insert.stuff[i].draw(cnv);
    }
  }
  /**
   * Este método é chamado quando é accionado o evento mouse down.
   * Ele vai percorrer todos os objetos, verifica se as coordenadas do rato está por cima de algum objeto
   * da pool insert. Caso estiver, guarda o objeto em "thingInMotion" e coloca o objeto no fim da pool insert.
   * @param {coord x} mx
   * @param {coord y} my
   * @returns true caso as coordenadas do rato estão por cima de um objeto e este foi guardado em "thingInMotion"
   */
  dragObj(mx, my) {
    let endpt = this.insert.stuff.length - 1;

    for (let i = endpt; i >= 0; i--) {
      if (this.insert.stuff[i].mouseOver(mx, my)) {
        this.offsetx = mx - this.insert.stuff[i].posx;
        this.offsety = my - this.insert.stuff[i].posy;
        let item = this.insert.stuff[i];
        this.thingInMotion = this.insert.stuff.length - 1;
        this.insert.stuff.splice(i, 1);
        this.insert.stuff.push(item);
        return true;
      }
    }
    return false;
  }

  /**
   * Define as novas posições do objeto que estamos a mover.
   * @param {coord x} mx
   * @param {coord y} my
   */
  moveObj(mx, my) {
    this.insert.stuff[this.thingInMotion].setPos(mx, my);
  }

  /**
   * Remove o objeto da pool insert.
   */
  removeObj() {
    this.insert.remove();
  }

  /**
   * Este método é só chamado quando é accionado o evento double click.
   * Ele vai percorrer todos os objetos dentro da pool insert, e caso o rato estiver por cima de um objeto, clona o mesmo, e
   * adiciona o clone na pool insert.
   * @param {coord x} mx
   * @param {coord y} my
   * @returns  true caso as coordenadas do rato estão por cima de um objeto e este foi clonado
   */
  insertObj(mx, my) {
    let item = null;
    let endpt = this.insert.stuff.length - 1;

    for (let i = endpt; i >= 0; i--) {
      if (this.insert.stuff[i].mouseOver(mx, my)) {
        item = this.cloneObj(this.insert.stuff[i], 20, 20, this.color, false);
        this.insert.insert(item);
        return true;
      }
    }
    return false;
  }

  /**
   * Coloca na pool insert um novo objeto que provem do makeObj.
   * @param {coord x} mx
   * @param {coord y} my
   * @returns true caso sucesso
   */
  insertSelectedObj(mx, my) {
    this.insert.insert(this.makeObj(mx, my));
    return true;
  }

  /**
   * Este método é só chamado quando o evento click é accionado.
   * Ele vai percorrer todos os objetos na pool shpinDrawing. Caso o rato está por cima de algum,
   * vai clonar o objeto e guardá-lo em selectedItem.
   * @param {coord x} mx
   * @param {coord y} my
   * @returns true caso selecionado
   */
  selectObj(mx, my) {
    let endpt = this.shpinDrawing.stuff.length - 1;

    for (let i = endpt; i >= 0; i--) {
      if (this.shpinDrawing.stuff[i].mouseOver(mx, my)) {
        this.selectedItem = this.cloneObj(
          this.shpinDrawing.stuff[i],
          0,
          0,
          this.color,
          true
        );
        this.isSelected = true;
        return true;
      }
    }
    return false;
  }
  /**
   * Clona o objeto selecionado varias vezes para criar um efeito de sombra. Caso seja uma imagem, cria
   * um retângulo novo à volta da imagem.
   * @param {cancas select} cnv
   * @returns null caso não haja nenhum objeto selecionado
   */
  highlight(cnv) {
    let hilight;
    if (this.selectedItem == null) return null;
    else if (this.selectedItem.name == "P") {
      hilight = new Rect(
        293,
        45,
        this.selectedItem.w + 14,
        this.selectedItem.h + 10,
        "orange",
        true
      );
      hilight.draw(cnv);
    } else {
      hilight = this.cloneObj(this.selectedItem, 5, 5, "orange", true);
      hilight.draw(cnv);
      hilight = this.cloneObj(this.selectedItem, -5, -5, "orange", true);
      hilight.draw(cnv);
      hilight = this.cloneObj(this.selectedItem, -5, 5, "orange", true);
      hilight.draw(cnv);
      hilight = this.cloneObj(this.selectedItem, 5, -5, "orange", true);
      hilight.draw(cnv);
    }
  }
  /**
   * Este método vai clonar o objeto em questão com um offset em x e y. Caso estivermos a selecionar, a cor é a
   * do parâmetro. Caso estejamos a clonar, a cor é do objeto a ser clonado.
   * @param {objeto qual queremos clonar} obj
   * @param {offset em x} offsetx
   * @param {offset em y} offsety
   * @param {cor pretendida} color
   * @param {caso estejamos a selecionar} select
   * @returns objeto clonado
   */

  cloneObj(obj, offsetx, offsety, color, select) {
    let item = {};

    if (!select) {
      color = obj.color;
    }

    switch (obj.name) {
      case "R":
        item = new Rect(
          obj.posx + offsetx,
          obj.posy + offsety,
          obj.w,
          obj.h,
          color
        );
        break;

      case "P":
        item = new Picture(
          obj.posx + offsetx,
          obj.posy + offsety,
          obj.w,
          obj.h,
          obj.impath
        );
        break;

      case "O":
        item = new Oval(
          obj.posx + offsetx,
          obj.posy + offsety,
          obj.r,
          obj.hor,
          obj.ver,
          color
        );
        break;

      case "H":
        item = new Heart(
          obj.posx + offsetx,
          obj.posy + offsety,
          obj.drx * 4,
          color
        );
        break;

      case "B":
        item = new Bear(
          obj.posx + offsetx,
          obj.posy + offsety,
          obj.r,
          obj.hs,
          obj.vs,
          color
        );
        break;

      case "G":
        item = new Ghost(
          obj.posx + offsetx,
          obj.posy + offsety,
          obj.hs,
          obj.vs,
          color
        );
        break;
      case "S":
        item = new Star(obj.posx + offsetx, obj.posy + offsety, color);
        break;

      case "T":
        item = new Text(
          obj.posx + offsetx,
          obj.posy + offsety,
          obj.text,
          color
        );
        break;

      default:
        throw new TypeError("Can not clone this type of object");
    }
    return item;
  }

  /**
   * Cria um novo objeto, dependendo de qual está selecionado, nas coordenadas do rato.
   * @param {coord x} x
   * @param {coord y} y
   * @returns item criado
   */
  makeObj(x, y) {
    let item = {};

    switch (this.selectedItem.name) {
      case "R":
        item = new Rect(
          x,
          y,
          this.selectedItem.w,
          this.selectedItem.h,
          this.ObjColor
        );
        break;

      case "P":
        item = new Picture(
          x,
          y,
          this.selectedItem.w,
          this.selectedItem.h,
          this.selectedItem.impath
        );
        break;

      case "O":
        item = new Oval(
          x,
          y,
          this.selectedItem.r,
          this.selectedItem.hor,
          this.selectedItem.ver,
          this.ObjColor
        );
        break;

      case "H":
        item = new Heart(x, y, this.selectedItem.drx * 4, this.ObjColor);
        break;

      case "B":
        item = new Bear(
          x,
          y,
          this.selectedItem.r,
          this.selectedItem.hs,
          this.selectedItem.vs,
          this.ObjColor
        );
        break;

      case "G":
        item = new Ghost(
          x,
          y,
          this.selectedItem.hs,
          this.selectedItem.vs,
          this.ObjColor
        );
        break;

      case "S":
        item = new Star(x, y, this.ObjColor);
        break;

      case "T":
        item = new Text(this.posx, this.posy, this.text, this.ObjColor);
        break;

      default:
        throw new TypeError("Can not clone this type of object");
    }
    return item;
  }

  /**
   * Instancia um objeto Text com o texto pretendido, coloca o na pool insert e desenha o texto.
   * @param {canvas draw} cnv
   * @param {texto pretendido} text
   */
  insertText(cnv, text) {
    let item = new Text(100, 100, text, "black");
    this.insert.insert(item);
    item.draw(cnv);
  }
}

/**
 * Class pool existe para fácil acesso dos arrays com os objetos e para limitar o utilizador na criação dos objetos.
 * Permite inserir ou remover os objetos da pool.
 */
class Pool {
  constructor(maxSize) {
    this.size = maxSize;
    this.stuff = [];
  }

  insert(obj) {
    if (this.stuff.length < this.size) {
      this.stuff.push(obj);
    } else {
      alert(
        "The application is full: there isn't more memory space to include objects"
      );
    }
  }

  remove() {
    if (this.stuff.length !== 0) {
      this.stuff.pop();
    } else {
      alert("There aren't objects in the application to delete");
    }
  }
}
