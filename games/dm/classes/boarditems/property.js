var Purchasable = require('../containers/purchasable.js').Purchasable;
class Property extends Purchasable {
  constructor(name, purchaseValue, color, hcost, cost, costc, costh1, costh2, costh3, costh4, costh5, hycost, afcost) {
    super(name, purchaseValue);
    this.color = color;
    this.houseCost = hcost;
    this.cost = cost;
    this.costSet = costc;
    this.costHouse = costh1;
    this.costHouse2 = costh2;
    this.costHouse3 = costh3;
    this.costHouse4 = costh4;
    this.costHotel = costh5;
    this.mortgageCost = hycost;
    this.unMortgageCost = afcost;
    this.houseCount = 0;
    this.completedColorSet = false;
  }
  onStep(player) {
    if (this.completedColorSet == false) {
      player.modifyCash(-(this.cost));
    } else {
      switch (this.houseCount) {
        case 0:
          player.modifyCash(-(this.costSet))
          break;
        case 1:
          player.modifyCash(-(this.costHouse))
          break;
        case 2:
          player.modifyCash(-(this.costHouse2))
          break;
        case 3:
          player.modifyCash(-(this.costHouse3))
          break;
        case 4:
          player.modifyCash(-(this.costHouse4))
          break;
        case 5:
          player.modifyCash(-(this.costHotel))
          break;
      }
    }
  }
}
exports.Property = Property;
