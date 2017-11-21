class Player {
  constructor(user, game) {
    this.Player = user;
    this.ID = user.id
    this.Username = user.username;
    this.Cash = 1500;
    this.needsToRoll = false;
    this.Game = game;
    this.OrderPosition = game.players.length;
    if (this.OrderPosition == 0) {
      this.Leader = true
    } else {
      this.Leader = false
    }
    this.Position = 0
  }
  modifyCash(cash) {
    this.Cash = this.Cash + cash
  }
}
exports.Player = Player
