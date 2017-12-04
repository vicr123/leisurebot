class Player {
    constructor (user, game) {
        this.player = user;
        this.id = user.id;
        this.username = user.username;
        this.Game = game;
        this.color = "";
        this.pawn1loc = "";
        this.pawn2loc = "";
        this.pawn3loc = "";
        this.pawn4loc = "";
    }
}
exports.Player = Player;