class Player {
    /**
     * Creates a new game player object.
     * @param {any} user 
     * @param {Game} game 
     * @class
     */
    constructor (user, game) {
        this.player = user;
        this.id = user.id;
        this.username = user.username;
        this.Game = game;
        this.color = "";
        this.pawn1loc = "start";
        this.pawn2loc = "start";
        this.pawn3loc = "start";
        this.pawn4loc = "start";
        this.pawnsOut = 0;
    }
}
exports.Player = Player;