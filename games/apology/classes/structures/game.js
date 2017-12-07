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
        this.moveInProgress = "";
        this.moveStage = "";
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
        var pawns = ["rpawn1", "rpawn2", "rpawn3", "rpawn4", "bpawn1", "bpawn2", "bpawn3", "bpawn4", "gpawn1", "gpawn2", "gpawn3", "gpawn4", "ypawn1", "ypawn2", "ypawn3", "ypawn4"];
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
    getPointFromSpace(space){
        switch (space){
            case "YSTART": return {x:562,y:172};
            case "AY3": return {x:562,y:274};
            case "YSL21": return {x:562,y:344};
            case "AY6": return {x:562,y:562};
            case "RSTART": return {x:413,y:562};
            case "AR3": return {x:310,y:562};
            case "RSL21": return {x:242,y:562};
            case "AR6": return {x:22,y:562};
            case "BSTART": return {x:22,y:412};
            case "AB3": return {x:22,y:309};
            case "BSL21": return {x:22,y:242};
            case "AB6": return {x:22,y:22};
            case "GSTART": return {x:173,y:22};
            case "AG3": return {x:276,y:22};
            case "GSL21": return {x:344,y:22};
            case "AG6": return {x:562,y:22};
        }
    }
    getPointFromPawn(pawnName){
        switch (pawnName){
            case "rpawn1":
                for (var player of this.players){
                    if (player.color == "red"){
                        if (player.pawn1loc == "start") return {x:383,y:442};
                        else return this.getPointFromSpace(player.pawn1loc);
                    }
                }
                return {x:383,y:442};
            case "rpawn2":
                for (var player of this.players){
                    if (player.color == "red"){
                        if (player.pawn2loc == "start") {
                            return {x:410,y:442};
                        }
                    }
                }
                return {x:410,y:442};
            case "rpawn3":
                for (var player of this.players){
                    if (player.color == "red"){
                        if (player.pawn3loc == "start") {
                            return {x:383,y:472};
                        }
                    }
                }
                return {x:383,y:472};
            case "rpawn4":
                for (var player of this.players){
                    if (player.color == "red"){
                        if (player.pawn4loc == "start") {
                            return {x:410,y:472};
                        }
                    }
                }
                return {x:410,y:472};
            case "bpawn1":
                for (var player of this.players){
                    if (player.color == "blue"){
                        if (player.pawn1loc == "start") return {x:113,y:379};
                        else return this.getPointFromSpace(player.pawn1loc);
                    }
                }
                return {x:113,y:379};
            case "bpawn2":
                for (var player of this.players){
                    if (player.color == "blue"){
                        if (player.pawn2loc == "start") {
                            return {x:142,y:379};
                        }
                    }
                }
                return {x:142,y:379};
            case "bpawn3":
                for (var player of this.players){
                    if (player.color == "blue"){
                        if (player.pawn3loc == "start") {
                            return {x:113,y:410};
                        }
                    }
                }
                return {x:113,y:410};
            case "bpawn4":
                for (var player of this.players){
                    if (player.color == "blue"){
                        if (player.pawn4loc == "start") {
                            return {x:142,y:410};
                        }
                    }
                }
                return {x:142,y:410};
            case "gpawn1":
                for (var player of this.players){
                    if (player.color == "green"){
                        if (player.pawn1loc == "start") return {x:173,y:114};
                        else return this.getPointFromSpace(player.pawn1loc);
                    }
                }
                return {x:173,y:114};
            case "gpawn2":
                for (var player of this.players){
                    if (player.color == "green"){
                        if (player.pawn2loc == "start") {
                            return {x:204,y:114};
                        }
                    }
                }
                return {x:204,y:114};
            case "gpawn3":
                for (var player of this.players){
                    if (player.color == "green"){
                        if (player.pawn3loc == "start") {
                            return {x:173,y:140};
                        }
                    }
                }
                return {x:173,y:140};
            case "gpawn4":
                for (var player of this.players){
                    if (player.color == "green"){
                        if (player.pawn4loc == "start") {
                            return {x:204,y:140};
                        }
                    }
                }
                return {x:204,y:140};
            case "ypawn1":
                for (var player of this.players){
                    if (player.color == "yellow"){
                        if (player.pawn1loc == "start") return {x:451,y:172};
                        else return this.getPointFromSpace(player.pawn1loc);
                    }
                }
                return {x:451,y:172};
            case "ypawn2":
                for (var player of this.players){
                    if (player.color == "yellow"){
                        if (player.pawn2loc == "start") {
                            return {x:479,y:172};
                        }
                    }
                }
                return {x:479,y:172};
            case "ypawn3":
                for (var player of this.players){
                    if (player.color == "yellow"){
                        if (player.pawn3loc == "start") {
                            return {x:451,y:203};
                        }
                    }
                }
                return {x:451,y:203};
            case "ypawn4":
                for (var player of this.players){
                    if (player.color == "yellow"){
                        if (player.pawn4loc == "start") {
                            return {x:479,y:203};
                        }
                    }
                }
                return {x:479,y:203};
        }
    }
    rigDeck(deck){
        this.cardDeck = deck;
    }
    prepareTurns(){
        for (var player of this.players){
            this.turnList.push(player.color);
        }
        this.turnNum = Math.floor(Math.random() * this.players.length);
    }
    startTurn(){
        if (this.cardDeck.length == 0) this.newDeck();
        var player = this.getPlayerFromColor(this.turnList[this.turnNum]);
        player.player.send("It is your turn, <@"+player.id+">. Type `draw` to draw a card from the deck.");
        this.announce("It is "+player.username+" ("+player.color+")'s turn.", player);
        this.drawEnabled = true;
    }
    advanceTurn(){
        if (this.turnNum + 1 == this.turnList.length) this.turnNum = 0;
        else this.turnNum++;
        this.startTurn();
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
            case "rpawn1": rP.pawn1loc = destination; return;
            case "rpawn2": rP.pawn2loc = destination; return;
            case "rpawn3": rP.pawn3loc = destination; return;
            case "rpawn4": rP.pawn4loc = destination; return;
            case "bpawn1": if (bP) bP.pawn1loc = destination; return;
            case "bpawn2": if (bP) bP.pawn2loc = destination; return;
            case "bpawn3": if (bP) bP.pawn3loc = destination; return;
            case "bpawn4": if (bP) bP.pawn4loc = destination; return;
            case "gpawn1": if (gP) gP.pawn1loc = destination; return;
            case "gpawn2": if (gP) gP.pawn2loc = destination; return;
            case "gpawn3": if (gP) gP.pawn3loc = destination; return;
            case "gpawn4": if (gP) gP.pawn4loc = destination; return;
            case "ypawn1": if (yP) yP.pawn1loc = destination; return;
            case "ypawn2": if (yP) yP.pawn2loc = destination; return;
            case "ypawn3": if (yP) yP.pawn3loc = destination; return;
            case "ypawn4": if (yP) yP.pawn4loc = destination; return;
        }
    }
    getDestination(startSpace, howFar, color){
        switch (startSpace){
            case "RSTART":
                switch (howFar) {
                    case -4: return "AY6";
                    case 3: return "AR3";
                    case 5: return "RSL21";
                }
                return "nope";
            case "BSTART":
                switch (howFar) {
                    case -4: return "AR6";
                    case 3: return "AB3";
                    case 5: return "BSL21";
                }
                return "nope";
            case "GSTART":
                switch (howFar) {
                    case -4: return "AB6";
                    case 3: return "AG3";
                    case 5: return "GSL21"
                }
                return "nope";
            case "YSTART":
                switch (howFar) {
                    case -4: return "AG6";
                    case 3: return "AY3";
                    case 5: return "YSL21";
                }
                return "nope";
        }
    }
    drawCard(){
        var card = this.cardDeck.shift();
        var curPlayer = this.getPlayerFromColor(this.turnList[this.turnNum]);
        console.log("Apology | #"+this.id+" "+curPlayer.username+" ("+curPlayer.color+") is drawing a card.");
        switch (card) {
            case "1":
                this.announce(new Discord.Attachment("games/apology/images/card01.png"));
                if (curPlayer.pawn1loc == "start" && curPlayer.pawn2loc == "start" && curPlayer.pawn3loc == "start" && curPlayer.pawn4loc == "start"){
                    switch (curPlayer.color) {
                        case "red": this.movePawn(curPlayer, "rpawn1", "RSTART"); break;
                        case "blue": this.movePawn(curPlayer, "bpawn1", "BSTART"); break;
                        case "green": this.movePawn(curPlayer, "gpawn1", "GSTART"); break;
                        case "yellow": this.movePawn(curPlayer, "ypawn1", "YSTART"); break;
                    }
                    this.showBoard();
                    curPlayer.player.send("Your first pawn is out of start.");
                    this.announce(curPlayer.username+"'s first pawn is out of start.", curPlayer);
                    curPlayer.pawnsOut++;
                    setTimeout(this.advanceTurn.bind(this), 4500);
                    return;
                }
                switch (curPlayer.color){
                    case "red":
                        if (curPlayer.pawn1loc != "RSTART" && curPlayer.pawn2loc != "RSTART" && curPlayer.pawn3loc != "RSTART" && curPlayer.pawn4loc != "RSTART"){
                            curPlayer.player.send("What would you like to do? Answer `A` or `B`.");
                            this.moveInProgress = "1";
                            this.moveStage = "letter";
                            return;
                        }
                    case "blue":
                        if (curPlayer.pawn1loc != "BSTART" && curPlayer.pawn2loc != "BSTART" && curPlayer.pawn3loc != "BSTART" && curPlayer.pawn4loc != "BSTART"){
                            curPlayer.player.send("What would you like to do? Answer `A` or `B`.");
                            this.moveInProgress = "1";
                            this.moveStage = "letter";
                            return;
                        }
                    case "green":
                        if (curPlayer.pawn1loc != "GSTART" && curPlayer.pawn2loc != "GSTART" && curPlayer.pawn3loc != "GSTART" && curPlayer.pawn4loc != "GSTART"){
                            curPlayer.player.send("What would you like to do? Answer `A` or `B`.");
                            this.moveInProgress = "1";
                            this.moveStage = "letter";
                            return;
                        }
                    case "yellow":
                        if (curPlayer.pawn1loc != "YSTART" && curPlayer.pawn2loc != "YSTART" && curPlayer.pawn3loc != "YSTART" && curPlayer.pawn4loc != "YSTART"){
                            curPlayer.player.send("What would you like to do? Answer `A` or `B`.");
                            this.moveInProgress = "1";
                            this.moveStage = "letter";
                            return;
                        }
                }
                return;
            case "2":
                this.announce(new Discord.Attachment("games/apology/images/card02.png"));
                if (curPlayer.pawn1loc == "start" && curPlayer.pawn2loc == "start" && curPlayer.pawn3loc == "start" && curPlayer.pawn4loc == "start"){
                    switch (curPlayer.color) {
                        case "red": this.movePawn(curPlayer, "rpawn1", "RSTART"); break;
                        case "blue": this.movePawn(curPlayer, "bpawn1", "BSTART"); break;
                        case "green": this.movePawn(curPlayer, "gpawn1", "GSTART"); break;
                        case "yellow": this.movePawn(curPlayer, "ypawn1", "YSTART"); break;
                    }
                    this.showBoard();
                    curPlayer.player.send("Your first pawn is out of start, and you also get another turn!");
                    this.announce(curPlayer.username+"'s first pawn is out of start.", curPlayer);
                    curPlayer.pawnsOut++;
                    setTimeout(this.startTurn.bind(this), 4500);
                    return;
                }
                return;
            case "3":
                this.announce(new Discord.Attachment("games/apology/images/card03.png"));
                if (curPlayer.pawn1loc == "start" && curPlayer.pawn2loc == "start" && curPlayer.pawn3loc == "start" && curPlayer.pawn4loc == "start"){
                    curPlayer.player.send("Drat! You can't move!");
                    this.announce("Drat! "+curPlayer.username+" can't move!", curPlayer);
                    setTimeout(this.advanceTurn.bind(this), 4500);
                    return;
                }
                if (curPlayer.pawnsOut == 1) {
                    switch (curPlayer.color) {
                        case "red": 
                            if (curPlayer.pawn1loc != "start") {
                                var newLoc = this.getDestination(curPlayer.pawn1loc, 3, "red");
                                if (newLoc != "nope") { 
                                    this.movePawn(curPlayer, "rpawn1", newLoc);
                                    this.showBoard();
                                    curPlayer.player.send("Your first pawn has moved 3 spaces forward.");
                                    this.announce(""+curPlayer.username+"'s first pawn has moved 3 spaces forward.", curPlayer);
                                    setTimeout(this.advanceTurn.bind(this), 4500);
                                    return;
                                } else {
                                    curPlayer.player.send("Drat! You can't move!");
                                    this.announce("Drat! "+curPlayer.username+" can't move!", curPlayer);
                                    setTimeout(this.advanceTurn.bind(this), 4500);
                                    return;
                                }
                            }
                        case "blue": 
                            if (curPlayer.pawn1loc != "start") {
                                var newLoc = this.getDestination(curPlayer.pawn1loc, 3, "blue");
                                if (newLoc != "nope") {
                                    this.movePawn(curPlayer, "bpawn1", newLoc);
                                    this.showBoard();
                                    curPlayer.player.send("Your first pawn has moved 3 spaces forward.");
                                    this.announce(""+curPlayer.username+"'s first pawn has moved 3 spaces forward.", curPlayer);
                                    setTimeout(this.advanceTurn.bind(this), 4500);
                                    return;
                                } else {
                                    curPlayer.player.send("Drat! You can't move!");
                                    this.announce("Drat! "+curPlayer.username+" can't move!", curPlayer);
                                    setTimeout(this.advanceTurn.bind(this), 4500);
                                    return;
                                }
                            }
                        case "green": 
                            if (curPlayer.pawn1loc != "start") {
                                var newLoc = this.getDestination(curPlayer.pawn1loc, 3, "green");
                                if (newLoc != "nope") {
                                    this.movePawn(curPlayer, "gpawn1", newLoc);
                                    this.showBoard();
                                    curPlayer.player.send("Your first pawn has moved 3 spaces forward.");
                                    this.announce(""+curPlayer.username+"'s first pawn has moved 3 spaces forward.", curPlayer);
                                    setTimeout(this.advanceTurn.bind(this), 4500);
                                    return;
                                } else {
                                    curPlayer.player.send("Drat! You can't move!");
                                    this.announce("Drat! "+curPlayer.username+" can't move!", curPlayer);
                                    setTimeout(this.advanceTurn.bind(this), 4500);
                                    return;
                                }
                            }
                        case "yellow": 
                            if (curPlayer.pawn1loc != "start") {
                                var newLoc = this.getDestination(curPlayer.pawn1loc, 3, "yellow");
                                if (newLoc != "nope") {
                                    this.movePawn(curPlayer, "ypawn1", newLoc);
                                    this.showBoard();
                                    curPlayer.player.send("Your first pawn has moved 3 spaces forward.");
                                    this.announce(""+curPlayer.username+"'s first pawn has moved 3 spaces forward.", curPlayer);
                                    setTimeout(this.advanceTurn.bind(this), 4500);
                                    return;
                                } else {
                                    curPlayer.player.send("Drat! You can't move!");
                                    this.announce("Drat! "+curPlayer.username+" can't move!", curPlayer);
                                    setTimeout(this.advanceTurn.bind(this), 4500);
                                    return;
                                }
                            }
                    }
                }
                return;
            case "4":
                this.announce(new Discord.Attachment("games/apology/images/card04.png"));
                if (curPlayer.pawn1loc == "start" && curPlayer.pawn2loc == "start" && curPlayer.pawn3loc == "start" && curPlayer.pawn4loc == "start"){
                    curPlayer.player.send("Drat! You can't move!");
                    this.announce("Drat! "+curPlayer.username+" can't move!", curPlayer);
                    setTimeout(this.advanceTurn.bind(this), 4500);
                    return;
                }
                if (curPlayer.pawnsOut == 1) {
                    switch (curPlayer.color) {
                        case "red": 
                            if (curPlayer.pawn1loc != "start") {
                                var newLoc = this.getDestination(curPlayer.pawn1loc, -4, "red");
                                if (newLoc != "nope") { 
                                    this.movePawn(curPlayer, "rpawn1", newLoc);
                                    this.showBoard();
                                    curPlayer.player.send("Your first pawn has moved 4 spaces backward.");
                                    this.announce(""+curPlayer.username+"'s first pawn has moved 4 spaces backward.", curPlayer);
                                    setTimeout(this.advanceTurn.bind(this), 4500);
                                    return;
                                } else {
                                    curPlayer.player.send("Drat! You can't move!");
                                    this.announce("Drat! "+curPlayer.username+" can't move!", curPlayer);
                                    setTimeout(this.advanceTurn.bind(this), 4500);
                                    return;
                                }
                            }
                        case "blue": 
                            if (curPlayer.pawn1loc != "start") {
                                var newLoc = this.getDestination(curPlayer.pawn1loc, -4, "blue");
                                if (newLoc != "nope") {
                                    this.movePawn(curPlayer, "bpawn1", newLoc);
                                    this.showBoard();
                                    curPlayer.player.send("Your first pawn has moved 4 spaces backward.");
                                    this.announce(""+curPlayer.username+"'s first pawn has moved 4 spaces backward.", curPlayer);
                                    setTimeout(this.advanceTurn.bind(this), 4500);
                                    return;
                                } else {
                                    curPlayer.player.send("Drat! You can't move!");
                                    this.announce("Drat! "+curPlayer.username+" can't move!", curPlayer);
                                    setTimeout(this.advanceTurn.bind(this), 4500);
                                    return;
                                }
                            }
                        case "green": 
                            if (curPlayer.pawn1loc != "start") {
                                var newLoc = this.getDestination(curPlayer.pawn1loc, -4, "green");
                                if (newLoc != "nope") {
                                    this.movePawn(curPlayer, "gpawn1", newLoc);
                                    this.showBoard();
                                    curPlayer.player.send("Your first pawn has moved 4 spaces backward.");
                                    this.announce(""+curPlayer.username+"'s first pawn has moved 4 spaces backward.", curPlayer);
                                    setTimeout(this.advanceTurn.bind(this), 4500);
                                    return;
                                } else {
                                    curPlayer.player.send("Drat! You can't move!");
                                    this.announce("Drat! "+curPlayer.username+" can't move!", curPlayer);
                                    setTimeout(this.advanceTurn.bind(this), 4500);
                                    return;
                                }
                            }
                        case "yellow": 
                            if (curPlayer.pawn1loc != "start") {
                                var newLoc = this.getDestination(curPlayer.pawn1loc, -4, "yellow");
                                if (newLoc != "nope") {
                                    this.movePawn(curPlayer, "ypawn1", newLoc);
                                    this.showBoard();
                                    curPlayer.player.send("Your first pawn has moved 4 spaces backward.");
                                    this.announce(""+curPlayer.username+"'s first pawn has moved 4 spaces backward.", curPlayer);
                                    setTimeout(this.advanceTurn.bind(this), 4500);
                                    return;
                                } else {
                                    curPlayer.player.send("Drat! You can't move!");
                                    this.announce("Drat! "+curPlayer.username+" can't move!", curPlayer);
                                    setTimeout(this.advanceTurn.bind(this), 4500);
                                    return;
                                }
                            }
                    }
                }
                return;
            case "5":
                this.announce(new Discord.Attachment("games/apology/images/card05.png"));
                if (curPlayer.pawn1loc == "start" && curPlayer.pawn2loc == "start" && curPlayer.pawn3loc == "start" && curPlayer.pawn4loc == "start"){
                    curPlayer.player.send("Drat! You can't move!");
                    this.announce("Drat! "+curPlayer.username+" can't move!", curPlayer);
                    setTimeout(this.advanceTurn.bind(this), 4500);
                    return;
                }
                if (curPlayer.pawnsOut == 1) {
                    switch (curPlayer.color) {
                        case "red": 
                            if (curPlayer.pawn1loc != "start") {
                                var newLoc = this.getDestination(curPlayer.pawn1loc, 5, "red");
                                if (newLoc != "nope") { 
                                    this.movePawn(curPlayer, "rpawn1", newLoc);
                                    this.showBoard();
                                    curPlayer.player.send("Your first pawn has moved 5 spaces forward.");
                                    this.announce(""+curPlayer.username+"'s first pawn has moved 5 spaces forward.", curPlayer);
                                    setTimeout(this.advanceTurn.bind(this), 4500);
                                    return;
                                } else {
                                    curPlayer.player.send("Drat! You can't move!");
                                    this.announce("Drat! "+curPlayer.username+" can't move!", curPlayer);
                                    setTimeout(this.advanceTurn.bind(this), 4500);
                                    return;
                                }
                            }
                        case "blue": 
                            if (curPlayer.pawn1loc != "start") {
                                var newLoc = this.getDestination(curPlayer.pawn1loc, 5, "blue");
                                if (newLoc != "nope") {
                                    this.movePawn(curPlayer, "bpawn1", newLoc);
                                    this.showBoard();
                                    curPlayer.player.send("Your first pawn has moved 5 spaces forward.");
                                    this.announce(""+curPlayer.username+"'s first pawn has moved 5 spaces forward.", curPlayer);
                                    setTimeout(this.advanceTurn.bind(this), 4500);
                                    return;
                                } else {
                                    curPlayer.player.send("Drat! You can't move!");
                                    this.announce("Drat! "+curPlayer.username+" can't move!", curPlayer);
                                    setTimeout(this.advanceTurn.bind(this), 4500);
                                    return;
                                }
                            }
                        case "green": 
                            if (curPlayer.pawn1loc != "start") {
                                var newLoc = this.getDestination(curPlayer.pawn1loc, 5, "green");
                                if (newLoc != "nope") {
                                    this.movePawn(curPlayer, "gpawn1", newLoc);
                                    this.showBoard();
                                    curPlayer.player.send("Your first pawn has moved 5 spaces forward.");
                                    this.announce(""+curPlayer.username+"'s first pawn has moved 5 spaces forward.", curPlayer);
                                    setTimeout(this.advanceTurn.bind(this), 4500);
                                    return;
                                } else {
                                    curPlayer.player.send("Drat! You can't move!");
                                    this.announce("Drat! "+curPlayer.username+" can't move!", curPlayer);
                                    setTimeout(this.advanceTurn.bind(this), 4500);
                                    return;
                                }
                            }
                        case "yellow": 
                            if (curPlayer.pawn1loc != "start") {
                                var newLoc = this.getDestination(curPlayer.pawn1loc, 5, "yellow");
                                if (newLoc != "nope") {
                                    this.movePawn(curPlayer, "ypawn1", newLoc);
                                    this.showBoard();
                                    curPlayer.player.send("Your first pawn has moved 5 spaces forward.");
                                    this.announce(""+curPlayer.username+"'s first pawn has moved 5 spaces forward.", curPlayer);
                                    setTimeout(this.advanceTurn.bind(this), 4500);
                                    return;
                                } else {
                                    curPlayer.player.send("Drat! You can't move!");
                                    this.announce("Drat! "+curPlayer.username+" can't move!", curPlayer);
                                    setTimeout(this.advanceTurn.bind(this), 4500);
                                    return;
                                }
                            }
                    }
                }
                return;
            case "7":
                this.announce(new Discord.Attachment("games/apology/images/card07.png"));
                if (curPlayer.pawn1loc == "start" && curPlayer.pawn2loc == "start" && curPlayer.pawn3loc == "start" && curPlayer.pawn4loc == "start"){
                    curPlayer.player.send("Drat! You can't move!");
                    this.announce("Drat! "+curPlayer.username+" can't move!", curPlayer);
                    setTimeout(this.advanceTurn.bind(this), 4500);
                    return;
                }
                return;
            case "8":
                this.announce(new Discord.Attachment("games/apology/images/card08.png"));
                if (curPlayer.pawn1loc == "start" && curPlayer.pawn2loc == "start" && curPlayer.pawn3loc == "start" && curPlayer.pawn4loc == "start"){
                    curPlayer.player.send("Drat! You can't move!");
                    this.announce("Drat! "+curPlayer.username+" can't move!", curPlayer);
                    setTimeout(this.advanceTurn.bind(this), 4500);
                    return;
                }
                return;
            case "10":
                this.announce(new Discord.Attachment("games/apology/images/card10.png"));
                if (curPlayer.pawn1loc == "start" && curPlayer.pawn2loc == "start" && curPlayer.pawn3loc == "start" && curPlayer.pawn4loc == "start"){
                    curPlayer.player.send("Drat! You can't move!");
                    this.announce("Drat! "+curPlayer.username+" can't move!", curPlayer);
                    setTimeout(this.advanceTurn.bind(this), 4500);
                    return;
                }
                return;
            case "11":
                this.announce(new Discord.Attachment("games/apology/images/card11.png"));
                if (curPlayer.pawn1loc == "start" && curPlayer.pawn2loc == "start" && curPlayer.pawn3loc == "start" && curPlayer.pawn4loc == "start"){
                    curPlayer.player.send("Drat! You can't move!");
                    this.announce("Drat! "+curPlayer.username+" can't move!", curPlayer);
                    setTimeout(this.advanceTurn.bind(this), 4500);
                    return;
                }
                return;
            case "12":
                this.announce(new Discord.Attachment("games/apology/images/card12.png"));
                if (curPlayer.pawn1loc == "start" && curPlayer.pawn2loc == "start" && curPlayer.pawn3loc == "start" && curPlayer.pawn4loc == "start"){
                    curPlayer.player.send("Drat! You can't move!");
                    this.announce("Drat! "+curPlayer.username+" can't move!", curPlayer);
                    setTimeout(this.advanceTurn.bind(this), 4500);
                    return;
                }
                return;
            case "S":
                return this.announce(new Discord.Attachment("games/apology/images/cardapology.png"));
            default:
                throw new Error("Someone snuck a Joker or something into the deck!");
        }
        //this.drawEnabled = false;
    }
    cardChoice(choice) {
        var curPlayer = this.getPlayerFromColor(this.turnList[this.turnNum]);
        switch (this.moveInProgress) {
            case 1:
                if (choice == "A"){
                    if (curPlayer.pawn1loc == "start") {
                        switch (curPlayer.color) {
                            case "red": this.movePawn(curPlayer, "rpawn1", "RSTART"); break;
                            case "blue": this.movePawn(curPlayer, "bpawn1", "BSTART"); break;
                            case "green": this.movePawn(curPlayer, "gpawn1", "GSTART"); break;
                            case "yellow": this.movePawn(curPlayer, "ypawn1", "YSTART"); break;
                        }
                        this.showBoard();
                        curPlayer.player.send("Your first pawn is out of start.");
                        this.announce(curPlayer.username+"'s first pawn is out of start.", curPlayer);
                        curPlayer.pawnsOut++;
                        setTimeout(this.startTurn.bind(this), 4500);
                        return;
                    } else if (curPlayer.pawn2loc == "start") {
                        switch (curPlayer.color) {
                            case "red": this.movePawn(curPlayer, "rpawn2", "RSTART"); break;
                            case "blue": this.movePawn(curPlayer, "bpawn2", "BSTART"); break;
                            case "green": this.movePawn(curPlayer, "gpawn2", "GSTART"); break;
                            case "yellow": this.movePawn(curPlayer, "ypawn2", "YSTART"); break;
                        }
                        this.showBoard();
                        curPlayer.player.send("Your second pawn is out of start.");
                        this.announce(curPlayer.username+"'s second pawn is out of start.", curPlayer);
                        curPlayer.pawnsOut++;
                        setTimeout(this.startTurn.bind(this), 4500);
                        return;
                    } else if (curPlayer.pawn3loc == "start") {
                        switch (curPlayer.color) {
                            case "red": this.movePawn(curPlayer, "rpawn3", "RSTART"); break;
                            case "blue": this.movePawn(curPlayer, "bpawn3", "BSTART"); break;
                            case "green": this.movePawn(curPlayer, "gpawn3", "GSTART"); break;
                            case "yellow": this.movePawn(curPlayer, "ypawn3", "YSTART"); break;
                        }
                        this.showBoard();
                        curPlayer.player.send("Your third pawn is out of start.");
                        this.announce(curPlayer.username+"'s third pawn is out of start.", curPlayer);
                        curPlayer.pawnsOut++;
                        setTimeout(this.startTurn.bind(this), 4500);
                        return;
                    } else if (curPlayer.pawn4loc == "start") {
                        switch (curPlayer.color) {
                            case "red": this.movePawn(curPlayer, "rpawn4", "RSTART"); break;
                            case "blue": this.movePawn(curPlayer, "bpawn4", "BSTART"); break;
                            case "green": this.movePawn(curPlayer, "gpawn4", "GSTART"); break;
                            case "yellow": this.movePawn(curPlayer, "ypawn4", "YSTART"); break;
                        }
                        this.showBoard();
                        curPlayer.player.send("Your fourth pawn is out of start.");
                        this.announce(curPlayer.username+"'s fourth pawn is out of start.", curPlayer);
                        curPlayer.pawnsOut++;
                        setTimeout(this.startTurn.bind(this), 4500);
                        return;
                    } 
                } else if (choice == "B") {

                }
        }
    }
}

exports.Game = Game;