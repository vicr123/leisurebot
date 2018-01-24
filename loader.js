const Discord = require("discord.js");
const fs = require("fs");
let loaderVersion = "0.1";
global.prefix = "play:";
let games = [];
let joiningGames = {};
let userGames = {};

global.log = function(logMessage, type, extra) {
  let logString = logMessage;
  let logFormatting = "";
  let logPrefix = "";
  if (extra != null) logPrefix = extra + " ";
  switch (type) {
    case "info":
      logString = "[37m" + logMessage + "[39m[0m";
      logFormatting = "[37m"+logPrefix+"[-][39m";
      break;
    case "warning":
      logString = "[0m[33m" + logMessage + "[39m[0m";
      logFormatting = "[33m"+logPrefix+"[!][39m";
      break;
    case "critical":
      logString = "[0m[31m" + logMessage + "[39m[0m";
      logFormatting = "[31m"+logPrefix+"[x][39m";
      break;
    case "success":
      logString = "[32m" + logMessage + "[39m";
      logFormatting = "[32m"+logPrefix+"[S][39m";
      break;
  }
  console.log(logFormatting + " " + logString);
};

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
};

global.shuffleArray = function(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
  
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
  
    return array;
};

let client = new Discord.Client({
    restTimeOffset: 50
});

global.UserInputError = function() {
    var temp = Error.apply(this, arguments);
    temp.name = "UserInputError";
    this.name = "UserInputError";
    this.message = temp.message;
};

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
};

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
                userGames[message.author.id] = messageParts.shift() - 1;
            }
            let internalGameId = userGames[message.author.id];
            if (internalGameId == null) {
                throw new UserInputError("Invalid Game ID. Please prefix your command with a game ID.");
            }

            if (internalGameId >= games.length) {
                throw new UserInputError("Invalid Game ID. Please prefix your command with a game ID.");
            }
            
            let command = messageParts.shift();
            if (command == undefined || command == "") return; //this message has no content because it's an image, which can break things
            command = command.toLowerCase();
            games[internalGameId].processCommand(command, messageParts, message); //Pass control to the game module
        } else {
            if (!message.content.startsWith(prefix)) {
                return; //Don't do anything; this isn't a command
            }

            let args = message.content.substr(message.content.indexOf(":") + 1).split(" ");
            let command = args.shift().toLowerCase();

            switch (command) {
                case "ping": {
                    return message.channel.send("Testing ping...").then(sent => {
                        sent.edit(`:beach: **PONG!** Leisure took **__${sent.createdTimestamp - message.createdTimestamp}ms__** to respond.`);
                    });
                }
                case "help": {
                    let embed = new Discord.RichEmbed();
                    embed.setAuthor("Leisure Help");
                    embed.setColor("#fbc02d");
                    embed.setDescription("Leisure Commands");
                    embed.addField("General", "ping\nhelp", true);
                    embed.addField("Games", "`join`\n`close`", true);
                    embed.setFooter("Leisure Help ─ Commands in codeblocks are only available for multiplayer games");
                    message.channel.send(embed);
                    return;
                }
                case "eval": {
                    if (message.author.id !== "246574843460321291" && message.author.id !== "278805875978928128") return message.reply("You don't have access to this command.");
                    let evaledResult = eval(args.join(" "));
                    let embed = new Discord.RichEmbed();
                    embed.setAuthor("Leisure Eval");
                    embed.setColor("#673ab7");
                    embed.addField(":inbox_tray: Input", args.join(" "));
                    embed.addField(":outbox_tray: Output", evaledResult);
                    message.channel.send(embed);
                    break;
                }
                case "join": {
                    if (args.length != 0) {
                        return message.reply("Invalid number of arguments");
                    }

                    if (joiningGames[message.channel.id] == null) {
                        return message.reply("There are no games open in <#" + message.channel.id + "> at this time.");
                    }

                    games[joiningGames[message.channel.id]].addMember(message.author);
                    userGames[message.author.id] = joiningGames[message.channel.id];
                    return;
                }
                case "list": {
                    fs.readdir("games/installed", function(err, files) {
                        let m = "";

                        for (let key in files) {
                            let gameOptions = JSON.parse(fs.readFileSync("games/installed/" + files[key]));
                            if (gameOptions == null) {
                                throw new CommandError("Game definition file is corrupt. Please contact `vicr123#5096` or `zBlake#6715`.");
                            }
                            m += gameOptions.name + " ─ `" + gameOptions.command[0] + "`\n";
                        }

                        let embed = new Discord.RichEmbed();
                        embed.setAuthor("Leisure ─ Games List");
                        embed.setColor("#8bc34a");
                        embed.setDescription("Here's a list of some games you can try;");
                        embed.addField("Games", m, true);

                        message.channel.send(embed);
                    });
                    break;
                }
                case "close": {
                    if (args.length != 0) {
                        return message.reply("Invalid number of arguments");
                    }

                    if (joiningGames[message.channel.id] == null) {
                        return message.reply("There are no games you are able to close in <#" + message.channel.id + "> at this time.");
                    }

                    if (games[joiningGames[message.channel.id]].firstPlayer.id != message.author.id && !message.author.bot) {
                        return message.reply("You're not the creator of the current game! Ask the owner to run `play:close`.");
                    }

                    games[joiningGames[message.channel.id]].close();
                    message.channel.send(games[joiningGames[message.channel.id]].roomClosedMessage().replace("%1", "**" + parseInt(joiningGames[message.channel.id] + 1) + "**"));
                    joiningGames[message.channel.id] = null;
                    return;
                }
                default: {
                    if (joiningGames[message.channel.id] != null) {
                        message.reply("This channel is already collecting members. Close the previous game first.");
                        return;
                    }

                    fs.readdir("games/installed", function(err, files) {
                        if (err) {
                            throw new Error("There was an error retrieving that game from the database. Please try again later.");
                        }

                        for (let key in files) {
                            let gameOptions = JSON.parse(fs.readFileSync("games/installed/" + files[key]));
                            if (gameOptions == null) {
                                throw new CommandError("Game definition file is corrupt. Please contact `vicr123#5096` or `zBlake#6715`.");
                            }

                            if (gameOptions.command.indexOf(command) != -1) { //This is the game we're looking for
                                let gameId = games.length + 1;
                                let gameFile = "./games/" + gameOptions.directory + "/" + gameOptions.requireFile;
                                let gameClass = require(gameFile);
                                let game = new gameClass(gameId, client, message.author);
                                games.push(game);

                                if (gameOptions.capabilities.indexOf("multiplayer") != -1) {
                                    joiningGames[message.channel.id] = gameId - 1;
                                }
                                message.channel.send(gameOptions.joinMessage.replace("%1", "**" + parseInt(gameId) + "**"));

                                userGames[message.author.id] = gameId - 1;
                                return;
                            }
                        }

                        return message.channel.send("I don't think such a game exists. Try `" + prefix + "list` to see a list of available games.");
                    });
                }
            }
        }
    } catch (err) {
        var embed = new Discord.RichEmbed();
        embed.setColor("#FF0000");
        embed.addField("Details", err.message);

        if (err.name == "UserInputError") {
            embed.setTitle("<:userexception:348796878709850114> User Input Error");
            embed.setDescription("Leisure didn't understand what you were trying to say.");
        } else if (err.name == "CommandError") {
            embed.setTitle("<:userexception:348796878709850114> Command Error");
            embed.setDescription("Leisure couldn't complete that command.");
        } else {
            log("Uncaught Exception:" + err.stack, "critical");
            embed.setTitle("<:exception:346458871893590017> Internal Error");
            embed.setFooter("This error has been logged, and we'll look into it.");
            embed.setDescription("Leisure has run into a problem trying to process that command.");
        }

        message.channel.send("", {embed: embed});
    }
});

client.login(require("./keys.js").loginToken).then(function() {
    log("We're ready to relax.", "info");
});
