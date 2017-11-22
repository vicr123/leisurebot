var Purchasable = require('../containers/purchasable.js').Purchasable;
class Station extends Purchasable {
  constructor(name, purchaseValue) {
    super(name, purchaseValue)
  }
  onStep(player) {
    //TODO: Implement Railroad Cards
    if (this.owner != null) {
      player.modifyCash(-94)
      this.owner.modifyCash(94)
    }
  }
}
exports.Station = Station;
