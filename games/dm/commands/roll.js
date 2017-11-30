const Discord = require("discord.js");
const { createCanvas, loadImage, registerFont, Image } = require('canvas') //update to the latest version of canvas

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
        if (roll == roll2) {embed.addField("Doubles!", "You can roll again!"); DiscordMonies.Players[user.id].Game.threwDouble=true;}
        embed.addField(user.username + " rolled a " + rollTotal, " and landed on "+newField.name)
        DiscordMonies.Players[user.id].needsToRoll = false
        if (newField instanceof DiscordMonies.BoardItems.Property && newField.owner == null) {
        var canvas = createCanvas(600, 900) //rectangle height is twice the size of the width because of maths
        var ctx = canvas.getContext('2d')
        const generate = () =>
        {
            function wrapText(context, text, x, y, maxWidth, lineHeight)
            {
                var words = text.split(' ');
                var line = '';

                for (var n = 0; n < words.length; n++)
                {
                    var testLine = line + words[n] + ' ';
                    var metrics = context.measureText(testLine);
                    var testWidth = metrics.width;
                    if (testWidth > maxWidth && n > 0)
                    {
                        context.fillText(line, x, y);
                        line = words[n] + ' ';
                        y += lineHeight;
                    }
                    else
                    {
                        line = testLine;
                    }
                }
                context.fillText(line, x, y);
            }

            registerFont('./fonts/kabel.ttf', { family: 'Kabel' }) //optional, you'll need to have the kabel font in a "fonts" directory for this to work

            //The color of this card
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "black";
            ctx.fillRect(1, 1, canvas.width - 2, canvas.height - 2);
            ctx.fillStyle = "white";
            ctx.fillRect(2, 2, canvas.width - 2, canvas.height - 2);
            ctx.fillStyle = "black";
            ctx.fillRect(5, 5, canvas.width - 5, canvas.height / 6 + 2);
            ctx.fillStyle = "#4fc3f7"; //custom color here
            ctx.fillRect(6, 6, canvas.width - 6, canvas.height / 6);
            ctx.fillStyle = "white";
            ctx.fillRect(canvas.width - 6, 5, canvas.width, canvas.height / 6 + 3);

            //The text of the property
            ctx.font = "bold 30px Tahoma";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.fillText("TITLE DEEDS", canvas.width / 2, 75);
            ctx.font = "48px Tahoma";
            ctx.fillText("PROPERTY NAME", canvas.width / 2, 135); //property name here

            //Renting text
            //With HOTEL
            ctx.font = "bold 39px Kabel";
            ctx.textAlign = "center";
            ctx.fillText("RENT M10", canvas.width / 2, 255);
            ctx.textAlign = "left";
            ctx.font = "lighter 38px Kabel";
            ctx.fillText("With 1 House", 15, 330);
            ctx.fillText("With 2 Houses", 15, 375);
            ctx.fillText("With 3 Houses", 15, 420);
            ctx.fillText("With 4 Houses", 15, 465);
            ctx.fillText("With HOTEL", 15, 510);

            //PRICES FOR HOUSES HERE
            ctx.textAlign = "right";
            ctx.fillText("HOUSE 1 PRICE", canvas.width - 10, 330); //house 1
            ctx.fillText("HOUSE 2 PRICE", canvas.width - 10, 375); //house 2
            ctx.fillText("HOUSE 3 PRICE", canvas.width - 10, 420); //house 3
            ctx.fillText("HOUSE 4 PRICE", canvas.width - 10, 465); //house 4
            ctx.fillText("HOTEL PRICE", canvas.width - 10, 510); //hotel

            ctx.font = "bold 33px Kabel";
            ctx.textAlign = "center";
            ctx.fillText("Mortgage Value  MORTGAGE VALUE", canvas.width / 2, 660); //replace MORTGAGE VALUE with the value
            ctx.font = "33px Kabel";
            ctx.fillText("Houses cost HOUSE COST each", canvas.width / 2, 720); //replace HOUSE COST with the value
            ctx.textAlign = "center";
            wrapText(ctx, "Hotels, HOTEL COST each plus 4 houses", 0 + canvas.width / 2, 765, canvas.width - canvas.width / 4, 30); //replace HOTEL COST with the value
        };
        generate();

        msgo.reply(
        {
            files: [
            {
                attachment: canvas.toBuffer(),
                name: 'stats.png'
            }]
        })
            embed.addField("Unowned property", "Nobody owns this property, you have to buy it or do an auction to proceed")
        } else if (newField.owner) {
            DiscordMonies.Players[user.id].Game.advanceTurn();
        } else {
            msgo.reply("else statement happened")
            DiscordMonies.Players[user.id].Game.advanceTurn();
        }
        embed.setFooter(roll + " + " + roll2 + " = " + rollTotal)
        DiscordMonies.Players[user.id].Game.announce({embed:embed})
    }
}
