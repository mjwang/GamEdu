// Matching
//
//
// Initialization after page loads
//

$(document).ready(function(){
  var outcome = {"win": "You won!", "lose": "Sorry, you lost."};

  // make ajax call to get questions
  var questions = [];
  var url = "/get_questions";
  var req = {gid: gid};

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
      $("#board").append(box);
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
	if (card_type === "original") {
          c.removeClass("selected");
          c.removeClass("matched");
	}
      }; 
    });

    cards.forEach(function(c,i){
      c.getPosition = function(){
        return i;
      }
    });

    // displays game cards with text
    cards.forEach(function(c, i){ 
      c.render(board[i][0]);
      c.html(board[i][1]);
    });
    
    /*
    cards.forEach(function(c){
      c.click(function(){
        console.log("Clicked!");
      });
    });
    */

    // add click method to game cards
    // the game state is advanced purely through these click events
    
    cards.forEach(function(c){
      c.click(function(data,e){
        console.log("Clicked: ", c.getPosition());
        if (!game.isMatched(c.getPosition())){
          var res = game.advanceState(c.getPosition()); 
          var out = res[0];
          var state = res[1];

          console.log("Game State: ", state);
          console.log("Output: ", out);
     
          if (state === "selected"){
            c.render("selected");
          }	
          if (state === "start"){
            if (out === "match") {
              c.render("selected");
              c.render("matched");
              cards[game.getSelected()].render("matched");
              flash("Nice Match!");
            } 
            if (out === "incorrect") {
              c.render("incorrect");
              cards[game.getSelected()].render("original");
              flash("Incorrect :(");
            }
          }
          if (state === "game_over"){
            c.render("selected");
            c.render("matched");
            cards[game.getSelected()].render("matched");
            displayOutcome(out);
          }
       }
     }); 
    });
    
  });
  
  // flash message below game board
  var flash = function(message) {
    $("#message").html("<h2>" + message + "</h2>");
  };

  // display outcome of the game based on win boolean
  var displayOutcome = function(win) {
    console.log("Displaying Outcome! ", win);
    $("#nav").removeClass("hide");
    flash("Game Over. You Win!");
  };

});

//
// Implementation of the Matching Game
// Contains all game logic
//

var Game = function(questions, boardSize) {

  var states = ["start", "game_over", "selected", "matched", "incorrect"];
  var positionMap = {}; // Maps position -> text
  var answerMap = {}; // Maps question position -> answer position
  var matched = {};

  var state = "start";
  var selected;
  var total_matches = questions.length;
  var num_matches = 0;

  this.getState = function(){
    return state;
  };  

  this.getPositionMap = function(){
    return positionMap;
  };

  this.getAnswerMap = function(){
    return answerMap;
  };

  this.getSelected = function(){
    return selected;
  };

  this.setSelected = function(i){
    selected = i;
  };

  this.setState = function(s){
    state = s;
  };

  this.isMatched = function(c){
    return (matched[c] === true);
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
  };

  var output;
  var next_state;
  
  this.advanceState = function(pos){

    console.log("advancing game state");	

    if (state === "start"){
      // pos is first card selected -> selected state
      this.setSelected(pos);
      output = "select_one";
      next_state = "selected";
    } 
    
    if (state === "game_over"){
      // game is already over, clicks should do nothing. game should remain in this state.
      output = true;
      next_state = "game_over"; 
    }

    if (state === "selected"){
      // one card has been selected. pos is second card selected. 
      // if first and second card match -> correct, start or game_over
      // if first and second don't match -> incorrect, start 
      console.log("Selected: ", this.getSelected());
      console.log("Second: ", pos);
      if (answerMap[pos] === this.getSelected() || answerMap[this.getSelected()] === pos) {
        output = "match"; 
        matched[pos] = true;
        matched[this.getSelected()] = true;
        num_matches++;
      } else {
        output = "incorrect";
      }

      if (num_matches === total_matches){
        next_state = "game_over";
      } else {
        next_state = "start";
      }
    }
    this.setState(next_state);
    return [output, next_state];
  };

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

};
