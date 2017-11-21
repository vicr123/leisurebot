var BoardItem = require('../containers/boarditem.js').BoardItem;
class Parking extends BoardItem {
  constructor(name, reward) {
    super(name)
    this.Reward = reward;
  }
}
exports.Parking = Parking;
