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
        this.isOpen = true;
        this.currentPlayer = -1;
        this.addMember(firstPlayer);

        //Prepare the game
        this.drawPile = [];
        this.discardedCards = availableCards;
        this.shuffleDiscardedCards(); //Shuffle all the cards
    }

    shuffleDiscardedCards() {
        this.drawPile = this.discardedCards;
        this.discardedCards = [];
        for (let i = this.drawPile.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [
                this.drawPile[i],
                this.drawPile[j]
            ] = [
                this.drawPile[j],
                this.drawPile[i]
            ];
        }
    }

    takeTopCard() {
        let card = this.drawPile.shift();
        if (this.drawPile.length == 0) {
            shuffleDiscardedCards();
            broadcastMessage("The draw pile is empty and the discard pile has been shuffled.");
        }
        return card;
    }

    addMember(member) {
        if (member == null) return;
        if (!this.isOpen) {
            throw new Error("This game isn't available.")
        }
        this.broadcastMessage("`JOIN` | " + getRandom("%1 has joined this room!",
                                        "%1 joined the party!",
                                        "%1 is in the house!",
                                        "%1 is ready to party!",
                                        "%1 joined the room!",
                                        "Please welcome %1 to the room!",
                                        "Hey look, %1 is here!",
                                        "Say hello to %1!",
                                        "Please welcome in %1!",
                                        "Hey there %1! Looking good as always.").replace("%1", "**" + member.tag + "**"));

        this.gameMembers.push(member);
        member.send("You've successfully joined game **#" + this.id + "**!");
    }

    close() {
        this.isOpen = false;
        this.broadcastMessage("`CLOSE` | This game is now closed.");

        this.currentPlayer = 0;
    }

    processCommand(command, args, message) {
        switch (command) {
            case "close": {
                close();
            }
            default: {
                message.channel.send("Command:" + command + "\nArgs:" + args);
            }
        }
    }

    broadcastMessage(message) {
        for (let member in this.gameMembers) {
            this.gameMembers[member].send(message);
        }
    }
}
