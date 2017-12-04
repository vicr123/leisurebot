const Discord = require("discord.js")
exports.DMOnly=true;
exports.GameCommand=true;
exports.runCommand = function(user, args, msgo, DiscordMonies) {
    if (DiscordMonies.Players[user.id].Game.bidInfo.currentlyBidding==true && DiscordMonies.Players[user.id].isBidding==true) {
        var game = DiscordMonies.Players[user.id].Game
        DiscordMonies.Players[user.id].isBidding=false
        game.bidInfo.playersBidding=game.bidInfo.playersBidding-1
        if (game.bidInfo.playersBidding==0) {
            game.announce(game.bidInfo.bidder.Username + " has won the auction!")
            game.bidInfo.currentlyBidding=false
            game.bidInfo.bidder.modifyCash(-(game.bidInfo.highestBid))
            game.Board.Fields[game.bidInfo.biddingFor].owner = game.bidInfo.bidder
            game.advanceTurn();
        } else {
            game.announce(user.username + " has left the auction!")
        }
    }
}
