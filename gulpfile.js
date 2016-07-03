"use strict";

// Include gulp
const gulp = require('gulp');

// Include plugins
const babel      = require('gulp-babel');
const jshint     = require('gulp-jshint');
const concat     = require('gulp-concat');
const uglify     = require('gulp-uglify');
const rename     = require('gulp-rename');
const sass       = require('gulp-sass');
const source     = require('vinyl-source-stream');
const buffer     = require('vinyl-buffer');
const browserify = require('browserify');

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

gulp.task('sass', function () {
  return gulp.src('sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('css'));
});

// Apply Browserify, concatenate & minify JavaScript
gulp.task('scripts', function() {
  return browserify({entries: ['app/app.js', 'app/controllers.js', 'app/services.js']})
  .bundle()
  .pipe(source('dist.js'))
  .pipe(gulp.dest('dist'))
  .pipe(buffer())
  .pipe(babel({ presets: ['es2015'] }))
  .pipe(rename('dist.min.js'))
  .pipe(uglify()).on('error', console.log)
  .pipe(gulp.dest('dist'));
});

// Watch files for changes
gulp.task('watch', function() {
  gulp.watch(['app/**/*.js', 'libs/**/*.js', 'chrome/**/*.js', 'sass/**/*.scss'], ['lint', 'scripts', 'sass']);
});

// Default Task
gulp.task('default', ['lint', 'babel', 'chrome', 'scripts', 'sass', 'watch']);
