const Discord = require("discord.js");
const embedColor = "#e53935";

let availableCards = [
    "B0", "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "BS", "BR", "B+",
          "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "BS", "BR", "B+",
    "G0", "G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "GS", "GR", "G+",
          "G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "GS", "GR", "G+",
    "R0", "R1", "R2", "R3", "R4", "R5", "R6", "R7", "R8", "R9", "RS", "RR", "R+",
          "R1", "R2", "R3", "R4", "R5", "R6", "R7", "R8", "R9", "RS", "RR", "R+",
    "Y0", "Y1", "Y2", "Y3", "Y4", "Y5", "Y6", "Y7", "Y8", "Y9", "YS", "YR", "Y+",
          "Y1", "Y2", "Y3", "Y4", "Y5", "Y6", "Y7", "Y8", "Y9", "YS", "YR", "Y+",
    "+W", "+W", "+W", "+W", "+4", "+4", "+4", "+4"
]

module.exports = class {
    constructor(id, client, firstPlayer) {
        this.id = id;
        this.gameMembers = [];
        this.decks = {};
        this.isOpen = true;
        this.currentPlayer = -1;
        this.topCard = {
            card: "",
            color: ""
        };

        //Prepare the game
        this.drawPile = [];
        this.discardedCards = availableCards;
        this.shuffleDiscardedCards(); //Shuffle all the cards

        //true = moving downwards (i.e. 0 -> inf.)
        //false = moving upwards (i.e. inf. -> 0)
        this.playDirection = true;
        this.addMember(firstPlayer);
    }

    shuffleDiscardedCards() {
        this.drawPile = this.discardedCards;
        this.discardedCards = [];
        for (let i = this.drawPile.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            let temp = this.drawPile[j];
            this.drawPile[j] = this.drawPile[i]
            this.drawPile[i] = temp;
        }
    }

    takeTopCard() {
        let card = this.drawPile.shift();
        if (this.drawPile.length == 0) {
            shuffleDiscardedCards();
            broadcastMessage(":diamonds: The draw pile is empty and the discard pile has been shuffled.");
        }
        return card;
    }

    addMember(member) {
        if (member == null) return;
        if (!this.isOpen) {
            throw new UserInputError("This game isn't available.")
        }
        if (this.gameMembers.indexOf(member) != -1) {
            throw new Error("You're already in this game.");
        }
        this.broadcastMessage(":inbox_tray: " + getRandom("%1 has joined this room!",
                                        "%1 joined the party!",
                                        "%1 is in the house!",
                                        "%1 is ready to party!",
                                        "%1 joined the room!",
                                        "Please welcome %1 to the room!",
                                        "Hey look, %1 is here!",
                                        "Say hello to %1!",
                                        "Please welcome in %1!",
                                        "Here comes %1, looking classy as always.",
                                        "Hey there %1! Looking good as always.").replace("%1", "__**" + member.tag + "**__"));
        this.gameMembers.push(member);
        member.send("You've successfully joined game **#" + this.id + "**!");

        //Prepare this member's deck
        this.decks[member.id] = [];
        for (let i = 0; i < 7; i++) {
            this.decks[member.id].push(this.takeTopCard());
        }
    }

    close() {
        if (!this.isOpen) {
            return;
        }
        this.isOpen = false;
        this.broadcastMessage(":closed_lock_with_key: Game **#" + this.id + "** is closed and is now starting.");
        this.currentPlayer = 0;

        //Start playing!
        let topCard = this.takeTopCard();
        while (this.getCardDefinition(topCard, "/") == "/") {
            this.discardedCards.push(topCard);
            topCard = this.takeTopCard();
        }
        this.topCard = this.getCardDefinition(topCard);

        this.currentPlayer = 0;
        this.sendNewTurnNotification();
    }

    processCommand(command, args, message) {
        switch (command) {
            case "close": {
                this.close();
            }
            default: {
                message.channel.send("Command:" + command + "\nArgs:" + args);
            }
        }
    }

    broadcastMessage(message) {
        //Keep in mind that this broadcast system is not intended as a chat system, that will be implemented per-game.
        for (let member in this.gameMembers) {
            this.gameMembers[member].send("**#" + this.id + "**: " + message);
        }
    }

    createEmbed(message) {
        let e = new Discord.RichEmbed();
        e.setColor(embedColor)
        e.setTitle("Game #" + this.id);
        e.setDescription(message);
        return e;
    }

    getHand(member) {
        let hand = "";
        for (let key in this.decks[member]) {
            let card = this.decks[member][key];
            if (this.topCard[0] == card[0] || this.topCard[1] == card[1] || card[0] == "+") {
                hand += "**" + card + "** ";
            } else {
                hand += card + " ";
            }
        }
    }

    getCardDefinition(card, defaultColor) {
        if (card.length != 2) {
            return null;
        }

        if (card[0] != "B" && card[0] != "G" && card[0] != "R" && card[0] != "Y") {
            return null;
        }
        return {
            card: card,
            color: card[0] == ("+" ? defaultColor : card[0])
        }
    }

    sendNewTurnNotification() {
        let currentPlayer = this.gameMembers[this.currentPlayer]
        let e = this.createEmbed("It is now your turn.");
        e.addField("Top Card", this.topCard.card);
        e.addField("Your Hand", this.getHand(currentPlayer.id));
        currentPlayer.send(e);
    }
}
