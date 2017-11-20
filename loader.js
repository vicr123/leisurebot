const Discord = require("discord.js");
const fs = require("fs");
let loaderVersion = "0.1";
let prefix = "play:"
let games = [];

global.log = function(message) {
    console.log(message);
}

let client = new Discord.Client();

client.on("message", function(message) {
    if (message.author.bot) {
        return; //Ignore all bots
    }

    if (message.guild == null) { //This is a DM

    } else { //This is in a channel
        if (!message.content.startsWith(prefix)) {
            return; //Don't do anything; this isn't a command
        }

        let args = message.content.substr(message.content.indexOf(":") + 1).split(" ");
        let command = args.shift().toLowerCase();

        switch (command) {
            case "ping": {
                message.channel.send("Hey");
                return;
            }
            case "help": {
                message.channel.send("Help is right here");
                return;
            }
            default: {
                
            }
        }
    }
});

client.login(require("./keys.js").loginToken).then(function() {
    log("We're ready.");
});