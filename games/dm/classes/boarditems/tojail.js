var BoardItem = require('../containers/boarditem.js').BoardItem;
class ToJail extends BoardItem {
  constructor(name) {
    super(name)
  }
  onStep(player) {
    //TODO: Implement Go to Jail
  }
}
exports.ToJail = ToJail;
