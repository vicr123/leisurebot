var Purchasable = require('../containers/purchasable.js').Purchasable;
class Utility extends Purchasable {
  constructor(name, purchaseValue) {
    super(name, purchaseValue)
  }
  onStep(player) {
    player.modifyCash(-100);
  }
}
exports.Utility = Utility;
