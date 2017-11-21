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
class Chest extends BoardItem {
  constructor(name) {
    super(name)
  }
  onStep(player) {
    var chestCard = next(player.Game.Board.Chest, player.Game.Chest)
    player.Game.announce("["+player.Game.id+"] Chest: "+chestCard)
    player.Game.lastChest = chestCard
  }
}
exports.Chest = Chest;
