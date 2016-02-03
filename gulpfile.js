"use strict";

const gulp = require('gulp'); //build system
const webpack = require('webpack'); //handles dependencies
const babel = require('babel-loader'); //transpiles es6/jsx to es5
const source = require('vinyl-source-stream'); //converts reatable stream from webpack into the gulp compatible stream
const sass = require('gulp-sass'); //css preprocessor
const notifier = require('node-notifier'); //desktop notifications on error
const browserSync = require('browser-sync'); //boots up localhost and refreshes when changes are made
const gulpCC = require('gulp-closurecompiler'); //minifies js
const minifyCss = require('gulp-minify-css'); // crunch css
const del = require('del'); // remove files
const runSequence = require('run-sequence'); // run tasks in order
const flatten = require('gulp-flatten'); // removes folder structure from wilcard searches
const historyApiFallback = require('connect-history-api-fallback'); // necessary to have browsersync handle routing urls

/* variables for use in gulp tasks */
const RAW_PATH = './app/';
const COMPONENT_PATH = './app/js/display/';
const RAW_IMG_PATH = RAW_PATH + 'images/';
const RAW_FONTS_PATH = RAW_PATH + 'fonts/';
const RAW_JS_PATH = RAW_PATH + 'js/';
const RAW_SCSS_PATH = RAW_PATH + 'scss/';
const SCRIPTS_FILENAME = 'all.js';

var DEV_PATH = './dev/'
var DIST_PATH = './www/'
var destPath;
var destImgPath;
var destJsPath;
var destCssPath;
var destFontsPath;
 
gulp.task('buildScripts', function (callback) {
  webpack({
    devtool: 'source-map',
    entry: [RAW_JS_PATH + 'index.js'],
    output: {
      path: destJsPath,
      filename: SCRIPTS_FILENAME
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          loader: 'babel',
          query: {
            presets: [
              'react',
              'es2015',
              'stage-0',
            ]
          }
        }
      ]
    },
    resolve: {
      modulesDirectories: ['./node_modules', RAW_JS_PATH]
    }
  }, function(err, stats) {
      if(err) {
        notifier.notify({title:'ERROR', message:'JavaScript'});
        console.log('ERROR:', err.message);
      }
      if(callback)
        callback();
  });
});
gulp.task('buildGlobalStyles', function() {
  return gulp.src(RAW_SCSS_PATH + '**/*.scss')
    .pipe(sass().on('error', function(err){
      notifier.notify({title:'ERROR', message:'CSS'});
      sass.logError.bind(this)(err);
    }))
    .pipe(gulp.dest(destCssPath));
});
gulp.task('buildComponentStyles', function() {
  return gulp.src(COMPONENT_PATH + '**/*.scss')
  .pipe(sass())
  .pipe(gulp.dest(COMPONENT_PATH));
});
gulp.task('minify', function(){
  gulp.src(destJsPath + SCRIPTS_FILENAME)
    .pipe(
      gulpCC({fileName: SCRIPTS_FILENAME})
    )
    .pipe(gulp.dest(destJsPath));
  gulp.src(destCssPath + '*.css')
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest(destCssPath));
  return true;
});

/* basic server for development */
gulp.task('devServer', function() {
  browserSync.init([DEV_PATH + '**/*'], {
    port: 8001,
    server: {
      baseDir: DEV_PATH,
      middleware: [ historyApiFallback() ]
    }
  });
});

/* basic server to check that dist worked properly */
gulp.task('distServer', function() {
  browserSync.init([DIST_PATH + '**/*'], {
    port: 8001,
    server: {
      baseDir: DIST_PATH,
      middleware: [ historyApiFallback() ]
    }
  });
});

/* copy images from App to www */
gulp.task('copyImages', function() {
  return gulp.src(RAW_IMG_PATH + '**/*')
    .pipe(gulp.dest(destImgPath));
});

gulp.task('updateIndexFile', function() {
  gulp.src(RAW_PATH + 'index.html')
    .pipe(gulp.dest(destPath));
});

/* Image tasks */
gulp.task('cleanImages', function() {
  del([
    destImgPath + '**/*'
  ]);
});

/* bring component images into one image folder inside "App" */
gulp.task('gatherComponentImages', function() {
  return gulp.src(COMPONENT_PATH + '**/*.{gif,jpg,png,svg}')
    .pipe(flatten())
    .pipe(gulp.dest(RAW_IMG_PATH));
});

/* Watchers */
gulp.task('watch', function() {
  gulp.watch([RAW_SCSS_PATH + '**/*.scss'],['buildGlobalStyles']);
  gulp.watch([COMPONENT_PATH + '**/*.scss'],['buildComponentStyles']);
  gulp.watch([RAW_JS_PATH + '**/*.js', RAW_JS_PATH + '**/*.css'],['buildScripts']);
  gulp.watch([RAW_IMG_PATH + '**/*'],['copyImages']);
  gulp.watch([COMPONENT_PATH + '**/*.{gif,jpg,png,svg}'],['gatherComponentImages']);
});

/* work on project */
gulp.task('dev', function () {
  destPath = DEV_PATH;
  destImgPath = DEV_PATH + 'images/';
  destJsPath = DEV_PATH + 'js/';
  destCssPath = DEV_PATH + 'css/';
  destFontsPath = DEV_PATH + 'fonts/';
  runSequence('updateIndexFile', 'buildComponentStyles', 'buildGlobalStyles', 'gatherComponentImages', 'cleanImages', 'buildScripts', 'copyImages', 'devServer', 'watch');
});

/* prepare project for production evironemnt */
gulp.task('dist', function () {
  destPath = DIST_PATH;
  destImgPath = DIST_PATH + 'images/';
  destJsPath = DIST_PATH + 'js/';
  destCssPath = DIST_PATH + 'css/';
  destFontsPath = DIST_PATH + 'fonts/';
  runSequence('updateIndexFile', 'buildComponentStyles', 'buildGlobalStyles', 'gatherComponentImages', 'cleanImages', 'buildScripts', 'copyImages', 'minify');
});

/* Run 'dev' task as default gulp task */
gulp.task('default', function () {
  gulp.tasks.dev.fn();
});

