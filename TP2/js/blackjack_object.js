/*
BLACKJACK - TP2 - 22/23 - PCM

REALIZADO POR:
43498 Roman Ishchuk
45977 Eduardo Marques

DOCENTE:
Rui Jesus
*/

//constante com o número máximo de pontos para blackJack
const MAX_POINTS = 21;


// Classe BlackJack - construtor
class BlackJack {
    constructor() {
        // array com as cartas do dealer
        this.dealer_cards = [];
        // array com as cartas do player
        this.player_cards = [];
        // variável booleana que indica a vez do dealer jogar até ao fim
        this.dealerTurn = false;

        // objeto na forma literal com o estado do jogo
        this.state = {
            gameEnded: false,
            dealerWon: false,
            playerBusted: false
        };

        //Método cria um baralho novo
        this.new_deck = function () {
            const suits = ["C", "S", "H", "D"];
            const CARDS_PER_SUIT = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "1", "J", "Q", "K"];
            let deck = [];
            let k = 0;
            for (let i = 0; i < suits.length; i++) {
                for (let j = 0; j < CARDS_PER_SUIT.length; j++) {
                    deck[k]=CARDS_PER_SUIT[j] + suits[i];    
                    k++;               
                }
            }
            return deck;
        };

        //método baralha o baralho
        this.shuffle = function (deck) {
            let indexes = [];
            let shuffled = [];
            let index = null;
            for (let n = 0; n < deck.length; n++) {
                indexes.push(n);       
            }
            for (let n = 0; n < deck.length; n++) {
                index = Math.floor(Math.random()*indexes.length);
                shuffled.push(deck[indexes[index]]);
                indexes.splice(index,1);
            }
            return shuffled;
        };

        // baralho de cartas baralhado
        this.deck = this.shuffle(this.new_deck());
        //this.deck = this.new_deck();
    }

    // métodos
    // devolve as cartas do dealer num novo array (splice)
    get_dealer_cards() {
        return this.dealer_cards.slice();
    }

    // devolve as cartas do player num novo array (splice)
    get_player_cards() {
        return this.player_cards.slice();
    }

    // Ativa a variável booleana "dealerTurn"
    setDealerTurn (val) {
        this.dealerTurn = val;
    }

    //MÉTODOS QUE DEVEM SER IMPLEMENTADOS PELOS ALUNOS
    get_cards_value(cards) {
        let noaces = cards.filter(function(card){return card.charAt(0) !="A";});
        let figtransf = noaces.map(function(c){
            if(c.charAt(0) == "1" || c.charAt(0) == "J" || c.charAt(0) == "Q" || c.charAt(0) == "K"){
                return 10;
            }
            else{
                return parseInt(c.charAt(0));

            }
        });
        let sum = figtransf.reduce(function(sum,value){return sum += value;},0)
        let numaces = cards.length - noaces.length;
        while (numaces > 0) {
            if (sum + 11 > MAX_POINTS && numaces >= 1) {
                return sum + numaces;
            }
            sum += 11;
            numaces-=1;
        }
        return sum + numaces;
    }

    //busca a primeira carta do deck, tira a do deck com o splice, e adiciona ao dealer_cards.
    dealer_move() {
        let card =  this.deck[0];
        this.deck.splice(0,1);
        this.dealer_cards.push(card);
        return this.get_game_state();
    }

     //busca a primeira carta do deck, tira a do deck com o splice, e adiciona ao player_cards.
    player_move() {
        let card =  this.deck[0];
        this.deck.splice(0,1);
        this.player_cards.push(card);
        return this.get_game_state();
    }

    /*Faz as verificações todas para o jogo acabar. Adicionamos opcionalmente a 
    verificação se o dealer tem 17 ou mais pontos.
    */
    get_game_state() {
        let playerpoints = this.get_cards_value(this.player_cards);
        let dealerpoints = this.get_cards_value(this.dealer_cards);
        let playerBusted = playerpoints>MAX_POINTS;
        let playerwon = playerpoints === MAX_POINTS;
        let dealerbested = this.dealerTurn && (dealerpoints > MAX_POINTS);
        let dealerWon = this.dealerTurn && dealerpoints > playerpoints && dealerpoints <= MAX_POINTS && dealerpoints >= 17;

        this.state.gameEnded = playerBusted || playerwon || dealerbested || dealerWon;
        this.state.dealerWon = dealerWon;
        this.state.playerBusted = playerBusted;

        return this.state;
    }
}

