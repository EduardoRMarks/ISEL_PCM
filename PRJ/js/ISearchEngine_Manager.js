"use strict";

/** 
Google Images - PRJ - 22/23 - PCM

REALIZADO POR:
43498 Roman Ishchuk
45977 Eduardo Marques

DOCENTE:
Rui Jesus
*/
let app = null;

/**
 * Função que declara arma os eventos para os diversos componentes html
 */
function main() {
    let canvas = document.querySelector("canvas");
    app = new ISearchEngine("xml/Image_database.xml");
    app.init(canvas);

    let search = document.getElementById("search_field");
    search.addEventListener("keypress", function(ev){
        if(ev.key == "Enter"){
            app.searchKeywords(search.value,canvas);
        }
    })

    let search_button = document.getElementById("search");
    search_button.addEventListener("click",function(){app.searchKeywords(search.value,canvas)});

    let color_search = document.getElementsByClassName("color");
    for (let i = 0; i < color_search.length; i++) {
        color_search[i].addEventListener("click",function(){app.searchColor(search.value,color_search[i].value,canvas)});
    }

}

function Generate_Image(canvas) {
    var ctx = canvas.getContext("2d");
    var imgData = ctx.createImageData(100, 100);

    for (var i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i + 0] = 204;
        imgData.data[i + 1] = 0;
        imgData.data[i + 2] = 0;
        imgData.data[i + 3] = 255;
        if ((i >= 8000 && i < 8400) || (i >= 16000 && i < 16400) || (i >= 24000 && i < 24400) || (i >= 32000 && i < 32400))
            imgData.data[i + 1] = 200;
    }
    ctx.putImageData(imgData, 150, 0);
    return imgData;
}




