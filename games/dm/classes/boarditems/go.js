var BoardItem = require('../containers/boarditem.js').BoardItem;
class Go extends BoardItem {
  constructor(reward) {
    super("Go")
    this.Reward = reward;
  }
  onPass(player) {
    player.modifyCash(this.Reward);
  }
}
exports.Go = Go;
