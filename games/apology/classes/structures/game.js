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
        this.drawEnabled = false;
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
                    if (player.color == "red"){
                        if (!player.pawn1loc) {
                            return {x:383,y:442};
                        }
                    }
                }
                return {x:383,y:442};
            case "rpawn2":
                for (var player of this.players){
                    if (player.color == "red"){
                        if (!player.pawn2loc) {
                            return {x:410,y:442};
                        }
                    }
                }
                return {x:410,y:442};
            case "rpawn3":
                for (var player of this.players){
                    if (player.color == "red"){
                        if (!player.pawn3loc) {
                            return {x:383,y:472};
                        }
                    }
                }
                return {x:383,y:472};
            case "rpawn4":
                for (var player of this.players){
                    if (player.color == "red"){
                        if (!player.pawn4loc) {
                            return {x:410,y:472};
                        }
                    }
                }
                return {x:410,y:472};
            case "bpawn1":
                for (var player of this.players){
                    if (player.color == "blue"){
                        if (!player.pawn1loc) {
                            return {x:113,y:379};
                        }
                    }
                }
                return {x:113,y:379};
            case "bpawn2":
                for (var player of this.players){
                    if (player.color == "blue"){
                        if (!player.pawn2loc) {
                            return {x:142,y:379};
                        }
                    }
                }
                return {x:142,y:379};
            case "bpawn3":
                for (var player of this.players){
                    if (player.color == "blue"){
                        if (!player.pawn3loc) {
                            return {x:113,y:410};
                        }
                    }
                }
                return {x:113,y:410};
            case "bpawn4":
                for (var player of this.players){
                    if (player.color == "blue"){
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
        this.turnNum = Math.floor(Math.random() * this.players.length);
    }
    startTurn(){
        var player = this.getPlayerFromColor(this.turnList[this.turnNum]);
        player.player.send("It is your turn, <@"+player.id+">. Type `draw` to draw a card from the deck.");
        this.announce("It is "+player.username+" ("+player.color+")'s turn.", player);
        this.drawEnabled = true;
    }
    advanceTurn(){
        if (this.turnNum + 1 > this.turnList.length) this.turnNum = 0;
        else this.turnNum++;
        startTurn();
    }
    movePawn(curPlayer, pawn, destination){
        for (var player of this.players) {
            if (player.pawn1loc == destination) {
                this.announce(player.username+"'s pawn has been bumped back to start!", player);
                player.player.send("I apologize, but your pawn has been bumped back to start.");
                player.pawn1loc = null;
            } else if (player.pawn2loc == destination) {
                this.announce(player.username+"'s pawn has been bumped back to start!", player);
                player.player.send("I apologize, but your pawn has been bumped back to start.");
                player.pawn2loc = null;
            } else if (player.pawn3loc == destination) {
                this.announce(player.username+"'s pawn has been bumped back to start!", player);
                player.player.send("I apologize, but your pawn has been bumped back to start.");
                player.pawn3loc = null;
            } else if (player.pawn4loc == destination) {
                this.announce(player.username+"'s pawn has been bumped back to start!", player);
                player.player.send("I apologize, but your pawn has been bumped back to start.");
                player.pawn4loc = null;
            }
        }

        var rP = this.getPlayerFromColor("red");
        var bP = this.getPlayerFromColor("blue");
        var gP = this.getPlayerFromColor("green");
        var yP = this.getPlayerFromColor("yellow");

        switch (pawn){
            case "rpawn1": rP.pawn1loc = destination;
            case "rpawn2": rP.pawn2loc = destination;
            case "rpawn3": rP.pawn3loc = destination;
            case "rpawn4": rP.pawn4loc = destination;
            case "bpawn1": if (bP) bP.pawn1loc = destination;
            case "bpawn2": if (bP) bP.pawn2loc = destination;
            case "bpawn3": if (bP) bP.pawn3loc = destination;
            case "bpawn4": if (bP) bP.pawn4loc = destination;
            case "gpawn1": if (gP) gP.pawn1loc = destination;
            case "gpawn2": if (gP) gP.pawn2loc = destination;
            case "gpawn3": if (gP) gP.pawn3loc = destination;
            case "gpawn4": if (gP) gP.pawn4loc = destination;
            case "ypawn1": if (yP) yP.pawn1loc = destination;
            case "ypawn2": if (yP) yP.pawn2loc = destination;
            case "ypawn3": if (yP) yP.pawn3loc = destination;
            case "ypawn4": if (yP) yP.pawn4loc = destination;
        }
    }
    drawCard(){
        var card = this.cardDeck.shift();
        var curPlayer = this.getPlayerFromColor(this.turnList[this.turnNum]);
        switch (card) {
            case "1":
                this.announce(new Discord.Attachment("games/apology/images/card01.png"));
                if (!curPlayer.pawn1loc && !curPlayer.pawn2loc && !curPlayer.pawn3loc && !curPlayer.pawn4loc){
                    switch (curPlayer.color) {
                        case "red": this.movePawn(curPlayer, "rpawn1", "RSTART");
                        case "blue": this.movePawn(curPlayer, "bpawn1", "BSTART");
                        case "green": this.movePawn(curPlayer, "gpawn1", "GSTART");
                        case "yellow": this.movePawn(curPlayer, "ypawn1", "YSTART");
                    }
                    this.showBoard();
                    curPlayer.player.send("Your first pawn is out of start.");
                    this.announce(curPlayer.username+"'s first pawn is out of start.", curPlayer);
                    setInterval(this.advanceTurn(), 4500);
                    return;
                }
            case "2":
                return this.announce(new Discord.Attachment("games/apology/images/card02.png"));
            case "3":
                this.announce(new Discord.Attachment("games/apology/images/card03.png"));
                if (!curPlayer.pawn1loc && !curPlayer.pawn2loc && !curPlayer.pawn3loc && !curPlayer.pawn4loc){
                    curPlayer.player.send("Drat! You can't move!");
                    this.announce("Drat! "+curPlayer.username+" can't move!", curPlayer);
                    setInterval(this.advanceTurn(), 4500);
                    return;
                }
            case "4":
                this.announce(new Discord.Attachment("games/apology/images/card04.png"));
                if (!curPlayer.pawn1loc && !curPlayer.pawn2loc && !curPlayer.pawn3loc && !curPlayer.pawn4loc){
                    curPlayer.player.send("Drat! You can't move!");
                    this.announce("Drat! "+curPlayer.username+" can't move!", curPlayer);
                    setInterval(this.advanceTurn(), 4500);
                    return;
                }
            case "5":
                this.announce(new Discord.Attachment("games/apology/images/card05.png"));
                if (!curPlayer.pawn1loc && !curPlayer.pawn2loc && !curPlayer.pawn3loc && !curPlayer.pawn4loc){
                    curPlayer.player.send("Drat! You can't move!");
                    this.announce("Drat! "+curPlayer.username+" can't move!", curPlayer);
                    setInterval(this.advanceTurn(), 4500);
                    return;
                }
            case "7":
                this.announce(new Discord.Attachment("games/apology/images/card07.png"));
                if (!curPlayer.pawn1loc && !curPlayer.pawn2loc && !curPlayer.pawn3loc && !curPlayer.pawn4loc){
                    curPlayer.player.send("Drat! You can't move!");
                    this.announce("Drat! "+curPlayer.username+" can't move!", curPlayer);
                    setInterval(this.advanceTurn(), 4500);
                    return;
                }
            case "8":
                this.announce(new Discord.Attachment("games/apology/images/card08.png"));
                if (!curPlayer.pawn1loc && !curPlayer.pawn2loc && !curPlayer.pawn3loc && !curPlayer.pawn4loc){
                    curPlayer.player.send("Drat! You can't move!");
                    this.announce("Drat! "+curPlayer.username+" can't move!", curPlayer);
                    setInterval(this.advanceTurn(), 4500);
                    return;
                }
            case "10":
                this.announce(new Discord.Attachment("games/apology/images/card10.png"));
                if (!curPlayer.pawn1loc && !curPlayer.pawn2loc && !curPlayer.pawn3loc && !curPlayer.pawn4loc){
                    curPlayer.player.send("Drat! You can't move!");
                    this.announce("Drat! "+curPlayer.username+" can't move!", curPlayer);
                    setInterval(this.advanceTurn(), 4500);
                    return;
                }
            case "11":
                this.announce(new Discord.Attachment("games/apology/images/card11.png"));
                if (!curPlayer.pawn1loc && !curPlayer.pawn2loc && !curPlayer.pawn3loc && !curPlayer.pawn4loc){
                    curPlayer.player.send("Drat! You can't move!");
                    this.announce("Drat! "+curPlayer.username+" can't move!", curPlayer);
                    setInterval(this.advanceTurn(), 4500);
                    return;
                }
            case "12":
                this.announce(new Discord.Attachment("games/apology/images/card12.png"));
                if (!curPlayer.pawn1loc && !curPlayer.pawn2loc && !curPlayer.pawn3loc && !curPlayer.pawn4loc){
                    curPlayer.player.send("Drat! You can't move!");
                    this.announce("Drat! "+curPlayer.username+" can't move!", curPlayer);
                    setInterval(this.advanceTurn(), 4500);
                    return;
                }
            case "S":
                this.announce(new Discord.Attachment("games/apology/images/cardapology.png"));
        }
        //this.drawEnabled = false;
    }
}

exports.Game = Game;