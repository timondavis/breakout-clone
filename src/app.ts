namespace Breakout {

    export class Global {
        // game
        static game: Phaser.Game;
        // game size
        static GAME_WIDTH: number = 1024;
        static GAME_HEIGHT: number = 768;
    }
}
// -------------------------------------------------------------------------
window.onload = function () {

    Breakout.Global.game = new Breakout.Game();
};