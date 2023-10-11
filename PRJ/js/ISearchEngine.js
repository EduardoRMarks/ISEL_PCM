"use strict";
/** 
Google Images - PRJ - 22/23 - PCM

REALIZADO POR:
43498 Roman Ishchuk
45977 Eduardo Marques

DOCENTE:
Rui Jesus
*/
class ISearchEngine {
  constructor(dbase) {
    this.allpictures = new Pool(3000);
    this.img_paths = new Pool(3000);
    this.colors = [
      "red",
      "orange",
      "yellow",
      "green",
      "cyan",
      "blue",
      "purple",
      "pink",
      "white",
      "grey",
      "black",
      "brown",
    ];
    this.redColor = [204, 251, 255, 0, 3, 0, 118, 255, 255, 153, 0, 136];
    this.greenColor = [0, 148, 255, 204, 192, 0, 44, 152, 255, 153, 0, 84];
    this.blueColor = [0, 11, 0, 0, 198, 255, 167, 191, 255, 153, 0, 24];
    this.categories = [
      "beach",
      "birthday",
      "face",
      "indoor",
      "manmade/artificial",
      "manmade/manmade",
      "manmade/urban",
      "marriage",
      "nature",
      "no_people",
      "outdoor",
      "party",
      "people",
      "snow",
    ];
    this.XML_file = dbase;
    this.XML_db = new XML_Database();
    this.LS_db = new LocalStorageXML();
    this.XML_doc;
    this.num_Images = 100;
    this.numshownpic = 30;
    this.imgWidth = 190;
    this.imgHeight = 140;
  }

  init(cnv) {
    this.XML_doc = this.XML_db.loadXMLfile(this.XML_file);
    //this.databaseProcessing(cnv);
    //online, comentar a linha de cima
  }

  // method to build the database which is composed by all the pictures organized by the XML_Database file
  // At this initial stage, in order to evaluate the image algorithms, the method only compute one image.
  // However, after the initial stage the method must compute all the images in the XML file
  databaseProcessing(cnv) {
    let h12color = new ColorHistogram(
      this.redColor,
      this.greenColor,
      this.blueColor
    );
    let colmoments = new ColorMoments();

    let self = this;
    this.categories.forEach((category) => {
      let path_img = self.XML_db.SearchXML(
        category,
        this.XML_doc,
        self.num_Images
      );
      path_img.forEach((path) => {
        let img = new Picture(0, 0, 100, 100, path, category);
        //self.allpictures.insert(img);
        let eventname = "processed_picture_" + img.impath;
        let eventP = new Event(eventname);

        document.addEventListener(
          eventname,
          function () {
            self.imageProcessed(img, eventname);
          },
          false
        );
        img.computation(cnv, h12color, colmoments, eventP);
      });
    });
  }

  //When the event "processed_picture_" is enabled this method is called to check if all the images are
  //already processed. When all the images are processed, a database organized in XML is saved in the localStorage
  //to answer the queries related to Color and Image Example
  imageProcessed(img, eventname) {
    this.allpictures.insert(img);
    console.log("image processed " + this.allpictures.stuff.length + eventname);

    if (
      this.allpictures.stuff.length ===
      this.num_Images * this.categories.length
    ) {
      this.createXMLColordatabaseLS();
      //this.createXMLIExampledatabaseLS();
    }
  }

  //Method to create the XML database in the localStorage for color queries
  createXMLColordatabaseLS() {
    const self = this;
    console.log(this.allpictures.stuff);
    this.categories.forEach(function (element) {
      //procurar todas as img da categoria
      let xmlRowString = "<images>";
      let imgCategory = self.allpictures.stuff.filter(function (img) {
        return img.category === element;
      });
      self.colors.forEach(function (color) {
        //para cada cor fazer sort
        self.sortbyColor(self.colors.indexOf(color), imgCategory);
        
        for (let i = 0; i < self.numshownpic; i++) {
          //console.log()
          if(color == "black"){
            console.log(imgCategory[i].hist);
          }
          xmlRowString +=
            '<image class="' +
            color +
            '"><path>' +
            imgCategory[i].impath +
            "</path></image>";
        }
      });
      xmlRowString += "</images>";
      self.LS_db.saveLS_XML(element, xmlRowString);
      //cria 12  xml no localstrorage
    });
  }

  //A good normalization of the data is very important to look for similar images. This method applies the
  // zscore normalization to the data
  zscoreNormalization() {
    let overall_mean = [];
    let overall_std = [];

    // Inicialization
    for (let i = 0; i < this.allpictures.stuff[0].color_moments.length; i++) {
      overall_mean.push(0);
      overall_std.push(0);
    }

    // Mean computation I
    for (let i = 0; i < this.allpictures.stuff.length; i++) {
      for (let j = 0; j < this.allpictures.stuff[0].color_moments.length; j++) {
        overall_mean[j] += this.allpictures.stuff[i].color_moments[j];
      }
    }

    // Mean computation II
    for (let i = 0; i < this.allpictures.stuff[0].color_moments.length; i++) {
      overall_mean[i] /= this.allpictures.stuff.length;
    }

    // STD computation I
    for (let i = 0; i < this.allpictures.stuff.length; i++) {
      for (let j = 0; j < this.allpictures.stuff[0].color_moments.length; j++) {
        overall_std[j] += Math.pow(
          this.allpictures.stuff[i].color_moments[j] - overall_mean[j],
          2
        );
      }
    }

    // STD computation II
    for (let i = 0; i < this.allpictures.stuff[0].color_moments.length; i++) {
      overall_std[i] = Math.sqrt(
        overall_std[i] / this.allpictures.stuff.length
      );
    }

    // zscore normalization
    for (let i = 0; i < this.allpictures.stuff.length; i++) {
      for (let j = 0; j < this.allpictures.stuff[0].color_moments.length; j++) {
        this.allpictures.stuff[i].color_moments[j] =
          (this.allpictures.stuff[i].color_moments[j] - overall_mean[j]) /
          overall_std[j];
      }
    }
  }

  //Method to search images based on a selected color
  searchColor(category, color, canvas) {
    let xmlDoc = this.LS_db.readLS_XML(category);
    let image_list = this.XML_db.SearchXML(
      color.toLowerCase(),
      xmlDoc,
      this.num_Images
    );
    image_list.forEach((element) => {
      this.img_paths.insert(element);
    });
    this.relevantPictures();
    this.gridView(canvas);
  }

  //Method to search images based on keywords
  searchKeywords(category, canvas) {
    let search_query = this.XML_db.SearchXML(
      category,
      this.XML_doc,
      this.num_Images
    );
    search_query.forEach((element) => {
      this.img_paths.insert(element);
    });
    this.relevantPictures();
    this.gridView(canvas);
  }

  //Method to sort images according to the number of pixels of a selected color
  sortbyColor(idxColor, list) {
    list.sort(function (a, b) {
      return b.hist[idxColor] - a.hist[idxColor];
    });
  }

  /**
   * Altera as posições da imagem de acordo com a sua posição na grid.
   * @param {cnv} canvas
   */
  gridView(canvas) {
    let posX = 75;
    let posY = 30;
    let col = 0;
    let maxCol = 5;

    for (let i = 0; i < this.numshownpic; i++) {
      this.allpictures.stuff[i].setPosition(posX, posY);
      this.allpictures.stuff[i].draw(canvas);
      col++;
      posX += 215;
      if (col === maxCol) {
        posY += 175;
        posX = 75;
        col = 0;
      }
    }
  }

  /**
   * Esvazia a pool donde são desenhadas as imagens, e cria imagens novas de acordo com as paths que resultaram da query
   * e esvazia a pool das paths.
   */
  relevantPictures() {
    const self = this;
    this.allpictures.empty_Pool();
    for (let i = 0; i < this.img_paths.stuff.length; i++) {
      let img = new Picture(
        0,
        0,
        self.imgWidth,
        self.imgHeight,
        self.img_paths.stuff[i],
        "create"
      );
      self.allpictures.insert(img);
    }
    this.img_paths.empty_Pool();
  }
}

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

  empty_Pool() {
    while (this.stuff.length > 0) {
      this.remove();
    }
  }
}
