exports.DMOnly=true
exports.GameCommand=true
exports.runCommand=function(user, args, msgo, DiscordMonies) {
    DiscordMonies.Players[user.id].Game.players.forEach(function(plr, key) {
        if (plr.ID == user.id) {
            DiscordMonies.Players[user.id].Game.players[key] = null
            DiscordMonies.Players[user.id].Game.restructure();
            DiscordMonies.Players[user.id] = null;
            msgo.reply("Left the game")
        }
    })
}