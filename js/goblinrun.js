var GoblinRun;
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
    GoblinRun.Global.game = new GoblinRun.Game();
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Created by tdavis6782 on 6/28/17.
 */
var GoblinRun;
(function (GoblinRun) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            var _this = 
            // init game
            _super.call(this, GoblinRun.Global.GAME_WIDTH, GoblinRun.Global.GAME_HEIGHT, Phaser.AUTO, "content") || this;
            // states
            _this.state.add("Boot", GoblinRun.Boot);
            _this.state.add("Preload", GoblinRun.Preload);
            _this.state.add("Play", GoblinRun.Play);
            // start
            _this.state.start("Boot");
            return _this;
        }
        return Game;
    }(Phaser.Game));
    GoblinRun.Game = Game;
})(GoblinRun || (GoblinRun = {}));
/**
 * Created by tdavis6782 on 6/28/17.
 */
var GoblinRun;
(function (GoblinRun) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // -------------------------------------------------------------------------
        Boot.prototype.create = function () {
            this.game.state.start("Preload");
        };
        return Boot;
    }(Phaser.State));
    GoblinRun.Boot = Boot;
})(GoblinRun || (GoblinRun = {}));
/**
 * Created by tdavis6782 on 6/28/17.
 */
var GoblinRun;
(function (GoblinRun) {
    var Preload = (function (_super) {
        __extends(Preload, _super);
        function Preload() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            // music decoded, ready for game
            _this._ready = false;
            return _this;
        }
        // -------------------------------------------------------------------------
        Preload.prototype.preload = function () {
        };
        // -------------------------------------------------------------------------
        Preload.prototype.create = function () {
        };
        // -------------------------------------------------------------------------
        Preload.prototype.update = function () {
            // run only once
            if (this._ready === false) {
                this._ready = true;
                this.game.state.start("Play");
            }
        };
        return Preload;
    }(Phaser.State));
    GoblinRun.Preload = Preload;
})(GoblinRun || (GoblinRun = {}));
var GoblinRun;
(function (GoblinRun) {
    var Play = (function (_super) {
        __extends(Play, _super);
        function Play() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // -------------------------------------------------------------------------
        Play.prototype.create = function () {
            this.stage.backgroundColor = 0x80FF80;
        };
        // -------------------------------------------------------------------------
        Play.prototype.update = function () {
        };
        return Play;
    }(Phaser.State));
    GoblinRun.Play = Play;
})(GoblinRun || (GoblinRun = {}));
//# sourceMappingURL=goblinrun.js.map