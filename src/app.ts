namespace MyGame {

    export class Global {
        // game
        static game: Phaser.Game;
        // game size
        static GAME_WIDTH: number = 1024;
        static GAME_HEIGHT: number = 640;
    }
}
// -------------------------------------------------------------------------
window.onload = function () {

    MyGame.Global.game = new MyGame.Game();
};