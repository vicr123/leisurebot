var Purchasable = require('../containers/purchasable.js').Purchasable;
class Station extends Purchasable {
  constructor(name, purchaseValue) {
    super(name, purchaseValue)
  }
  onStep(player) {
    if (this.owner != null) {
      var owner = this.owner
      var stationCount=0;
      player.Game.Board.Fields.forEach(function(elem) {
        if (elem instanceof Station) {
          if (elem.owner && elem.owner == owner) {
            stationCount++;
          }
        }
      })
      if (stationCount == 1) {
        player.modifyCash(-25);
        this.owner.modifyCash(25);
      } else if (stationCount == 2) {
        player.modifyCash(-50);
        this.owner.modifyCash(-50);
      } else if (stationCount == 3) {
        player.modifyCash(-100);
        this.owner.modifyCash(-100);
      } else if (stationCount == 4) {
        player.modifyCash(-200);
        this.owner.modifyCash(-200);
      }
    }
  }
}
exports.Station = Station;
