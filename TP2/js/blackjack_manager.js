/*
BLACKJACK - TP2 - 22/23 - PCM

REALIZADO POR:
43498 Roman Ishchuk
45977 Eduardo Marques

DOCENTE:
Rui Jesus
*/


let game = null;
// DEBUG na janela caso necessário
function debug(an_object) {
  document.getElementById("debug").innerHTML = JSON.stringify(an_object);
}

// desbloqueia os botões card e stand e bloqueia o botão new_game
function buttons_initialization() {
  document.getElementById("card").disabled = false;
  document.getElementById("stand").disabled = false;
  document.getElementById("new_game").disabled = true;
}

//desbloqueia o botão new_game e bloqueia os botões card e stand
function finalize_buttons() {
  document.getElementById("card").disabled = true;
  document.getElementById("stand").disabled = true;
  document.getElementById("new_game").disabled = false;
}

/*
Função que inicia um novo jogo. Dá duas cartas para o dealer (uma virada ao contrário) e uma para o player.
Mete as imagens na janela
*/
function new_game() {

  buttons_initialization();
  game = new BlackJack();

  let cards = null;
  dealer_new_card();
  dealer_new_card();
  cards = game.get_dealer_cards();
  cards[1] = "X";
  document.getElementById("dealer").innerHTML = '';
  cardImg(document.getElementById("dealer"), cards);

  player_new_card();
  cards = game.get_player_cards();
}

/*
Coloca a imagem da carta que está em jogo
*/
function cardImg(jogador,cards){
  for (let i = 0; i < cards.length; i++) {
    var x = document.createElement("IMG");
    
    if(cards[i] == "X"){
      x.src = 'imgs/back.png';      
    }
    else{
      x.src = 'imgs/' + cards[i] + '.png';      
    }
    x.style.height = '210px';
    x.style.width = '150px';
    x.style.margin = '0px 10px';
    jogador.appendChild(x);
  }
}


//Caso o jogo acabe, diz na janela se o dealer ganhou ou perdeu
function update_dealer(state) {
  if(state.gameEnded){
      let msg;
      if(state.dealerWon == true){
      msg =" DEALER WON";
      }else{
        msg = " DEALER LOST";
      }
      document.getElementById("dealer").innerHTML = msg;
      finalize_buttons();
  }
}

//Caso o jogo acabe, diz na janela se o jogador ganhou ou perdeu
function update_player(state) {
  if(state.gameEnded){
    let msg;
    if(state.playerBusted == true){
      msg = " PLAYER LOST";
    }else{
      msg = " PLAYER WON";
    }
    document.getElementById("player").innerHTML = msg;
    finalize_buttons();
  }

}

//Função adiciona uma carta ao dealer
function dealer_new_card() {
  let state = game.dealer_move();
  update_dealer(state);
  return state;
}

//função adiciona uma carta ao player
function player_new_card() {
  let state = game.player_move();
  let card = game.get_player_cards();
  document.getElementById("player").innerHTML = '';
  update_player(state);
  cardImg(document.getElementById("player"), card);
  return state;
}

/*
Caso o player clicque o botão stand, é a vez do dealer jogar.
Nos casinos, o dealer joga até ter 17 ou mais pontos. Depois de obter 
17 ou mais pontos, para de jogar. Implementámos isto como opção.
*/
function dealer_finish() {
  game.setDealerTurn(true);
  let state = game.get_game_state();
  let cards = game.get_dealer_cards();
  let sum = game.get_cards_value(cards);
  if(sum >= 17) {
    state.gameEnded = true;
    update_dealer(state);
  }
  while(!state.gameEnded){
      cards = game.get_dealer_cards();
      sum = game.get_cards_value(cards);
      
      document.getElementById("dealer").innerHTML = cards;
      dealer_new_card();
      if(sum >= 17) {
        state.gameEnded = true;
        game.get_game_state();
        update_dealer(state);
        break;
      }
      update_dealer(state);
  }  
  cards = game.get_dealer_cards();
  cardImg(document.getElementById("dealer"), cards);
}