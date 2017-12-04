var Purchasable = require('../containers/purchasable.js').Purchasable;
class Station extends Purchasable {
  constructor(name, purchaseValue) {
    super(name, purchaseValue)
  }
  onStep(player) {
    //TODO: Implement Railroad Cards
    if (this.owner != null) {
      var stationCount=0;
      player.Game.Board.Fields.forEach(function(elem) {
        if (elem instanceof Station) {
          if (elem.owner && elem.owner == this.owner) {
            stationCount++;;
          }
        }
      })
      if (stationCount == 1) {
        player.modifyCash(-25);
        this.owner.modifyCash(25);
      } else if (utilityCount == 2) {
        player.modifyCash(-50);
        this.owner.modifyCash(-50);
      } else if (utilityCount == 3) {
        player.modifyCash(-100);
        this.owner.modifyCash(-100);
      } else if (utilityCount == 4) {
        player.modifyCash(-200);
        this.owner.modifyCash(-200);
      }
    }
  }
}
exports.Station = Station;
