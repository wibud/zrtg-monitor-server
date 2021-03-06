// 引入 gulp
var gulp = require('gulp');

// 引入 Plugins
var gutil = require('gulp-util');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var globby = require('globby');
var rimraf = require('gulp-rimraf');
var connect = require('gulp-connect');

// 常量
var SRC = './assets/src';
var BUILD = './assets/build';
var SCRIPTS = SRC + '/p/*/index.js';
var RESOURCE = SRC + '/lib/**/*';
var CSS = SRC + '/p/*/index.less';
var ASSETS = [SRC + '/**/*.less', SRC + '/**/*.js'];
var EXAMPLE_DIST_PATH = [__dirname];

// clean
gulp.task('clean', function(){
    return gulp.src(BUILD, {read: false})
               .pipe(rimraf({force: true}));
});

// js
gulp.task('js', ['clean'],function(){

    var isLogError = false;

    globby([SCRIPTS], function (err, filePaths) {

        if (err) {
          gutil.log.bind(gutil, 'Globby Error');
          return;
        }

        filePaths.forEach(function (filePath) {

            // get page name for build
            var pageNameReg = new RegExp(SRC + '\/p\/(.*)\/');
            var pageName = filePath.match(pageNameReg)[1];

            browserify(filePath)
                .bundle()
                .on('error', function (err) {
                    // ignore react or browserify error
                    if (!isLogError) {
                        gutil.log(err);
                        isLogError = true;
                    }
                })
                .pipe(source('index.js'))
                .pipe(gulp.dest(BUILD + '/' + pageName));
        });
    });
});

// css
gulp.task('css', ['clean'], function(){
    return gulp.src(CSS)
            .pipe(less().on('error', function (err) {
                gutil.log(err);
            }))
            .pipe(autoprefixer())
            .pipe(minifyCSS())
            .pipe(gulp.dest(BUILD));

});

// build
gulp.task('build', ['clean', 'css' ,'js']);

// watch
gulp.task('watch', function(){
    gulp.watch(ASSETS, ['build']);
});

gulp.task('dev', ['watch']);

// default task
gulp.task('default', ['build']);
