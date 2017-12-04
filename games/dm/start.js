/*
Discord Monies
Monopoly for Discord

Ported to Leisure
*/

const Discord = require("discord.js");
var fs = require("fs");
var DiscordMonies = require('./classes/classloader.js');

module.exports = class {
  constructor(id, client, firstPlayer) {
    console.log("DISCORD MONIES | Preparing the game... ["+id+"]")
    this.id = id;
    this.client = client;
    this.firstPlayer = firstPlayer;
    this.isOpen = true;
    var Game = new DiscordMonies.Game(id);
    DiscordMonies.Games[id] = Game
    var Player = new DiscordMonies.Player(firstPlayer, Game)
    DiscordMonies.Players[Player.ID] = Player
    DiscordMonies.Games[this.id].players[DiscordMonies.Games[this.id].players.length] = Player
    console.log("DISCORD MONIES | Game " +id+ " is ready")
  }
  addMember(member) {
    if (member == null) return;
    if (!this.isOpen) {
        throw new UserInputError("This game isn't available.")
    }
    if (DiscordMonies.Players[member.id]) {
        throw new Error("You're already in this game.");
    }
    var Player = new DiscordMonies.Player(member, DiscordMonies.Games[this.id])
    DiscordMonies.Players[Player.ID] = Player
    DiscordMonies.Games[this.id].players[DiscordMonies.Games[this.id].players.length] = Player
    Player.Game.announce("**" + member.username + "** has joined the game!")
  }
  roomClosedMessage() {
    return "Game's closed, let's roll the dice!";
  }
  close() {
    DiscordMonies.Games[this.id].Started=true;
    this.isOpen=false;
    DiscordMonies.Games[this.id].announce("The game has been closed, let's go!");
    DiscordMonies.Games[this.id].advanceTurn();
    console.log("DISCORD MONIES | Game " + this.id + " started!")
  }
  processCommand(command, args, message) {
    if (fs.existsSync('games/dm/commands/'+command+'.js')) {
        var command = require('./commands/'+command+'.js')
        if (command.DMOnly == true) {
          if (message.guild == null) {
            if (command.GameCommand == true) {
              if (DiscordMonies.Players[message.author.id] && DiscordMonies.Players[message.author.id].Game.Started == true) {
                command.runCommand(message.author, args.join(" "), message, DiscordMonies)
              } else {
                message.reply("You're not in a game or your game hasn't started yet.")
              }
            }
          }
        } else {
          if (command.GameCommand == true) {
            if (DiscordMonies.Players[message.author.id] && DiscordMonies.Players[message.author.id].Game.Started == true) {
              command.runCommand(message.author, args.join(" "), message, DiscordMonies)
            } else {
              msg.reply("You're not in a game or your game hasn't started yet.")
            }
          } else {
            command.runCommand(message.author, args.join(" "), message, DiscordMonies)
          }
        }
      } else {
        console.log(args)
        if (args.join(" ") == "") {
        DiscordMonies.Players[message.author.id].Game.announce("["+DiscordMonies.Players[message.author.id].Game.id+"] **" + message.author.username + "**: " + message.content, DiscordMonies.Players[message.author.id])
        message.react("✅")
        } else {
        DiscordMonies.Players[message.author.id].Game.announce("["+DiscordMonies.Players[message.author.id].Game.id+"] **" + message.author.username + "**: " + message.content, DiscordMonies.Players[message.author.id])
        message.react("✅")
      }
      }
    }
}
