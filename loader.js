const Discord = require("discord.js");
const fs = require("fs");
let loaderVersion = "0.1";
let prefix = "play:"
let games = [];
let joiningGames = {};
let userGames = {};

global.log = function(message) {
    console.log(message);
}

global.userTag = function(user) {
    //return user.name + "#" + user.discriminator;
    return user.tag;
}

global.getRandom = function() {
    if (arguments.length == 1) {
        if (typeof arguments[0] == Array) {
            var random = Math.floor(Math.random() * 1000) % arguments[0].length;
            return arguments[0][random];
        }
    } else {
        var random = Math.floor(Math.random() * 1000) % arguments.length;
        return arguments[random];
    }
}

let client = new Discord.Client({
    restTimeOffset: 50
});

global.UserInputError = function() {
    var temp = Error.apply(this, arguments);
    temp.name = "UserInputError";
    this.name = "UserInputError";
    this.message = temp.message;
}

UserInputError.prototype = Object.create(Error.prototype, {
    constructor: {
        value: UserInputError,
        writable: true,
        configurable: true
    }
});

global.CommandError = function() {
    var temp = Error.apply(this, arguments);
    temp.name = "CommandError";
    this.name = "CommandError";
    this.message = temp.message;
}

CommandError.prototype = Object.create(Error.prototype, {
    constructor: {
        value: CommandError,
        writable: true,
        configurable: true
    }
});

client.on("message", function(message) {
    try {
        if (message.author.bot) {
            return; //Ignore all bots
        }

        if (message.guild == null) { //This is a DM
            let messageParts = message.content.split(" ");
            if (!isNaN(messageParts[0])) {
                userGames[message.author.id] = messageParts.shift();
            }
            let internalGameId = userGames[message.author.id];
            if (internalGameId == null) {
                throw new UserInputError("Invalid Game ID. Please prefix your command with a game ID.")
            }
            internalGameId--;

            if (internalGameId >= games.length) {
                throw new UserInputError("Invalid Game ID. Please prefix your command with a game ID.")
            }

            let command = messageParts.shift().toLowerCase();
            games[internalGameId].processCommand(command, messageParts, message); //Pass control to the game module
        } else { //This is in a channel
            if (!message.content.startsWith(prefix)) {
                return; //Don't do anything; this isn't a command
            }

            let args = message.content.substr(message.content.indexOf(":") + 1).split(" ");
            let command = args.shift().toLowerCase();

            switch (command) {
                case "ping": {
                    return message.channel.send('Pinging...').then(sent => {
                        sent.edit(`:beach: **PONG!** Leisure took **__${sent.createdTimestamp - message.createdTimestamp}ms__** to respond.`);
                    });
                }
                case "help": {
                  const embed = new Discord.MessageEmbed();
                  embed.setAuthor("Leisure Help");
                  embed.setColor("#26c6da");
                  embed.setDescription("Leisure Commands")
                  embed.addField("General", "ping\nhelp", true);
                  embed.addField("Games", "`join`\n`close`", true);
                  embed.setFooter("Leisure Help ─ Commands in codeblocks are only available for multiplayer games", true);
                  message.channel.send({ embed })
                }
                case "join": {
                    if (args.length != 0) {
                        throw new UserInputError("Invalid number of Arguments");
                    }

                    if (joiningGames[message.channel.id] == null) {
                        throw new UserInputError("There is no game collecting members at the moment.");
                    }

                    games[joiningGames[message.channel.id]].addMember(message.author);
                    userGames[message.author.id] = joiningGames[message.channel.id];
                    return;
                }
                default: {
                    if (joiningGames[message.channel.id] != null) {
                        throw new UserInputError("Game already collecting members. Close the previous game first.");
                    }

                    fs.readdir("games/installed", function(err, files) {
                        if (err) {
                            throw new UserInputError("Error!")
                        }

                        for (let key in files) {
                            let gameOptions = JSON.parse(fs.readFileSync("games/installed/" + files[key]));
                            if (gameOptions == null) {
                                message.channel.send("Game definition file is corrupt. Please contact `vicr123#5096` or `zBlake#6715`.");
                                return;
                            }

                            if (gameOptions.command.indexOf(command) != -1) { //This is the game we're looking for
                                let gameId = games.length + 1;
                                let gameFile = "./games/" + gameOptions.directory + "/" + gameOptions.requireFile;
                                let gameClass = require(gameFile);
                                let game = new gameClass(gameId, client, message.author);
                                games.push(game);
                                joiningGames[message.channel.id] = gameId - 1;

                                message.channel.send(gameOptions.joinMessage.replace("%1", "**" + parseInt(gameId) + "**")); //bold current number of game

                                userGames[message.author.id] = gameId - 1;
                                return;
                            }
                        }
                    });
                }
            }
        }
    } catch (err) {
        var embed = new Discord.RichEmbed;
        embed.setColor("#FF0000");
        embed.addField("Details", err.message);

        if (err.name == "UserInputError") {
            embed.setTitle("<:userexception:348796878709850114> User Input Error");
            embed.setDescription("Leisure didn't understand what you were trying to say.");
        } else if (err.name == "CommandError") {
            embed.setTitle("<:userexception:348796878709850114> Command Error");
            embed.setDescription("Leisure couldn't complete that command.");
        } else {
            log("Uncaught Exception:");
            log(err.stack);

            embed.setTitle("<:exception:346458871893590017> Internal Error");
            embed.setFooter("This error has been logged, and we'll look into it.");
            embed.setDescription("Leisure has run into a problem trying to process that command.");
        }

        message.channel.send("", {embed: embed});
    }
});

client.login(require("./keys.js").loginToken).then(function() {
    log("We're ready to relax.");
});
