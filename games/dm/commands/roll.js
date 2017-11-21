const Discord = require("discord.js")
exports.DMOnly=true;
exports.GameCommand=true;
exports.runCommand = function(user, args, msgo, DiscordMonies) {
  if (DiscordMonies.Players[user.id].needsToRoll==true) {
    var roll = Math.floor((Math.random() * 6)+1)
    var roll2 = Math.floor((Math.random() * 6)+1)
    var rollTotal = roll+roll2;
    DiscordMonies.Players[user.id].Game.movePlayer(DiscordMonies.Players[user.id], rollTotal)
    var embed = new Discord.RichEmbed();
    embed.setTitle("Roll")
    if (roll == roll2) {embed.addField("Doubles!", "You can roll again!")}
    embed.addField(user.username + " rolled a "+rollTotal, "and landed on "+DiscordMonies.Players[user.id].Game.Board.Fields[DiscordMonies.Players[user.id].Position].name)
    embed.setFooter(roll + " + " + roll2 + " = " + rollTotal)
    DiscordMonies.Players[user.id].Game.announce({embed:embed})
    if (roll != roll2) {DiscordMonies.Players[user.id].needsToRoll=false; DiscordMonies.Players[user.id].Game.advanceTurn() }
  }
}
