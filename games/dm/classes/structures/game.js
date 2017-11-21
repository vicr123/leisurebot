var Board = require('./board.js').Board;
var next = function(o, id){
  index = o.indexOf( id ),
  nextIndex = index += 1;
  if(nextIndex >= o.length){
    nextIndex = 0;
  }
  var nextKey = o[nextIndex]
    return nextKey;
  };

class Game {
  constructor(id) {
    this.id = id;
    this.players = [];
    this.Board = null;
    this.Started = false;
    this.currentPlayer = null;
    this.Board = new Board("default");
  }
  getPlayer(userResolve) {
    var returnValue = null;
    if (parseInt(userResolve)) {
      returnValue = this.players[parseInt(userResolve)]
    } else {
      this.players.forEach(function(elem, index) {
        if (elem == userResolve) {
          returnValue = this.players[index]
        }
      })
    }
    return returnValue
  }
  announce(message, ignorePlayer) {
    this.players.forEach(function(elem) {
      if (ignorePlayer) {
        if (ignorePlayer.ID != elem.ID) {
          elem.Player.send(message)
        }
      } else {
        elem.Player.send(message)
      }
    })
  }
  loadBoard(boardid) {
    var board = new Board(boardid);
    if (board) { this.Board=board }
  }

  restructure() {
    var newArray = [];
    this.players.forEach(function(plr) {
      newArray[newArray.length] = plr
    })
    this.players = newArray
  }

  advanceTurn() {
    if (this.Started == true) {
      this.currentPlayer = next(this.players, this.currentPlayer)
      this.currentPlayer.needsToRoll=true;
      this.announce("The current player is: " + this.currentPlayer.Username)
    }
  }

  movePlayer(plr, steps) {
    var current = this.Board.Fields[plr.Position];
    for (var i=1;i<=steps;i++) {
      var newPos = next(this.Board.Fields, current);
      current = newPos;
      if (newPos['onPass']) {
        newPos.onPass(plr)
      }
      if (i==steps) {
        if (newPos['onStep']) {newPos.onStep(plr)}
        plr.Position = this.Board.Fields.indexOf(newPos);
      }
    }
  }
}
exports.Game = Game
