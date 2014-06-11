// Matching

//
// Initialization after page loads
//

$(document).ready(function(){
  var outcome = {"win": "You won!", "lose": "Sorry, you lost."};

  // make ajax call to get questions
  var questions = [];
  var url = "/get_questions";
  //var req = {gid: '539060bd98dacf5317d3ea7d'};
  var req = {gid: gid}

  $.get(url,req, function(data){
    questions = data.questions;
    boardSize = questions.length * 2;
    // create new game object
    var game = new Game(questions, boardSize);
    
    // start game
    var board = game.dealCards();
    
    //create card elements

    var cards = Array.dim(boardSize).map(function() {
      var box = $("<div>");
      box.addClass("card");
      $(".board").append(box);
      return box;
    });

    // add render method to game cards
    cards.forEach(function(c){
      c.render = function(card_type){
        console.log("Adding class to card");
        if (card_type === "question") {
          c.addClass("question");
        }
        if (card_type === "answer") {
          c.addClass("answer");
        }  
        if (card_type === "matched") {
          c.addClass("matched");
        }  
	if (card_type === "selected") {
	  c.addClass("selected");
	}
      } 
    });

    // add click method to game cards
    cards.forEach(function(c){

    });

    // displays game cards with text
    cards.forEach(function(c, i){ 
      console.log("Rendering card ", i);
      console.log("Card type: ", board[i][0])
      console.log("Card text: ", board[i][1])
      c.render(board[i][0]);
      c.html(board[i][1]);
    });

  });
  
  

  // display outcome of the game
  var displayOutcome = function(win) {

  }

});

//
// Implementation of the Matching Game
// Contains all game logic
//

var Game = function(questions, boardSize) {

  var states = ["start", "game_over", "selected", "matched", "incorrect"]
  var positionMap = {}; // Maps position -> text
  var answerMap = {}; // Maps question position -> answer position

  var state = "start";

  this.getState = function(){
    return state;
  }  

  this.getPositionMap = function(){
    return positionMap;
  }

  this.getAnswerMap = function(){
    return answerMap;
  }

  this.dealCards = function(){
    console.log("Dealing Cards: ", questions);
    var randBoard = randomBoard();

    for (var i=0; i < (randBoard.length/2); i++) {
      console.log(i);
      positionMap[randBoard[i*2]] = ["question", questions[i].question];
      positionMap[randBoard[(i*2) + 1]] = ["answer", questions[i].answer];
      answerMap[randBoard[i*2]] =  randBoard[(i*2)+1];
    } 
    console.log("Dealt Cards: ", positionMap); 
    console.log("Answers: ", answerMap);
    return positionMap;
  }


  function randomBoard(){
    var boardArray = [];
    for (var j=0; j < boardSize; j++) {
      boardArray[j] = j; 
    } 
    console.log(boardArray);
    shuffle(boardArray);
    console.log(boardArray);
    return boardArray;
  }


}
