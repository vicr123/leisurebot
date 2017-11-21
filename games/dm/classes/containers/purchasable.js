var BoardItem = require('./boarditem.js').BoardItem;
class Purchasable extends BoardItem {
  constructor(name, purchaseValue) {
    super(name);
    this.owner = null;
    this.purchaseValue = purchaseValue;
  }
}

exports.Purchasable = Purchasable
