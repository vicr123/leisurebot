class Game {
    constructor(id) {
        this.id = id;
        this.started = false;
        this.players = [];
        this.cardDeck = [];
        this.boardTiles = ["YSTART",
                           "AY1",
                           "AY2",
                           "AY3",
                           "AY4",
                           "YSL21",
                           "YSL22",
                           "YSL23",
                           "YSL24",
                           "YSL25",
                           "AY5",
                           "AY6",
                           "RSL11",
                           "RHENT",
                           "RSL13",
                           "RSTART",
                           "AR1",
                           "AR2",
                           "AR3",
                           "AR4",
                           "RSL21",
                           "RSL22",
                           "RSL23",
                           "RSL24",
                           "RSL25",
                           "AR5",
                           "AR6",
                           "BSL11",
                           "BHENT",
                           "BSL13",
                           "BSTART",
                           "AB1",
                           "AB2",
                           "AB3",
                           "AB4",
                           "BSL21",
                           "BSL22",
                           "BSL23",
                           "BSL24",
                           "BSL25",
                           "AB5",
                           "AB6",
                           "GSL11",
                           "GHENT",
                           "GSL13",
                           "GSTART",
                           "AG1",
                           "AG2",
                           "AG3",
                           "AG4",
                           "GSL21",
                           "GSL22",
                           "GSL23",
                           "GSL24",
                           "GSL25",
                           "AG5",
                           "AG6",
                           "YSL11",
                           "YHENT",
                           "YSL13"];
    }
    getPlayer(userResolve) {
        var returnValue = null;
        if (parseInt(userResolve)) {
            returnValue = this.players[parseInt(userResolve)]
        } else {
            this.players.forEach(function(elem, index) {
                if (elem == userResolve) {
                    returnValue = this.players[index]
                }
            })
        }
        return returnValue
    }
    announce(message, ignorePlayer) {
        this.players.forEach(function(elem) {
            if (ignorePlayer) {
                if (ignorePlayer.ID != elem.ID) {
                    elem.player.send(message);
                }
            } else {
                elem.player.send(message);
            }
        })
    }
}

exports.Game = Game;