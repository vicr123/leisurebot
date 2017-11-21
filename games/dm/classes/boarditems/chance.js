var BoardItem = require('../containers/boarditem.js').BoardItem;

var next = function(o, id){
  index = o.indexOf( id ),
  nextIndex = index += 1;
  if(nextIndex >= o.length){
    nextIndex = 0;
  }
  var nextKey = o[nextIndex]
    return nextKey;
  };

class Chance extends BoardItem {
  constructor(name) {
    super(name)
  }
  onStep(player) {
    var chanceCard = next(player.Game.Board.Chance, player.Game.lastChance)
    player.Game.announce("["+player.Game.id+"] Chance: "+chanceCard)
    player.Game.lastChance = chanceCard
  }
}

exports.Chance = Chance;
