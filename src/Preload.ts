/**
 * Created by tdavis6782 on 6/28/17.
 */
namespace Breakout {
    export class Preload extends Phaser.State {
        // music decoded, ready for game
        private _ready: boolean = false;
// -------------------------------------------------------------------------
        public preload() {

            Global.game.load.path = 'assets/';

            Global.game.load.images([ 'paddle', 'background' ]);
            Global.game.load.bitmapFont( 'fat-and-tiny' );

            Global.game.load.spritesheet( 'bars', 'bars.png', 64, 3 );
        }
// -------------------------------------------------------------------------
        public create() {
        }
// -------------------------------------------------------------------------
        public update() {

            // run only once
            if (this._ready === false) {
                this._ready = true;
                this.game.state.start( "Welcome" );
            }
        }
    }
}