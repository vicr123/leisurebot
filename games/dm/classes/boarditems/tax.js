var BoardItem = require('../containers/boarditem.js').BoardItem;
class Tax extends BoardItem {
  constructor(name, cost) {
    super(name)
    this.cost = cost;
  }
  onStep(player) {
    player.modifyCash(-(this.cost))
  }
}
exports.Tax = Tax;
