"use strict";

// Include gulp
const gulp = require('gulp');

// Include plugins
const babel  = require('gulp-babel');
const jshint = require('gulp-jshint');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

gulp.task('babel', () => {
  return gulp.src('chrome/**/*.js')
  .pipe(babel({ presets: ['es2015'] }))
  .pipe(gulp.dest('dist/chrome/'));
});

// Chrome
gulp.task('chrome', () => {
  return gulp.src('chrome/manifest.json')
  .pipe(gulp.dest('dist/chrome'));
});

// Lint task
gulp.task('lint', function() {
  return gulp.src('js/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

// Concatenate & minify JavaScript
gulp.task('scripts', function() {
  return gulp.src('libs/**/*.js')
  .pipe(concat('all.js'))
  .pipe(gulp.dest('dist'))
  .pipe(rename('all.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('dist'));
});

// Watch files for changes
gulp.task('watch', function() {
  gulp.watch(['libs/**/*.js', 'chrome/**/*.js'], ['lint', 'scripts']);
});

// Default Task
gulp.task('default', ['lint', 'babel', 'chrome', 'scripts', 'watch']);
