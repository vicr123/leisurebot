var BoardItem = require('../containers/boarditem.js').BoardItem;
class Chance extends BoardItem {
  constructor(name) {
    super(name)
  }
  onStep(player) {
    //TODO: Implement Chance Cards
  }
}

exports.Chance = Chance;
