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
        this.isOpen = true;
        var Game = new Apology.Game(id);
        Apology.Games[id] = Game;
    }
    addMember(member) {
        if (member == null) return;
        if (!this.isOpen) {
            throw new UserInputError("This game isn't available.");
        }
        if (Apology.Players[member.id]) {
            throw new Error("You're already in this game.");
        }
        var Player = new Apology.Player(member, Apology.Games[this.id]);
        Apology.Players[Player.ID] = Player;
        Apology.Games[this.id].players[Apology.Games[this.id].players.length] = Player;
        Player.Game.announce("**" + member.username + "** has joined the game!");
    }
}