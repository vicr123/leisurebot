var BoardItem = require('../containers/boarditem.js').BoardItem;
class Chest extends BoardItem {
  constructor(name) {
    super(name)
  }
  onStep(player) {
    //TODO: Implement Community Chest Cards
  }
}
exports.Chest = Chest;
