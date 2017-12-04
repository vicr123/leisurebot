const Discord = require("discord.js")
exports.DMOnly=true;
exports.GameCommand=true;
exports.runCommand = function(user, args, msgo, DiscordMonies) {
    if (DiscordMonies.Players[user.id].Game.bidInfo.currentlyBidding==true && DiscordMonies.Players[user.id].isBidding==true) {
        if (args == "") {
            var game = DiscordMonies.Players[user.id].Game
            game.bidInfo.highestBid = game.bidInfo.highestBid+10
            game.bidInfo.bidder = DiscordMonies.Players[user.id]
            game.announce(user.username + " is bidding M" + game.bidInfo.highestBid)
        } else if (parseInt(args) && parseInt(args) > DiscordMonies.Players[user.id].Game.bidInfo.highestBid) {
            var game = DiscordMonies.Players[user.id].Game
            game.bidInfo.highestBid = parseInt(args)
            game.bidInfo.bidder = DiscordMonies.Players[user.id]
            game.announce(user.username + " is bidding M" + game.bidInfo.highestBid)
        }
    }
}
