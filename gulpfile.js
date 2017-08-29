var gulp = require('gulp');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var cleanCss = require('gulp-clean-css');
var rev = require('gulp-rev');
var del = require('del');
var streamqueue  = require('streamqueue');

gulp.task('clean-js', function () {
  return del([
    'build/js/*.js'
  ]);
});

gulp.task('clean-css', function () {
  return del([
    'build/css/*.css'
  ]);
});

gulp.task('pack-js', ['clean-js'], function () {  
  return streamqueue(
      { objectMode: true },
      gulp.src("lib/easeljs-0.8.1.min.js"),
      gulp.src("lib/jquery-3.1.0.min.js"),
      gulp.src("lib/lodash.min.js"),
      gulp.src("lib/backbone-min.js"),
      gulp.src("lib/keymaster-min.js"),
      gulp.src("lib/platform.js"),
      gulp.src("lib/preloadjs-0.3.1.min.js"),
      gulp.src("src/ecs/*.js"),
      gulp.src("src/entities/*.js"),
      gulp.src("src/systems/*.js"),
      gulp.src("src/view_components/*.js"),
      gulp.src("src/view_systems/*.js"),
      gulp.src("src/config.js"),
      gulp.src("src/event_manager.js"),
      gulp.src("src/notebook_numbers.js"))
    .pipe(concat('bundle.js'))
    .pipe(minify({
        ext:{
            min:'.js'
        },
        noSource: true
    }))
    //.pipe(rev())
    .pipe(gulp.dest('build/js'))
    //.pipe(rev.manifest('build/rev-manifest.json', {
      //merge: true
    //}))
    .pipe(gulp.dest(''));
});

gulp.task('pack-css', ['clean-css'], function () {  
  return gulp.src("src/css/*.css")
    .pipe(concat('stylesheet.css'))
    .pipe(cleanCss())
    //.pipe(rev())
    .pipe(gulp.dest('build/css'))
    //.pipe(rev.manifest('build/rev-manifest.json', {
      //merge: true
    //}))
    .pipe(gulp.dest(''));
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['pack-js']);
  gulp.watch('lib/**/*.js', ['pack-js']);
  gulp.watch('gulpfile.js', ['pack-js']);
  gulp.watch('src/css/*.css', ['pack-css']);
  gulp.watch('gulpfile.js', ['pack-css']);
});

gulp.task('default', ['watch']);