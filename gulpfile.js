var gulp = require('gulp');
var sass = require('gulp-sass');


gulp.task('sass', function(){
  return gulp.src('src/index.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('src/'))
});

//Watch task
gulp.task('watch',function() {
    gulp.watch('src/*.scss',['sass']);
});