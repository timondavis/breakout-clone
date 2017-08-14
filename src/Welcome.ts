namespace Breakout {

    export class Welcome extends Phaser.State {


        public create() {

            let title = this.add.bitmapText( 100, 150, 'fat-and-tiny', 'Breakout Clone!!', 128 );
            title.smoothed = false;

            let hiscore = this.add.bitmapText( 350, 380, 'fat-and-tiny', 'HI SCORE: ' + Global.highScore, 70);
            hiscore.smoothed = false;
            hiscore.tint = 0xff0000;

            let cta = this.add.bitmapText( 400, 450, 'fat-and-tiny', 'click to start!', 40 );
            cta.smoothed = false;

            this.input.onDown.addOnce( function( e ) { Global.game.state.start( "Play" ) } );
        }
    }
}