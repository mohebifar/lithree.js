'use strict';

var gulp = require('gulp');
var to5 = require('gulp-6to5');
var concat = require('gulp-concat');
var prettify = require('gulp-js-prettify');
var livereload = require('gulp-livereload');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');

gulp.task('compress', function () {
  gulp.src('dist/mogl.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/mogl.min.js'))
});

gulp.task('prettify', function () {

  gulp.src('./dist/mogl.js')
    .pipe(prettify({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist'))
    .pipe(livereload());

});

gulp.task('6to5', function () {

  gulp.src(['./src/es6/**/*.js'])
    .pipe(to5({
      modules: 'ignore'
    }))
    .pipe(gulp.dest('./src/es5'));

});


gulp.task('concat', function () {

  gulp.src(
    ['./src/intro.js',
      './src/es5/common.js',
      './src/es5/**/*.js',
      'node_modules/gl-matrix/src/gl-matrix/common.js',
      'node_modules/gl-matrix/src/gl-matrix/mat3.js',
      'node_modules/gl-matrix/src/gl-matrix/mat4.js',
      'node_modules/gl-matrix/src/gl-matrix/vec4.js',
      'node_modules/gl-matrix/src/gl-matrix/vec3.js',
      './src/outro.js'])
    .pipe(concat('mogl.js'))
    .pipe(gulp.dest('./dist/'));

});


gulp.task('build', function () {
  runSequence('6to5', 'concat');
});

gulp.task('livereload', function () {

  livereload.listen();

  gulp.watch('./dist/*.js', function () {
    gulp.src('./dist/*.js')
      .pipe(livereload());
  });

});