exports.DMOnly=true;
exports.GameCommand=true;
exports.runCommand = function(user, args, msgo, DiscordMonies) {
    if (args[1]) {
        DiscordMonies.Players[user.id].Game.announce("["+DiscordMonies.Players[user.id].Game.id+"] **" + user.username + "**: " + args, DiscordMonies.Players[user.id])
        msgo.react("✅")
    }
}
