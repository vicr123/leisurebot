const Discord = require("discord.js");
const Canvas = require("canvas");

exports.DMOnly=true;
exports.GameCommand=true;
exports.runCommand = function(user, args, msgo, DiscordMonies) {
    console.log(DiscordMonies.Players[user.id].needsToRoll == true);

    if (DiscordMonies.Players[user.id].needsToRoll == true) {
        var roll = Math.floor((Math.random() * 6)+1)
        var roll2 = Math.floor((Math.random() * 6)+1)
        var rollTotal = roll+roll2;
        DiscordMonies.Players[user.id].Game.movePlayer(DiscordMonies.Players[user.id], rollTotal)
        var newField = DiscordMonies.Players[user.id].Game.Board.Fields[DiscordMonies.Players[user.id].Position]
        var embed = new Discord.RichEmbed();
        embed.setTitle("Roll")
        console.log("test1")
        if (roll == roll2) {embed.addField("Doubles!", "You can roll again!"); DiscordMonies.Players[user.id].Game.threwDouble=true;}
        embed.addField(user.username + " rolled a " + rollTotal + " and landed on "+newField.name)
        DiscordMonies.Players[user.id].needsToRoll = false
        console.log("test12")

        if (newField.owner && newField.owner == null) {
            const Image = Canvas.Image;
            var canvas = new Canvas(50, 100) //rectangle height is twice the size of the width because of maths
            var ctx = canvas.getContext('2d')
            const generate = () => {
                function wrapText(context, text, x, y, maxWidth, lineHeight) {
                    var words = text.split(' ');
                    var line = '';

                    for (var n = 0; n < words.length; n++) {
                        var testLine = line + words[n] + ' ';
                        var metrics = context.measureText(testLine);
                        var testWidth = metrics.width;
                        if (testWidth > maxWidth && n > 0) {
                            context.fillText(line, x, y);
                            line = words[n] + ' ';
                            y += lineHeight;
                        } else {
                            line = testLine;
                        }
                    }
                    context.fillText(line, x, y);
                }

                //The color of this card
                ctx.fillStyle = cardColor;
                ctx.fillRect(5, 5, canvas.width - 10, canvas.height / 8);

                //The text of the property
                ctx.font = "20px Georgia";
                ctx.fillText("TITLE DEEDS", canvas.width / 2, 10);
                wrapText(ctx, propertyName, canvas.width / 4, 15, canvas.width - 10, 4);

                //Renting text
                //With HOTEL
                ctx.font = "13px Georgia";
                ctx.fillText("RENT " + propertyCost, 15, 15);
                ctx.fillText("With 1 House       " + propertyOneHCost, 15, 15);
                ctx.fillText("With 2 Houses      " + propertyTwoHCost, 15, 15);
                ctx.fillText("With 30 Houses     " + propertyThreeHCost, 15, 15);
                ctx.fillText("With 4 Houses      " + propertyFourHCost, 15, 15);
                ctx.fillText("With HOTEL         " + propertyHotelCost, 15, 15);

                wrapText(ctx, "Mortgage Value " + propertyMortgageValue, canvas.width / 4, 15, canvas.width - 10, 4);
                wrapText(ctx, "Houses cost " + propertyHouseCost + " each", canvas.width / 4, 15, canvas.width - 10, 4);
                wrapText(ctx, "Hotels, " + propertyHouseCost + " each plus 4 houses", canvas.width / 4, 15, canvas.width - 10, 4);
            };
            generate();
            console.log(canvas.toBuffer())
            message.reply({
                files: [
                    {
                        attachment: canvas.toBuffer(),
                        name: 'stats.png'
                    }
                ]
            });

            message.reply("yeah ya rolled")//this is NOT being sent <<<<
            embed.addField("Unowned property", "Nobody owns this property, you have to buy it or do an auction to proceed")
        } else if (newField.owner) {

            DiscordMonies.Players[user.id].Game.advanceTurn();
        } else {
            message.reply("else statement happened")
            DiscordMonies.Players[user.id].Game.advanceTurn();
        }
        embed.setFooter(roll + " + " + roll2 + " = " + rollTotal)
        DiscordMonies.Players[user.id].Game.announce({embed:embed})
    }
}
