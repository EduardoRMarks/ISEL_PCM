/**FOTOPRINT - TP4 - 22/23 - PCM

REALIZADO POR:
43498 Roman Ishchuk
45977 Eduardo Marques

DOCENTE:
Rui Jesus**/

class DrawingObjects {
  constructor(px, py, name) {
    //ponto de referência e nome
    if (this.constructor === DrawingObjects) {
      // Error Type 1. Abstract class can not be constructed.
      throw new TypeError("Can not construct abstract class.");
    }

    //else (called from child)
    // Check if all instance methods are implemented.
    if (this.draw === DrawingObjects.prototype.draw) {
      // Error Type 4. Child has not implemented this abstract method.
      throw new TypeError("Please implement abstract method draw.");
    }

    if (this.mouseOver === DrawingObjects.prototype.mouseOver) {
      // Error Type 4. Child has not implemented this abstract method.
      throw new TypeError("Please implement abstract method mouseOver.");
    }

    this.posx = px;
    this.posy = py;
    this.name = name;
  }

  draw(cnv) {
    // Error Type 6. The child has implemented this method but also called `super.foo()`.
    throw new TypeError("Do not call abstract method draw from child.");
  }

  mouseOver(mx, my) {
    // Error Type 6. The child has implemented this method but also called `super.foo()`.
    throw new TypeError("Do not call abstract method mouseOver from child.");
  }

  sqDist(px1, py1, px2, py2) {
    //calcalar a distância entre dois pontos
    let xd = px1 - px2;
    let yd = py1 - py2;

    return xd * xd + yd * yd;
  }

  setPos(x, y) {
    this.posx = x;
    this.posy = y;
  }
}

/**
 * Classe que desenha o rectângulo
 */
class Rect extends DrawingObjects {
  constructor(px, py, w, h, c) {
    super(px, py, "R");
    this.w = w;
    this.h = h;
    this.color = c;
  }

  draw(cnv) {
    let ctx = cnv.getContext("2d");

    ctx.fillStyle = this.color;
    ctx.fillRect(this.posx, this.posy, this.w, this.h);
  }

  mouseOver(mx, my) {
    return (
      mx >= this.posx &&
      mx <= this.posx + this.w &&
      my >= this.posy &&
      my <= this.posy + this.h
    );
  }

  setPos(x, y) {
    this.posx = x;
    this.posy = y;
  }
}

/**
 * Classe que desenha uma picture.
 */
class Picture extends DrawingObjects {
  constructor(px, py, w, h, impath) {
    super(px, py, "P");
    this.w = w;
    this.h = h;
    this.impath = impath;
    this.imgobj = new Image();
    this.imgobj.src = this.impath;
  }

  draw(cnv) {
    let ctx = cnv.getContext("2d");

    if (this.imgobj.complete) {
      ctx.drawImage(this.imgobj, this.posx, this.posy, this.w, this.h);
      console.log("Debug: N Time");
    } else {
      console.log("Debug: First Time");
      let self = this; // guardamos o this que está a apontar para a classe
      this.imgobj.addEventListener(
        "load",
        function () {
          // o this aponta para a função
          ctx.drawImage(self.imgobj, self.posx, self.posy, self.w, self.h);
        },
        false
      );
    }
  }

  mouseOver(mx, my) {
    return (
      mx >= this.posx &&
      mx <= this.posx + this.w &&
      my >= this.posy &&
      my <= this.posy + this.h
    );
  }

  setPos(x, y) {
    this.posx = x;
    this.posy = y;
  }
}

/**
 * Classe que desenha um oval.
 */
class Oval extends DrawingObjects {
  constructor(px, py, r, hs, vs, c) {
    super(px, py, "O");
    this.r = r;
    this.radsq = r * r;
    this.hor = hs;
    this.ver = vs;
    this.color = c;
  }

  mouseOver(mx, my) {
    let x1 = 0;
    let y1 = 0;
    let x2 = (mx - this.posx) / this.hor;
    let y2 = (my - this.posy) / this.ver;

    return this.sqDist(x1, y1, x2, y2) <= this.radsq;
  }

  draw(cnv) {
    let ctx = cnv.getContext("2d");

    ctx.save();
    ctx.translate(this.posx, this.posy);
    ctx.scale(this.hor, this.ver);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, this.r, 0, 2 * Math.PI, true);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

/**
 * Classe que desenha um coração.
 */
class Heart extends DrawingObjects {
  constructor(px, py, w, c) {
    super(px, py, "H");
    this.h = w * 0.7;
    this.drx = w / 4;
    this.radsq = this.drx * this.drx;
    this.ang = 0.25 * Math.PI;
    this.color = c;
  }

  outside(x, y, w, h, mx, my) {
    return mx < x || mx > x + w || my < y || my > y + h;
  }

  draw(cnv) {
    let leftctrx = this.posx - this.drx;
    let rightctrx = this.posx + this.drx;
    let cx = rightctrx + this.drx * Math.cos(this.ang);
    let cy = this.posy + this.drx * Math.sin(this.ang);
    let ctx = cnv.getContext("2d");

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.posx, this.posy);
    ctx.arc(leftctrx, this.posy, this.drx, 0, Math.PI - this.ang, true);
    ctx.lineTo(this.posx, this.posy + this.h);
    ctx.lineTo(cx, cy);
    ctx.arc(rightctrx, this.posy, this.drx, this.ang, Math.PI, true);
    ctx.closePath();
    ctx.fill();
  }

  mouseOver(mx, my) {
    let leftctrx = this.posx - this.drx;
    let rightctrx = this.posx + this.drx;
    let qx = this.posx - 2 * this.drx;
    let qy = this.posy - this.drx;
    let qwidth = 4 * this.drx;
    let qheight = this.drx + this.h;

    let x2 = this.posx;
    let y2 = this.posy + this.h;
    let m = this.h / (2 * this.drx);

    //quick test if it is in bounding rectangle
    if (this.outside(qx, qy, qwidth, qheight, mx, my)) {
      return false;
    }

    //compare to two centers
    if (this.sqDist(mx, my, leftctrx, this.posy) < this.radsq) return true;
    if (this.sqDist(mx, my, rightctrx, this.posy) < this.radsq) return true;

    // if outside of circles AND less than equal to y, return false
    if (my <= this.posy) return false;

    // compare to each slope
    // left side
    if (mx <= this.posx) {
      return my < m * (mx - x2) + y2;
    } else {
      //right side
      m = -m;
      return my < m * (mx - x2) + y2;
    }
  }
}

/**
 * Classe que desenha a cabeça do urso.
 * Esta classe mariotariamente utiliza a classe Oval para criar o objeto Bear.
 */
class Bear extends DrawingObjects {
  /**
   * Construtor.
   * Instancia todos os objetos Oval necessários.
   * @param {coord x} px
   * @param {coord y} py
   * @param {raio} r
   * @param {scope horizontal} hs
   * @param {scope vertical} vs
   * @param {cor} c
   */
  constructor(px, py, r, hs, vs, c) {
    super(px, py, "B");
    this.r = r;
    this.hs = hs;
    this.vs = vs;
    this.color = c;

    this.face = new Oval(px, py, r, hs * 1.05, vs * 0.98, c);
    this.ear1 = new Oval(px - 40, py - 40, r * 0.5, hs * 1.05, vs, c);
    this.ear2 = new Oval(px + 40, py - 40, r * 0.5, hs * 1.05, vs, c);
    this.earhole1 = new Oval(px - 42, py - 41, r * 0.2, hs * 1.05, vs, "black");
    this.earhole2 = new Oval(px + 42, py - 41, r * 0.2, hs * 1.05, vs, "black");
    this.eye1 = new Oval(px - 20, py - 10, r * 0.12, hs, vs, "black");
    this.eye2 = new Oval(px + 20, py - 10, r * 0.12, hs, vs, "black");
    this.eye_shine_1 = new Oval(px - 24, py - 13, r * 0.04, hs, vs, "white");
    this.eye_shine_2 = new Oval(px + 16, py - 13, r * 0.04, hs, vs, "white");
    this.nose = new Oval(px, py + 10, r * 0.3, hs * 1.2, vs * 0.8, "black");
    this.nose_shine = new Oval(px - 12, py + 2, r * 0.06, hs, vs, "white");
  }
  /**
   * Vai ver se o rato está por cima do urso.
   * @param {coord x} mx
   * @param {coord y} my
   * @returns Caso o objeto esteja dentro da cara e das orelhas do urso return true
   */
  mouseOver(mx, my) {
    if (this.ear1.mouseOver(mx, my)) {
      return true;
    } else if (this.ear2.mouseOver(mx, my)) {
      return true;
    } else if (this.face.mouseOver(mx, my)) {
      return true;
    } else {
      return false;
    }
  }

  draw(cnv) {
    let ctx = cnv.getContext("2d");

    this.ear1.draw(cnv);
    this.ear2.draw(cnv);
    this.earhole1.draw(cnv);
    this.earhole2.draw(cnv);
    this.face.draw(cnv);
    this.eye1.draw(cnv);
    this.eye2.draw(cnv);
    this.eye_shine_1.draw(cnv);
    this.eye_shine_2.draw(cnv);
    this.nose.draw(cnv);
    this.nose_shine.draw(cnv);

    ctx.beginPath();
    ctx.arc(this.posx - 20, this.posy + 17, 20, 0.1 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(this.posx + 19, this.posy + 17, 20, 0.2 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();
    ctx.closePath();
  }

  setPos(x, y) {
    super.setPos(x, y);
    this.ear1.setPos(x - 40, y - 40);
    this.ear2.setPos(x + 40, y - 40);
    this.earhole1.setPos(x - 42, y - 41);
    this.earhole2.setPos(x + 42, y - 41);
    this.face.setPos(x, y);
    this.eye1.setPos(x - 20, y - 10);
    this.eye2.setPos(x + 20, y - 10);
    this.eye_shine_1.setPos(x - 24, y - 13);
    this.eye_shine_2.setPos(x + 16, y - 13);
    this.nose.setPos(x, y + 10);
    this.nose_shine.setPos(x - 12, y + 2);
  }
}
/**
 * Classe que desenha o fantasma do pac man.
 * Esta classe utiliza alguns ovais e arcos.
 */
class Ghost extends DrawingObjects {
  /**
   * Construtor.
   * Instancia todos os objetos Oval necessários.
   * @param {coord x} px
   * @param {coord y} py
   * @param {scope horizontal} hs
   * @param {scope vertical} vs
   * @param {cor} c
   */
  constructor(px, py, hs, vs, c) {
    super(px, py, "G");
    this.hs = hs;
    this.vs = vs;
    this.color = c;

    this.eye1 = new Oval(
      px - hs * 0.35,
      py,
      10,
      hs * 0.018,
      vs * 0.018,
      "white"
    );
    this.eye2 = new Oval(
      px + hs * 0.35,
      py,
      10,
      hs * 0.018,
      vs * 0.018,
      "white"
    );
    this.eye_shine_1 = new Oval(
      px - hs * 0.4,
      py + vs * 0.05,
      8,
      hs * 0.01,
      vs * 0.01,
      "black"
    );
    this.eye_shine_2 = new Oval(
      px + hs * 0.3,
      py + vs * 0.05,
      8,
      hs * 0.01,
      vs * 0.01,
      "black"
    );
  }
  /**
   * Vai ver se o rato está por cima do ghost.
   * @param {coord x} mx
   * @param {coord y} my
   * @returns true caso esteja por cima do ghost.
   */
  mouseOver(mx, my) {
    if (
      mx > this.posx - this.hs * 0.75 &&
      mx < this.posx + this.hs * 0.75 &&
      my > this.posy - this.vs * 0.5 &&
      my < this.posy + this.vs * 0.5
    ) {
      return true;
    } else {
      return false;
    }
  }

  draw(cnv) {
    let ctx = cnv.getContext("2d");

    ctx.fillStyle = this.color;

    ctx.beginPath();
    ctx.moveTo(this.posx - this.hs * 0.75, this.posy + this.hs * 0.5);
    ctx.lineTo(this.posx - this.hs * 0.75, this.posy);
    ctx.arcTo(
      this.posx - this.hs * 0.75,
      this.posy - this.vs * 0.5,
      this.posx - this.hs * 0.25,
      this.posy - this.vs * 0.5,
      50
    );
    ctx.lineTo(this.posx + this.hs * 0.25, this.posy - this.vs * 0.5);
    ctx.arcTo(
      this.posx + this.hs * 0.75,
      this.posy - this.vs * 0.5,
      this.posx + this.hs * 0.75,
      this.posy,
      50
    );
    ctx.lineTo(this.posx + this.hs * 0.75, this.posy + this.vs * 0.5);
    ctx.lineTo(this.posx + this.hs * 0.5, this.posy + this.vs * 0.3);
    ctx.lineTo(this.posx + this.hs * 0.25, this.posy + this.vs * 0.5);
    ctx.lineTo(this.posx, this.posy + this.vs * 0.3);
    ctx.lineTo(this.posx - this.hs * 0.25, this.posy + this.vs * 0.5);
    ctx.lineTo(this.posx - this.hs * 0.5, this.posy + this.vs * 0.3);
    ctx.lineTo(this.posx - this.hs * 0.75, this.posy + this.hs * 0.5);
    ctx.fill();
    ctx.closePath();

    this.eye1.draw(cnv);
    this.eye2.draw(cnv);
    this.eye_shine_1.draw(cnv);
    this.eye_shine_2.draw(cnv);
  }
  setPos(x, y) {
    super.setPos(x, y);
    this.eye1.setPos(x - this.hs * 0.35, y);
    this.eye2.setPos(x + this.hs * 0.35, y);
    this.eye_shine_1.setPos(x - this.hs * 0.4, y + this.vs * 0.05);
    this.eye_shine_2.setPos(x + this.hs * 0.3, y + this.vs * 0.05);
  }
}

/**
 * Classe que desenha a estrela.
 * A estrela é composta por linhas.
 */
class Star extends DrawingObjects {
  /**
   * Construtor.
   * @param {coord x} px
   * @param {coord y} py
   * @param {cor} c
   */
  constructor(px, py, c) {
    super(px, py, "S");
    this.color = c;
  }

  /**
   * Verifica se está por cima do retângulo que englo a a estrela.
   * @param {coord x} mx
   * @param {coord y} my
   * @returns caso esteja por cima, return true.
   */
  mouseOver(mx, my) {
    if (
      mx > this.posx - 50 &&
      mx < this.posx + 80 &&
      my > this.posy - 50 &&
      my < this.posy + 80
    )
      return true;
    else return false;
  }
  draw(cnv) {
    let ctx = cnv.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(this.posx, this.posy);
    ctx.lineTo(this.posx + 15, this.posy - 50);
    ctx.lineTo(this.posx + 30, this.posy);
    ctx.lineTo(this.posx + 80, this.posy + 15);
    ctx.lineTo(this.posx + 30, this.posy + 30);
    ctx.lineTo(this.posx + 15, this.posy + 80);
    ctx.lineTo(this.posx, this.posy + 30);
    ctx.lineTo(this.posx - 50, this.posy + 15);
    ctx.lineTo(this.posx, this.posy);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  setPos(x, y) {
    this.posx = x;
    this.posy = y;
  }
}

/**
 * Classe que cria o texto.
 */
class Text extends DrawingObjects {
  /**
   * Construtor.
   * Cria um retângulo invisível que está por cima do texto.
   * @param {coord x} px
   * @param {coord y} py
   * @param {texto pretendido} text
   * @param {cor} c
   */
  constructor(px, py, text, c) {
    super(px, py, "T");
    this.color = c;
    this.text = text;
    this.fonte = 20;
    this.rect = new Rect(
      this.posx,
      this.posy,
      this.fonte * this.text.length,
      this.fonte
    );
  }
  /**
   * Verifica se o rato está por cima do retângulo
   * @param {coord x} mx
   * @param {coord y} my
   * @returns Caso o rato está por cima do retângulo, return true
   */
  mouseOver(mx, my) {
    return this.rect.mouseOver(mx, my);
  }

  /**
   * Muda a cor do texto
   * @param {cor} color
   */
  changeColor(color) {
    this.color = color;
  }

  draw(cnv) {
    let ctx = cnv.getContext("2d");

    ctx.font = "20px Comic Sans MS";
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, this.posx, this.posy + this.fonte);
  }

  setPos(x, y) {
    this.rect.setPos(x, y);
    super.setPos(x, y);
  }
}
