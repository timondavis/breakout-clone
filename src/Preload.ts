/**
 * Created by tdavis6782 on 6/28/17.
 */
namespace GoblinRun {
    export class Preload extends Phaser.State {
        // music decoded, ready for game
        private _ready: boolean = false;
// -------------------------------------------------------------------------
        public preload() {
        }
// -------------------------------------------------------------------------
        public create() {
        }
// -------------------------------------------------------------------------
        public update() {

            // run only once
            if (this._ready === false) {
                this._ready = true;
                this.game.state.start( "Play" );
            }

        }
    }
}