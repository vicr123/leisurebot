const Discord = require("discord.js")
exports.DMOnly=true;
exports.GameCommand=true;
exports.runCommand = function(user, args, msgo, DiscordMonies) {
  if (DiscordMonies.Players[user.id].needsToRoll == false && DiscordMonies.Players[user.id].Game.currentPlayer.Username == user.username) {
    var field = DiscordMonies.Players[user.id].Game.Board.Fields[DiscordMonies.Players[user.id].Position]
    console.log(field)
    if (field.owner == null) {
      DiscordMonies.Players[user.id].modifyCash(-(field.purchaseValue))
      field.owner = DiscordMonies.Players[user.id]
      DiscordMonies.Players[user.id].Game.advanceTurn();
      DiscordMonies.Players[user.id].Game.announce(DiscordMonies.Players[user.id].Username + " has purchased " + field.name)
    }
  }
}
