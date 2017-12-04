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
    }
}