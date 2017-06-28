namespace GoblinRun;

(function (GoblinRun) {

    var Global = (function () {

        function Global() {

        }

        return Global;
    }());
    // game size
    Global.GAME_WIDTH = 1024;
    Global.GAME_HEIGHT = 640;
    GoblinRun.Global = Global;
})(GoblinRun || (GoblinRun = {}));
// -------------------------------------------------------------------------

window.onload = function () {
    GoblinRun.Global.game = new GoblinRun.game();
};
