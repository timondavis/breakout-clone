/**
 * Created by tdavis6782 on 6/28/17.
 */
namespace Breakout {

    export class Boot extends Phaser.State {
        // -------------------------------------------------------------------------
        public create() {
            this.game.state.start( "Preload" );
        }
    }
}
