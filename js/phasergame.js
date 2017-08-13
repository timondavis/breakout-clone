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
var Breakout;
(function (Breakout) {
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
    Breakout.Boot = Boot;
})(Breakout || (Breakout = {}));
/**
 * Created by tdavis6782 on 6/28/17.
 */
var Breakout;
(function (Breakout) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            var _this = 
            // init game
            _super.call(this, Breakout.Global.GAME_WIDTH, Breakout.Global.GAME_HEIGHT, Phaser.AUTO, "content") || this;
            // states
            _this.state.add("Boot", Breakout.Boot);
            _this.state.add("Preload", Breakout.Preload);
            _this.state.add("Play", Breakout.Play);
            // start
            _this.state.start("Boot");
            return _this;
        }
        return Game;
    }(Phaser.Game));
    Breakout.Game = Game;
})(Breakout || (Breakout = {}));
var Breakout;
(function (Breakout) {
    var Play = (function (_super) {
        __extends(Play, _super);
        function Play() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.paddleSpeed = 20;
            _this.ballSpeed = 500;
            _this.leftBoundary = 170;
            _this.rightBoundary = 900;
            return _this;
        }
        // -------------------------------------------------------------------------
        Play.prototype.preload = function () {
        };
        Play.prototype.create = function () {
            this.add.image(0, 0, 'background', 0);
            this.paddle = this.add.sprite(468, 700, 'paddle', 0);
            this.physics.arcade.enable(this.paddle);
            this.paddle.physicsEnabled = true;
            this.paddle.body.immovable = true;
            this.bars = this.add.physicsGroup();
            this.setupBars();
            this.bars.physicsBodyType = Phaser.Physics.ARCADE;
            this.walls = this.add.physicsGroup();
            this.walls.physicsBodyType = Phaser.Physics.ARCADE;
            this.balls = this.add.physicsGroup();
            this.balls.physicsBodyType = Phaser.Physics.ARCADE;
            this.setupBoundary();
            this.createBall(400, 600);
        };
        Play.prototype.init = function () {
            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.input.keyboard.addKey(Phaser.Keyboard.A);
            this.input.keyboard.addKey(Phaser.Keyboard.D);
        };
        // -------------------------------------------------------------------------
        Play.prototype.update = function () {
            var self = this;
            this.physics.arcade.collide(this.paddle, this.balls);
            this.physics.arcade.collide(this.walls, this.balls);
            this.physics.arcade.collide(this.bars, this.balls, this.coll_removeBar);
            this.physics.arcade.collide(this.paddle, this.walls);
            this.balls.forEach(function (ball) {
                if (Play.isBallOutOfBounds(ball)) {
                    self.handleBallOutOfBounds(ball);
                }
            });
            if (this.input.keyboard.isDown(Phaser.Keyboard.A)) {
                this.paddle.x -= this.paddleSpeed;
                if (this.paddle.x <= this.leftBoundary) {
                    this.paddle.x = this.leftBoundary + 1;
                }
            }
            else if (this.input.keyboard.isDown(Phaser.Keyboard.D)) {
                this.paddle.x += this.paddleSpeed;
                if (this.paddle.x + this.paddle.width >= this.rightBoundary) {
                    this.paddle.x = this.rightBoundary - this.paddle.width + 1;
                }
            }
        };
        /**
         * Create the bars which need to be eliminated in order to complete the game
         */
        Play.prototype.setupBars = function () {
            // Define offsets
            var xOffset = 200;
            var yOffset = 60;
            // Loop through and create each bar in the grid
            for (var row = 0; row < 4; row++) {
                for (var col = 0; col < 10; col++) {
                    var bar = this.add.sprite(xOffset + (col * 68), yOffset + (row * 10), 'bars', row, this.bars);
                    bar.body.immovable = true;
                }
            }
        };
        /**
         * Setup the boundaries for the game.
         */
        Play.prototype.setupBoundary = function () {
            this.walls.add(this.createBlock(730, 8, 170, 30));
            this.walls.add(this.createBlock(8, 730, 170, 30));
            this.walls.add(this.createBlock(8, 730, 900, 30));
        };
        /**
         * Create a new block from which balls will bounce from
         *
         * @param length:  The length of the new block
         * @param width:  The width of the new block
         * @param x: The x param of the target placement location
         * @paray y: The y param of the target placement location
         */
        Play.prototype.createBlock = function (length, width, x, y) {
            var bmd = Breakout.Global.game.add.bitmapData(Math.abs(length), Math.abs(width));
            bmd.ctx.beginPath();
            bmd.ctx.rect(0, 0, Math.abs(length), Math.abs(width));
            bmd.ctx.fillStyle = '#000000';
            bmd.ctx.fill();
            var sprite = this.add.sprite(x, y, bmd);
            this.physics.arcade.enable(sprite);
            sprite.body.immovable = true;
            return sprite;
        };
        /**
         * Create a new ball instance at the given coordinates
         * @param x
         * @param y
         */
        Play.prototype.createBall = function (x, y) {
            var diameter = 25;
            var bmd = Breakout.Global.game.add.bitmapData(diameter, diameter);
            bmd.ctx.beginPath();
            bmd.ctx.arc(diameter / 2, diameter / 2, diameter / 2, 0, 2 * Math.PI, false);
            bmd.ctx.fillStyle = 'lightgray';
            bmd.ctx.fill();
            var sprite = this.add.sprite(x, y, bmd, 0, this.balls);
            this.physics.arcade.enable(sprite);
            sprite.physicsEnabled = true;
            sprite.body.velocity.x = this.ballSpeed;
            sprite.body.velocity.y = this.ballSpeed;
            sprite.body.collideWorldBounds = false;
            sprite.body.bounce.setTo(1, 1);
        };
        Play.bounceBallFromPaddle = function (ball, paddle) {
            ball.body.velocity.y = -1 * ball.body.velocity.y;
        };
        Play.prototype.handleBallOutOfBounds = function (ball) {
            ball.destroy();
            this.createBall(500, 400);
        };
        /**
         * Collision handler between ball and bar.  Bar gets removed from play.
         * @param bar
         * @param ball
         */
        Play.prototype.coll_removeBar = function (bar, ball) {
            bar.destroy(true);
        };
        /**
         * Is the ball out of bounds?
         * @param ball
         * @returns {boolean}
         */
        Play.isBallOutOfBounds = function (ball) {
            return (ball.y > Breakout.Global.GAME_HEIGHT);
        };
        return Play;
    }(Phaser.State));
    Breakout.Play = Play;
})(Breakout || (Breakout = {}));
/**
 * Created by tdavis6782 on 6/28/17.
 */
var Breakout;
(function (Breakout) {
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
            Breakout.Global.game.load.path = 'assets/';
            Breakout.Global.game.load.images(['paddle', 'background']);
            Breakout.Global.game.load.spritesheet('bars', 'bars.png', 64, 3);
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
    Breakout.Preload = Preload;
})(Breakout || (Breakout = {}));
var Breakout;
(function (Breakout) {
    var Global = (function () {
        function Global() {
        }
        // game size
        Global.GAME_WIDTH = 1024;
        Global.GAME_HEIGHT = 768;
        return Global;
    }());
    Breakout.Global = Global;
})(Breakout || (Breakout = {}));
// -------------------------------------------------------------------------
window.onload = function () {
    Breakout.Global.game = new Breakout.Game();
};
//# sourceMappingURL=phasergame.js.map