namespace Breakout.Component {

    export class Scorekeeper {

        private _score;
        private _bitmapText: Phaser.BitmapText;

        public label: string;

        constructor( position : Phaser.Point, font : string, label : string, score: number, context ) {

            this.label = ( label ) ? label : 'SCORE: ';
            this._score = ( score ) ? score : 0;

            this._bitmapText = context.add.bitmapText( position.x, position.y, font, this.label + this._score , 64 );
            this._bitmapText.smoothed = false;
            this._bitmapText.tint = 0xff0000;
        }

        /**
         * Add the indicated value to the score.  May be negative.
         * @param val: number  The value by which to adjust the score.
         */
        public addToScore( val : number ) {

            this._score += val;
            this._bitmapText.text = this.label + this._score;
        }

        /**
         * The the new value for the score
         *
         * @param val: number  The new score value
         */
        public set score( val: number ) {

            this._score = val;
            this._bitmapText.text = this.label + this._score;
        }

        public get score(): number  {

            return this._score;
        }

        /**
         * The length, in px, of this scorebox on display
         * @returns {number}
         */
        public get length(): number {

            return this._bitmapText.width;
        }
    }
}