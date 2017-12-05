const Discord = require("discord.js");

class Game {
    constructor(id) {
        this.id = id;
        this.started = false;
        this.players = [];
        this.cardDeck = [];
        this.boardTiles = ["YSTART", "AY1", "AY2", "AY3", "AY4", "YSL21", "YSL22", "YSL23", "YSL24", "YSL25", "AY5", "AY6", "RSL11", "RHENT", "RSL13",
                           "RSTART", "AR1", "AR2", "AR3", "AR4", "RSL21", "RSL22", "RSL23", "RSL24", "RSL25", "AR5", "AR6", "BSL11", "BHENT", "BSL13",
                           "BSTART", "AB1", "AB2", "AB3", "AB4", "BSL21", "BSL22", "BSL23", "BSL24", "BSL25", "AB5", "AB6", "GSL11", "GHENT", "GSL13",
                           "GSTART", "AG1", "AG2", "AG3", "AG4", "GSL21", "GSL22", "GSL23", "GSL24", "GSL25", "AG5", "AG6", "YSL11", "YHENT", "YSL13"];
        this.turnList = [];
        this.turnNum = 0;
    }
    getPlayer(userResolve) {
        var returnValue = null;
        if (parseInt(userResolve)) {
            returnValue = this.players[parseInt(userResolve)];
        } else {
            this.players.forEach(function(elem, index) {
                if (elem == userResolve) {
                    returnValue = this.players[index];
                }
            })
        }
        return returnValue;
    }
    getPlayerFromColor(color) {
        for (var player of this.players){
            if (player.color == color){
                return player;
            }
        }
    }
    announce(message, ignorePlayer) {
        this.players.forEach(function(elem) {
            if (ignorePlayer) {
                if (ignorePlayer.id != elem.id) {
                    elem.player.send(message);
                }
            } else {
                elem.player.send(message);
            }
        });
        return true;
    }
    newDeck() {
        var baseDeck = ["1", "1", "1", "1", "1",
                        "2", "2", "2", "2",
                        "3", "3", "3", "3",
                        "4", "4", "4", "4",
                        "5", "5", "5", "5",
                        "7", "7", "7", "7",
                        "8", "8", "8", "8",
                        "10", "10", "10", "10",
                        "11", "11", "11", "11",
                        "12", "12", "12", "12",
                        "S", "S", "S", "S"];
        this.cardDeck = shuffleArray(baseDeck);
    }
    showBoard() {
        const { createCanvas, loadImage, Image } = require('canvas');
        const canvas = createCanvas(600, 600);
        const ctx = canvas.getContext('2d');
        var tempApology = require('../classloader.js');
        var tempID = this.id;
        var drawing = true;

        var image = new Image();
        image.onload = function(){
            ctx.drawImage(image, 0, 0);
            drawing = false;
        };
        image.src = "games/apology/images/board.png";

        while (drawing){};
        var pawns = ["rpawn1", "rpawn2", "rpawn3", "rpawn4", "bpawn1", "bpawn2", "bpawn3", "bpawn4"];
        for (var pawn of pawns){
            drawing = true;
            var pawnPoint = tempApology.Games[tempID].getPointFromPawn(pawn);

            image = new Image();
            image.onload = function(){
                ctx.drawImage(image, pawnPoint.x, pawnPoint.y);
                drawing = false;
            };
            image.src = "games/apology/images/"+pawn+".png";
            while (drawing){};
        }

        return tempApology.Games[tempID].announce(new Discord.Attachment(canvas.toBuffer()));
    }
    getPointFromPawn(pawnName){
        switch (pawnName){
            case "rpawn1":
                for (var player of this.players){
                    if (player.color = "red"){
                        if (!player.pawn1loc) {
                            return {x:383,y:442};
                        }
                    }
                }
                return {x:383,y:442};
            case "rpawn2":
                for (var player of this.players){
                    if (player.color = "red"){
                        if (!player.pawn2loc) {
                            return {x:410,y:442};
                        }
                    }
                }
                return {x:410,y:442};
            case "rpawn3":
                for (var player of this.players){
                    if (player.color = "red"){
                        if (!player.pawn3loc) {
                            return {x:383,y:472};
                        }
                    }
                }
                return {x:383,y:472};
            case "rpawn4":
                for (var player of this.players){
                    if (player.color = "red"){
                        if (!player.pawn4loc) {
                            return {x:410,y:472};
                        }
                    }
                }
                return {x:410,y:472};
            case "bpawn1":
                for (var player of this.players){
                    if (player.color = "blue"){
                        if (!player.pawn1loc) {
                            return {x:113,y:379};
                        }
                    }
                }
                return {x:113,y:379};
            case "bpawn2":
                for (var player of this.players){
                    if (player.color = "blue"){
                        if (!player.pawn2loc) {
                            return {x:142,y:379};
                        }
                    }
                }
                return {x:142,y:379};
            case "bpawn3":
                for (var player of this.players){
                    if (player.color = "blue"){
                        if (!player.pawn3loc) {
                            return {x:113,y:410};
                        }
                    }
                }
                return {x:113,y:410};
            case "bpawn4":
                for (var player of this.players){
                    if (player.color = "blue"){
                        if (!player.pawn4loc) {
                            return {x:142,y:410};
                        }
                    }
                }
                return {x:142,y:410};
        }
    }
    prepareTurns(){
        for (var player of this.players){
            this.turnList.push(player.color);
        }
        this.turnNum = Math.floor((Math.random() * this.players.length));
    }
    startTurn(){
        var player = this.getPlayerFromColor(this.turnList[this.turnNum]);
        player.player.send("It is your turn, <@"+player.id+">. Type `draw` to draw a card from the deck.");
        this.announce("It is "+player.username+" ("+player.color+")'s turn.", player);
    }
    drawCard(){
        var card = this.cardDeck.shift();
        var curPlayer = this.getPlayerFromColor(this.turnList[this.turnNum]);
        switch (card) {
            case "1":
                return this.announce(new Discord.Attachment("games/apology/images/card01.png"));
            case "2":
                return this.announce(new Discord.Attachment("games/apology/images/card02.png"));
            case "3":
                this.announce(new Discord.Attachment("games/apology/images/card03.png"));
                if (!curPlayer.pawn1loc && !curPlayer.pawn2loc && !curPlayer.pawn3loc && !curPlayer.pawn4loc){
                    curPlayer.player.send("Drat! You can't move!");
                    this.announce("Drat! "+curPlayer.username+" can't move!", curPlayer);
                }
            case "4":
                return this.announce(new Discord.Attachment("games/apology/images/card04.png"));
            case "5":
                return this.announce(new Discord.Attachment("games/apology/images/card05.png"));
            case "7":
                return this.announce(new Discord.Attachment("games/apology/images/card07.png"));
            case "8":
                return this.announce(new Discord.Attachment("games/apology/images/card08.png"));
            case "10":
                return this.announce(new Discord.Attachment("games/apology/images/card10.png"));
            case "11":
                this.announce(new Discord.Attachment("games/apology/images/card11.png"));
                var waitTill = new Date(new Date().getTime() + 3000);
                while(waitTill > new Date()){};
                if (!player.pawn1loc && !player.pawn2loc && !player.pawn3loc && !player.pawn4loc){
                    player.player.send("Drat! You can't move!");
                    this.announce("Drat! "+player.username+" can't move!", player);
                }
            case "12":
                return this.announce(new Discord.Attachment("games/apology/images/card12.png"));
            case "S":
                return this.announce(new Discord.Attachment("games/apology/images/cardapology.png"));
        }
    }
}

exports.Game = Game;