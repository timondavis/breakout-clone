/**
 * Created by tdavis6782 on 6/28/17.
 */

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var browserSync = require( 'browser-sync' );

gulp.task('default', function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: [ 'src/app.ts'],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
        .transform('babelify', {
            presets: ['es2015'],
            extensions: ['.ts']
        })
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('js'));
});

gulp.task( 'browserSync', function() {

    browserSync.init({

        server: {
           baseDir: './'
        }
    })
});


gulp.task( 'watch', function() {

    gulp.watch( 'src/**/*', ['default', 'browserSync'] );
});

