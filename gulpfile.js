//gulpfile.js

var gulp = require('gulp');
var sass = require('gulp-sass');

//style paths
var sassFiles = './src/client/scss/**/*.scss'

gulp.task('styles', () => {
    return gulp.src('./src/client/scss/styles.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('build/css/'));
});

gulp.task('watch',() => {
    gulp.watch(sassFiles,gulp.series('styles'));
});