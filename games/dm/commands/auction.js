const Discord = require("discord.js")
exports.DMOnly=true;
exports.GameCommand=true;
exports.runCommand = function(user, args, msgo, DiscordMonies) {
  if (args == "") {
    if (DiscordMonies.Players[user.id].needsToRoll == false && DiscordMonies.Players[user.id].Game.bidInfo.currentlyBidding == false && DiscordMonies.Players[user.id].Game.currentPlayer.Username == user.username) {
      var field = DiscordMonies.Players[user.id].Game.Board.Fields[DiscordMonies.Players[user.id].Position]
      var game = DiscordMonies.Players[user.id].Game
      if (field instanceof DiscordMonies.Containers.Purchasable && field.owner == null) {
        game.announce("Starting an auction for: " + field.name + ", bid using the `bid` command and stop bidding with the `stopbidding` command.");
        game.bidInfo.playersBidding = game.players.length
        game.bidInfo.currentlyBidding = true
        game.bidInfo.biddingFor = DiscordMonies.Players[user.id].Position
        game.players.forEach(function(elem) {
            elem.isBidding = true;
        })
      }
    }
  }
}
