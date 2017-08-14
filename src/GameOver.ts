namespace Breakout {

    export class GameOver extends Phaser.State {


        public create() {

            this.add.bitmapText( 400, 280, 'fat-and-tiny', 'GAME OVER', 64 );
            this.add.bitmapText( 410, 350, 'fat-and-tiny', 'Click to try again!', 32 );

            this.input.onDown.addOnce( function( e ) { Global.game.state.start( 'Play' ); } );
        }

    }
}