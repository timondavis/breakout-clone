/**
 * Created by tdavis6782 on 6/28/17.
 */
namespace Breakout {
    export class Game extends Phaser.Game {

        public constructor() {
            // init game
            super( Global.GAME_WIDTH, Global.GAME_HEIGHT, Phaser.AUTO, "content" );

            // states
            this.state.add( "Boot", Boot );
            this.state.add( "Preload", Preload );
            this.state.add( "Play", Play );
            this.state.add( "GameOver", GameOver );
            this.state.add( "Welcome", Welcome );

            // start
            this.state.start( "Preload" );
        }
    }
}