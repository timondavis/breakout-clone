namespace Breakout {

    export class Welcome extends Phaser.State {


        public create() {

            let title = this.add.bitmapText( 100, 250, 'fat-and-tiny', 'Breakout Clone!!', 128 );
            let cta = this.add.bitmapText( 400, 450, 'fat-and-tiny', 'click to start!', 40 );

            this.input.onDown.addOnce( function( e ) { Global.game.state.start( "Play" ) } );
        }
    }
}