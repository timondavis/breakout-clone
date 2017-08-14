namespace Breakout {
    import Rectangle = Phaser.Rectangle;
    import Point = Phaser.Point;

    enum PlayState { PLAY, HOLD }

    export class Play extends Phaser.State {

        private playState : PlayState = PlayState.PLAY;

        private paddle: Phaser.Sprite;
        private bars: Phaser.Group;
        private background;
        private walls;
        private balls;

        private paddleSpeed = 20;
        private ballSpeed = 300;
        private maxSpeed = 750;

        private leftBoundary = 130;
        private rightBoundary = Global.GAME_WIDTH - 130;
        private topBoundary = 100;
        private bottomBoundary = Global.GAME_HEIGHT - 50;
        private insidePadding = 50;

        private speedFactor = 1;
        private speedFactorIncrement = 0.01;
        private speedFactorMax = 1.3;

        private barValue = 50;

        private newBallZone : Rectangle;

        private scorekeeper: Breakout.Component.Scorekeeper;
        private statusBoard: Breakout.Component.Scorekeeper;
        private level: Breakout.Component.Scorekeeper;



// -------------------------------------------------------------------------

        public preload() {


            this.newBallZone = new Rectangle(
                this.leftBoundary + this.insidePadding, (this.bottomBoundary - this.topBoundary ) / 2,
                ( this.rightBoundary - this.insidePadding ) - (this.leftBoundary + this.insidePadding),
                (this.bottomBoundary - this.topBoundary ) / 3,
            );

        }

        public create() {

            this.add.image( 0, 0, 'background', 0 );

            this.paddle = this.add.sprite( 520, 700, 'paddle', 0 );
            this.paddle.anchor.set( 0.5 );
            this.physics.arcade.enable( this.paddle );
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

            this.scorekeeper = new Breakout.Component.Scorekeeper( new Phaser.Point( this.leftBoundary , 20  ),
                'fat-and-tiny', null, 0, this );
            this.statusBoard = new Breakout.Component.Scorekeeper(
                new Phaser.Point( this.rightBoundary - 420, 20 ),
                'fat-and-tiny', 'Balls Remaining: ', 2, this );
            this.level = new Breakout.Component.Scorekeeper( new Phaser.Point( 0, 20 ) ,
                'fat-and-tiny', 'Level: ', 1, this );


            this.setupBars();
        }

        public init() {

            this.physics.startSystem( Phaser.Physics.ARCADE );

            this.input.keyboard.addKey( Phaser.Keyboard.A );
            this.input.keyboard.addKey( Phaser.Keyboard.D );
        }

// -------------------------------------------------------------------------
        public update() {

            this.physics.arcade.collide( this.paddle, this.balls, this.paddleBallCollision, null, this );
            this.physics.arcade.collide( this.walls, this.balls );
            this.physics.arcade.collide( this.balls, this.bars, this.handleBallBarCollision, null, this);
            this.physics.arcade.collide( this.paddle, this.walls );

            this.manageOutOfBoundsBalls();
            this.handlePaddleInput();

            if ( this.barsRemaining <= 0 ) {

                this.nextLevel();
            }
        }

        /**
         * Create the bars which need to be eliminated in order to complete the game
         */
        public setupBars() {

            let self = this;

            // Define offsets
            let xOffset = this.leftBoundary + this.insidePadding;
            let yOffset = this.topBoundary + this.insidePadding;

            // Loop through and create each bar in the grid
            for ( let row = 0 ; row < Phaser.Math.clamp( self.level.score,  1, 5) ; row++ ) {

                for ( let col = 0 ; col < 10 ; col++ )  {

                    let bar = this.add.sprite( xOffset + (col * 68),
                        yOffset + (row * 10),
                        'bars', row, this.bars );

                    bar.body.immovable = true;
                }
            }
        }

        /**
         * Setup the boundaries for the game.
         */
        public setupBoundary() {

            this.walls.add( this.createBlock( this.rightBoundary - this.leftBoundary, 8,
                this.leftBoundary, this.topBoundary ) );
            this.walls.add( this.createBlock( 8, this.bottomBoundary - this.topBoundary,
                this.leftBoundary, this.topBoundary ) );
            this.walls.add( this.createBlock( 8, this.bottomBoundary - this.topBoundary
                , this.rightBoundary, this.topBoundary ) );
        }

        /**
         * Create a new block from which balls will bounce from
         *
         * @param length:  The length of the new block
         * @param width:  The width of the new block
         * @param x: The x param of the target placement location
         * @paray y: The y param of the target placement location
         */
        public createBlock( length, width, x, y ) {

           let bmd = this.add.bitmapData( Math.abs(length), Math.abs(width) );

           bmd.ctx.beginPath();
           bmd.ctx.rect( 0, 0, Math.abs(length), Math.abs(width));
           bmd.ctx.fillStyle = '#000000';
           bmd.ctx.fill();

           let sprite = this.add.sprite( x, y, bmd );
           this.physics.arcade.enable( sprite );
           sprite.body.immovable = true;
           return sprite;
        }

        /**
         * Create a new ball in the appropriate zone
         */
        public createBall() {

            let newBallPoint = new Point();
            this.newBallZone.random( newBallPoint );

            this.createBallAt( newBallPoint.x, newBallPoint.y );
        }

        /**
         * Create a new ball instance at the given coordinates
         * @param x
         * @param y
         */
        public createBallAt( x, y ) {

            let self = this;

            let diameter = 25;

            // Make a circle out of thin air - this is our ball
            let bmd = Global.game.add.bitmapData( diameter, diameter );
            bmd.ctx.beginPath();
            bmd.ctx.arc( diameter/2, diameter/2, diameter / 2, 0, 2 * Math.PI, false );
            bmd.ctx.fillStyle = 'black';
            bmd.ctx.fill();

            let sprite = this.add.sprite( x, y, bmd, 0 );
            sprite.anchor.set( 0.5 );


            Global.game.time.events.add( Phaser.Timer.SECOND * 0.3, function() {

                // Pick an angle facing downward on the 2nd and 3rd quadrants
                let rnd = new Phaser.RandomDataGenerator( [ Date.now() ] );
                let launchAngle = rnd.between( 135 , 225 );

                sprite.destroy( true );

                let bmd2 = Global.game.add.bitmapData( diameter, diameter );
                bmd2.ctx.beginPath();
                bmd2.ctx.arc( diameter/2, diameter/2, diameter / 2, 0, 2 * Math.PI, false );
                bmd2.ctx.fillStyle = 'lightgray';
                bmd2.ctx.fill();

                sprite = this.add.sprite( x, y, bmd2, 0, this.balls );
                sprite.anchor.set( 0.5 );
                this.physics.arcade.enable( sprite );
                sprite.physicsEnabled = false;

                sprite.physicsEnabled = true;
                sprite.body.velocity.x = -1 * Math.sin( ( launchAngle * Math.PI ) / 180 ) * self.ballSpeed;
                sprite.body.velocity.y = -1 * Math.cos( ( launchAngle * Math.PI ) / 180 ) * self.ballSpeed;

                sprite.body.collideWorldBounds = false;
                sprite.body.bounce.setTo( 1, 1 );

            }, this );
        }

        private get barsRemaining(): number {

            return this.bars.countLiving();
        }

        private nextLevel() {

            if ( this.playState == PlayState.HOLD ) { return; }
            this.playState = PlayState.HOLD;

            this.balls.removeAll( true );

            let congrats = this.add.bitmapText( 300, 400, 'fat-and-tiny', 'LEVEL CLEARED!!', 80 );
            congrats.tint = 0x00ff00;

            Global.game.time.events.add( Phaser.Timer.SECOND * 2, function() {

                congrats.destroy();
                this.createBall();
                this.level.addToScore( 1 );
                this.setupBars();

                this.barValue = 50 * this.level.score;

                this.playState = PlayState.PLAY;

            }, this );

        }

        private paddleBallCollision( paddle: Phaser.Sprite, ball: Phaser.Sprite ) {

            // Get angle to center of platform from center of ball
            let hitAngle = Global.game.physics.arcade.angleBetween( ball, paddle );

            // Dictate angular velocity based on that angle
            let xDelta = Math.cos( hitAngle );

            let newXVelocity = ball.body.velocity.x - ball.body.speed * xDelta * this.speedFactor;

            ball.body.velocity.x =
                Phaser.Math.clamp(
                    newXVelocity,
                    -1 * this.maxSpeed,
                    this.maxSpeed
                );

            ball.body.velocity.y = Phaser.Math.clamp(
                ball.body.velocity.y * this.speedFactor,
                -1 * this.maxSpeed,
                this.maxSpeed
            );

            if ( this.speedFactor < this.speedFactorMax ) {

                this.speedFactor += this.speedFactorIncrement;
            }

            return true;
        }

        private manageOutOfBoundsBalls() {

            let self = this;

            this.balls.forEach( function( ball: Phaser.Sprite ) {

                if ( Play.isBallOutOfBounds( ball ) ) {

                    ball.destroy();
                    if ( ( self.statusBoard.score -1 ) < 0 ) {

                        self.game.state.start( "GameOver" );
                    }
                    else {

                        self.statusBoard.addToScore( -1 );
                        self.createBall();
                    }
                }
            });
        }

        /**
         * Is the ball out of bounds?
         * @param ball
         * @returns {boolean}
         */
        private static isBallOutOfBounds( ball: Phaser.Sprite ) {

            return ( ball.y > Global.GAME_HEIGHT );
        }

        /**
         * Translate user inputs into movements of the paddle
         */
        private handlePaddleInput() {

            if ( this.input.keyboard.isDown( Phaser.Keyboard.A ) ) {

                this.paddle.x -= this.paddleSpeed;

                if ( this.paddle.x - ( this.paddle.width / 2 ) <= this.leftBoundary ) {

                    this.paddle.x = this.leftBoundary + ( this.paddle.width / 2 );
                }

            } else if ( this.input.keyboard.isDown( Phaser.Keyboard.D ) ) {

                this.paddle.x += this.paddleSpeed;

                if ( this.paddle.x + ( this.paddle.width / 2 ) >= this.rightBoundary ) {

                    this.paddle.x = this.rightBoundary - ( this.paddle.width / 2 ) + 1;
                }
            }
        }

        /**
         * Handle the collision between a bar and a ball.  Increment the score and remove the bar from play.
         * @param ball
         * @param bar
         * @returns {boolean}
         */
        private handleBallBarCollision( ball: Phaser.Sprite, bar: Phaser.Sprite ) {

            bar.destroy( true );
            this.scorekeeper.addToScore( this.barValue );

            if ( this.scorekeeper.score > Global.highScore ) {

                Global.highScore = this.scorekeeper.score;
            }
        }

        private clearBalls() {

            this.balls.clear();
        }
    }
}
