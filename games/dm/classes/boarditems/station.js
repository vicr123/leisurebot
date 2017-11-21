var Purchasable = require('../containers/purchasable.js').Purchasable;
class Station extends Purchasable {
  constructor(name, purchaseValue) {
    super(name, purchaseValue)
  }
  onStep(player) {
    //TODO: Implement Railroad Cards
  }
}
exports.Station = Station;
