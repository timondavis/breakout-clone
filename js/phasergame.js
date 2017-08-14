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
            _this.state.add("GameOver", Breakout.GameOver);
            _this.state.add("Welcome", Breakout.Welcome);
            // start
            _this.state.start("Preload");
            return _this;
        }
        return Game;
    }(Phaser.Game));
    Breakout.Game = Game;
})(Breakout || (Breakout = {}));
var Breakout;
(function (Breakout) {
    var Rectangle = Phaser.Rectangle;
    var Point = Phaser.Point;
    var PlayState;
    (function (PlayState) {
        PlayState[PlayState["PLAY"] = 0] = "PLAY";
        PlayState[PlayState["HOLD"] = 1] = "HOLD";
    })(PlayState || (PlayState = {}));
    var Play = (function (_super) {
        __extends(Play, _super);
        function Play() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.playState = PlayState.PLAY;
            _this.paddleSpeed = 20;
            _this.ballSpeed = 300;
            _this.maxSpeed = 750;
            _this.leftBoundary = 130;
            _this.rightBoundary = Breakout.Global.GAME_WIDTH - 130;
            _this.topBoundary = 100;
            _this.bottomBoundary = Breakout.Global.GAME_HEIGHT - 50;
            _this.insidePadding = 50;
            _this.speedFactor = 1;
            _this.speedFactorIncrement = 0.01;
            _this.speedFactorMax = 1.3;
            _this.barValue = 50;
            return _this;
        }
        // -------------------------------------------------------------------------
        Play.prototype.preload = function () {
            this.newBallZone = new Rectangle(this.leftBoundary + this.insidePadding, (this.bottomBoundary - this.topBoundary) / 2, (this.rightBoundary - this.insidePadding) - (this.leftBoundary + this.insidePadding), (this.bottomBoundary - this.topBoundary) / 3);
        };
        Play.prototype.create = function () {
            this.add.image(0, 0, 'background', 0);
            this.paddle = this.add.sprite(520, 700, 'paddle', 0);
            this.paddle.anchor.set(0.5);
            this.physics.arcade.enable(this.paddle);
            this.paddle.physicsEnabled = true;
            this.paddle.body.immovable = true;
            this.bars = this.add.physicsGroup();
            this.bars.physicsBodyType = Phaser.Physics.ARCADE;
            this.walls = this.add.physicsGroup();
            this.walls.physicsBodyType = Phaser.Physics.ARCADE;
            this.balls = this.add.physicsGroup();
            this.balls.physicsBodyType = Phaser.Physics.ARCADE;
            this.setupBoundary();
            this.createBall();
            this.scorekeeper = new Breakout.Component.Scorekeeper(new Phaser.Point(this.leftBoundary, 20), 'fat-and-tiny', null, 0, this);
            this.statusBoard = new Breakout.Component.Scorekeeper(new Phaser.Point(this.rightBoundary - 420, 20), 'fat-and-tiny', 'Balls Remaining: ', 2, this);
            this.level = new Breakout.Component.Scorekeeper(new Phaser.Point(0, 20), 'fat-and-tiny', 'Level: ', 1, this);
            this.setupBars();
        };
        Play.prototype.init = function () {
            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.input.keyboard.addKey(Phaser.Keyboard.A);
            this.input.keyboard.addKey(Phaser.Keyboard.D);
        };
        // -------------------------------------------------------------------------
        Play.prototype.update = function () {
            this.physics.arcade.collide(this.paddle, this.balls, this.paddleBallCollision, null, this);
            this.physics.arcade.collide(this.walls, this.balls);
            this.physics.arcade.collide(this.balls, this.bars, this.handleBallBarCollision, null, this);
            this.physics.arcade.collide(this.paddle, this.walls);
            this.manageOutOfBoundsBalls();
            this.handlePaddleInput();
            if (this.barsRemaining <= 0) {
                this.nextLevel();
            }
        };
        /**
         * Create the bars which need to be eliminated in order to complete the game
         */
        Play.prototype.setupBars = function () {
            var self = this;
            // Define offsets
            var xOffset = this.leftBoundary + this.insidePadding;
            var yOffset = this.topBoundary + this.insidePadding;
            // Loop through and create each bar in the grid
            for (var row = 0; row < Phaser.Math.clamp(self.level.score, 1, 5); row++) {
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
            this.walls.add(this.createBlock(this.rightBoundary - this.leftBoundary, 8, this.leftBoundary, this.topBoundary));
            this.walls.add(this.createBlock(8, this.bottomBoundary - this.topBoundary, this.leftBoundary, this.topBoundary));
            this.walls.add(this.createBlock(8, this.bottomBoundary - this.topBoundary, this.rightBoundary, this.topBoundary));
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
            var bmd = this.add.bitmapData(Math.abs(length), Math.abs(width));
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
         * Create a new ball in the appropriate zone
         */
        Play.prototype.createBall = function () {
            var newBallPoint = new Point();
            this.newBallZone.random(newBallPoint);
            this.createBallAt(newBallPoint.x, newBallPoint.y);
        };
        /**
         * Create a new ball instance at the given coordinates
         * @param x
         * @param y
         */
        Play.prototype.createBallAt = function (x, y) {
            var self = this;
            var diameter = 25;
            // Make a circle out of thin air - this is our ball
            var bmd = Breakout.Global.game.add.bitmapData(diameter, diameter);
            bmd.ctx.beginPath();
            bmd.ctx.arc(diameter / 2, diameter / 2, diameter / 2, 0, 2 * Math.PI, false);
            bmd.ctx.fillStyle = 'black';
            bmd.ctx.fill();
            var sprite = this.add.sprite(x, y, bmd, 0);
            sprite.anchor.set(0.5);
            Breakout.Global.game.time.events.add(Phaser.Timer.SECOND * 0.3, function () {
                // Pick an angle facing downward on the 2nd and 3rd quadrants
                var rnd = new Phaser.RandomDataGenerator([Date.now()]);
                var launchAngle = rnd.between(135, 225);
                sprite.destroy(true);
                var bmd2 = Breakout.Global.game.add.bitmapData(diameter, diameter);
                bmd2.ctx.beginPath();
                bmd2.ctx.arc(diameter / 2, diameter / 2, diameter / 2, 0, 2 * Math.PI, false);
                bmd2.ctx.fillStyle = 'lightgray';
                bmd2.ctx.fill();
                sprite = this.add.sprite(x, y, bmd2, 0, this.balls);
                sprite.anchor.set(0.5);
                this.physics.arcade.enable(sprite);
                sprite.physicsEnabled = false;
                sprite.physicsEnabled = true;
                sprite.body.velocity.x = -1 * Math.sin((launchAngle * Math.PI) / 180) * self.ballSpeed;
                sprite.body.velocity.y = -1 * Math.cos((launchAngle * Math.PI) / 180) * self.ballSpeed;
                sprite.body.collideWorldBounds = false;
                sprite.body.bounce.setTo(1, 1);
            }, this);
        };
        Object.defineProperty(Play.prototype, "barsRemaining", {
            get: function () {
                return this.bars.countLiving();
            },
            enumerable: true,
            configurable: true
        });
        Play.prototype.nextLevel = function () {
            if (this.playState == PlayState.HOLD) {
                return;
            }
            this.playState = PlayState.HOLD;
            this.balls.removeAll(true);
            var congrats = this.add.bitmapText(300, 400, 'fat-and-tiny', 'LEVEL CLEARED!!', 80);
            congrats.tint = 0x00ff00;
            Breakout.Global.game.time.events.add(Phaser.Timer.SECOND * 2, function () {
                congrats.destroy();
                this.createBall();
                this.level.addToScore(1);
                this.setupBars();
                this.barValue = 50 * this.level.score;
                this.playState = PlayState.PLAY;
            }, this);
        };
        Play.prototype.paddleBallCollision = function (paddle, ball) {
            // Get angle to center of platform from center of ball
            var hitAngle = Breakout.Global.game.physics.arcade.angleBetween(ball, paddle);
            // Dictate angular velocity based on that angle
            var xDelta = Math.cos(hitAngle);
            var newXVelocity = ball.body.velocity.x - ball.body.speed * xDelta * this.speedFactor;
            ball.body.velocity.x =
                Phaser.Math.clamp(newXVelocity, -1 * this.maxSpeed, this.maxSpeed);
            ball.body.velocity.y = Phaser.Math.clamp(ball.body.velocity.y * this.speedFactor, -1 * this.maxSpeed, this.maxSpeed);
            if (this.speedFactor < this.speedFactorMax) {
                this.speedFactor += this.speedFactorIncrement;
            }
            return true;
        };
        Play.prototype.manageOutOfBoundsBalls = function () {
            var self = this;
            this.balls.forEach(function (ball) {
                if (Play.isBallOutOfBounds(ball)) {
                    ball.destroy();
                    if ((self.statusBoard.score - 1) < 0) {
                        self.game.state.start("GameOver");
                    }
                    else {
                        self.statusBoard.addToScore(-1);
                        self.createBall();
                    }
                }
            });
        };
        /**
         * Is the ball out of bounds?
         * @param ball
         * @returns {boolean}
         */
        Play.isBallOutOfBounds = function (ball) {
            return (ball.y > Breakout.Global.GAME_HEIGHT);
        };
        /**
         * Translate user inputs into movements of the paddle
         */
        Play.prototype.handlePaddleInput = function () {
            if (this.input.keyboard.isDown(Phaser.Keyboard.A)) {
                this.paddle.x -= this.paddleSpeed;
                if (this.paddle.x - (this.paddle.width / 2) <= this.leftBoundary) {
                    this.paddle.x = this.leftBoundary + (this.paddle.width / 2);
                }
            }
            else if (this.input.keyboard.isDown(Phaser.Keyboard.D)) {
                this.paddle.x += this.paddleSpeed;
                if (this.paddle.x + (this.paddle.width / 2) >= this.rightBoundary) {
                    this.paddle.x = this.rightBoundary - (this.paddle.width / 2) + 1;
                }
            }
        };
        /**
         * Handle the collision between a bar and a ball.  Increment the score and remove the bar from play.
         * @param ball
         * @param bar
         * @returns {boolean}
         */
        Play.prototype.handleBallBarCollision = function (ball, bar) {
            bar.destroy(true);
            this.scorekeeper.addToScore(this.barValue);
            if (this.scorekeeper.score > Breakout.Global.highScore) {
                Breakout.Global.highScore = this.scorekeeper.score;
            }
        };
        Play.prototype.clearBalls = function () {
            this.balls.clear();
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
            Breakout.Global.game.load.bitmapFont('fat-and-tiny');
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
                this.game.state.start("Welcome");
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
        Global.highScore = 0;
        return Global;
    }());
    Breakout.Global = Global;
})(Breakout || (Breakout = {}));
// -------------------------------------------------------------------------
window.onload = function () {
    Breakout.Global.game = new Breakout.Game();
};
var Breakout;
(function (Breakout) {
    var Component;
    (function (Component) {
        var Scorekeeper = (function () {
            function Scorekeeper(position, font, label, score, context) {
                this.label = (label) ? label : 'SCORE: ';
                this._score = (score) ? score : 0;
                this._bitmapText = context.add.bitmapText(position.x, position.y, font, this.label + this._score, 32);
                this._bitmapText.smoothed = false;
                this._bitmapText.tint = 0xff0000;
            }
            /**
             * Add the indicated value to the score.  May be negative.
             * @param val: number  The value by which to adjust the score.
             */
            Scorekeeper.prototype.addToScore = function (val) {
                this._score += val;
                this._bitmapText.text = this.label + this._score;
            };
            Object.defineProperty(Scorekeeper.prototype, "score", {
                get: function () {
                    return this._score;
                },
                /**
                 * The the new value for the score
                 *
                 * @param val: number  The new score value
                 */
                set: function (val) {
                    this._score = val;
                    this._bitmapText.text = this.label + this._score;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Scorekeeper.prototype, "length", {
                /**
                 * The length, in px, of this scorebox on display
                 * @returns {number}
                 */
                get: function () {
                    return this._bitmapText.width;
                },
                enumerable: true,
                configurable: true
            });
            return Scorekeeper;
        }());
        Component.Scorekeeper = Scorekeeper;
    })(Component = Breakout.Component || (Breakout.Component = {}));
})(Breakout || (Breakout = {}));
var Breakout;
(function (Breakout) {
    var GameOver = (function (_super) {
        __extends(GameOver, _super);
        function GameOver() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GameOver.prototype.create = function () {
            this.add.bitmapText(400, 280, 'fat-and-tiny', 'GAME OVER', 64);
            this.add.bitmapText(410, 350, 'fat-and-tiny', 'Click to try again!', 32);
            this.input.onDown.addOnce(function (e) { Breakout.Global.game.state.start('Welcome'); });
        };
        return GameOver;
    }(Phaser.State));
    Breakout.GameOver = GameOver;
})(Breakout || (Breakout = {}));
var Breakout;
(function (Breakout) {
    var Welcome = (function (_super) {
        __extends(Welcome, _super);
        function Welcome() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Welcome.prototype.create = function () {
            var title = this.add.bitmapText(100, 150, 'fat-and-tiny', 'Breakout Clone!!', 128);
            title.smoothed = false;
            var hiscore = this.add.bitmapText(350, 380, 'fat-and-tiny', 'HI SCORE: ' + Breakout.Global.highScore, 70);
            hiscore.smoothed = false;
            hiscore.tint = 0xff0000;
            var cta = this.add.bitmapText(400, 450, 'fat-and-tiny', 'click to start!', 40);
            cta.smoothed = false;
            this.input.onDown.addOnce(function (e) { Breakout.Global.game.state.start("Play"); });
        };
        return Welcome;
    }(Phaser.State));
    Breakout.Welcome = Welcome;
})(Breakout || (Breakout = {}));
//# sourceMappingURL=phasergame.js.map