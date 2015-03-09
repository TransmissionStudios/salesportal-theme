// Gulp requires.
var gulp = require('gulp'),
  $ = require('gulp-load-plugins'),
  sourcemaps = require('gulp-sourcemaps'),
  sassnode = require('gulp-sass'),
  sassruby = require('gulp-ruby-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  minifycss = require('gulp-minify-css'),
  rename = require('gulp-rename'),
  livereload = require('gulp-livereload'),
  spritesmith = require('gulp.spritesmith'),
  image = require('gulp-image'),
  gulpif = require('gulp-if'),
  hologram = require('gulp-hologram');

// Others.
var arg = require('yargs').argv;

// Node Sass.
//gulp.task('node-sass', function() {
//  return gulp.src(['sass/**/base.scss'])
//    .pipe(sourcemaps.init())
//    .pipe(sassnode({
//      errLogToConsole: true,
//      sourceComments : 'normal',
//      require: ['susy']
//    }))
//    .pipe(sourcemaps.write())
//    .pipe(autoprefixer('last 2 versions', 'ie 8', 'ie 9'))
//    .pipe(gulpif(arg.production, minifycss())) // Produce production CSS.
//    .pipe(gulp.dest('css'))
//});

// Ruby Sass.
gulp.task('ruby-sass', function() {
  return sassruby('sass/base.scss')
    .pipe(sourcemaps.init())
    .pipe(autoprefixer('last 2 versions', 'ie 8', 'ie 9'))
    .pipe(sourcemaps.write())
    .pipe(gulpif(arg.production, minifycss())) // Produce production CSS.
    .pipe(gulp.dest('css'));
});

// Spritesmith.
gulp.task('sprite', function() {
  var spriteData = gulp.src('images/sprites/*.png')
    .pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: '_sprites.scss'
    }));
  spriteData.img.pipe(gulp.dest('images'));
  spriteData.css.pipe(gulp.dest('sass/base'));
});

// Image minification.
gulp.task('image', function() {
  gulp.src('images/unoptimised/**/*')
    .pipe(image())
    .pipe(gulp.dest('images/optimised'));
});

// Hologram.
gulp.task('hologram', function() {
  gulp.src('hologram_config.yml')
  .pipe(hologram());
});

// Watch
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('sass/**/*.scss', ['ruby-sass']);
  gulp.watch('css/base.css').on('change', livereload.changed);
  gulp.watch('js/scripts.js').on('change', livereload.changed);
  gulp.watch('templates/**/*.twig').on('change', livereload.changed);
});

gulp.task('default', ['ruby-sass', 'sprite', 'watch', 'hologram'], function() {
});
