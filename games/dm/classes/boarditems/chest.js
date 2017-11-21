var BoardItem = require('../containers/boarditem.js').BoardItem;
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
