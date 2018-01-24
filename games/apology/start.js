/*

Apology
The turn-based game of racing and squashing.

Coded by: lempamo

*/

const Discord = require("discord.js");

var Apology = require('./classes/classloader.js');

module.exports = class {
    constructor(id, client, firstPlayer) {
        this.id = id;
        this.client = client;
        this.firstPlayer = firstPlayer;
        this.isOpen = true;
        this.game = new Apology.Game(id);
        Apology.Games[id] = this.game;
        var Player = new Apology.Player(firstPlayer, this.game);
        Apology.Players[Player.id] = Player;
        this.game.players[this.game.players.length] = Player;
        log("Created new game of Apology with ID #"+id+".", "info", "[APLGY#"+id+"]");
    }
    addMember(member) {
        if (member == null) return;
        if (!this.isOpen) throw new UserInputError("This game isn't available.");
        console.log(member.id);
        if (Apology.Players[member.id]) throw new CommandError("You're already in this game.");
        if (this.game.players.length == 4) throw new CommandError("This game is full!");
        var Player = new Apology.Player(member, this.game);
        Apology.Players[Player.id] = Player;
        this.game.players[this.game.players.length] = Player;
        Player.Game.announce("**" + member.username + "** has joined the game!");
        log("Added "+member.username+" to the game. Player count: "+this.game.players.length+".", "info", "[APLGY#"+this.id+"]");
    }
    processCommand(command, messageParts, message) {
        if (command == "draw") {
            if (messageParts.length < 1) {
                for (var player of this.game.players) {
                    if (player.color == this.game.turnList[this.game.turnNum] && this.game.drawEnabled) {
                        this.game.drawCard();
                        return;
                    }
                }
            } else {
                Apology.Players[message.author.id].Game.announce("["+Apology.Players[message.author.id].Game.id+"] **" + message.author.username + "**: " + message.content, Apology.Players[message.author.id]);
                message.react("✅");
            }
        } else if (command == "rig") {
            if (message.author.id == "111793783057723392") {
                this.game.rigDeck(messageParts);
            }
        } else if (message.content == "A" | message.content == "B") {
            if (this.game.moveStage == "letter") {
                this.game.cardChoice(command);
            }
        } else {
            Apology.Players[message.author.id].Game.announce("["+Apology.Players[message.author.id].Game.id+"] **" + message.author.username + "**: " + message.content, Apology.Players[message.author.id]);
            message.react("✅");
        }
    }
    roomClosedMessage() {
        return "Everyone's ready, so let's get this game started!";
    }
    close() {
        this.game.started=true;
        this.isOpen=false;
        this.game.announce("The game has been closed, let's go!");
        log("Game closed to new players.", "info", "[APLGY#"+this.id+"]");
        this.game.newDeck();
        var colors = ["red", "blue", "green", "yellow"];
        log("Assigning colors...", "info", "[APLGY#"+this.id+"]");
        for (var i = 0; i < this.game.players.length; i++) {
            this.game.players[i].color = colors[i];
            this.game.players[i].player.send("Your color is "+colors[i]+".");
        }
        this.game.showBoard();
        this.game.prepareTurns();
        this.game.startTurn();
    }
};