var gulp = require("gulp");
var path = require('path');
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var styledocco = require('gulp-styledocco');
var uglify = require("gulp-uglify");
var browser = require("browser-sync");
var plumber = require("gulp-plumber");
// JSONファイルの読み込みに使用
var fs = require('fs');
var ejs = require("gulp-ejs");
var concat = require('gulp-concat');

//option
var paths = {
  srcDir : 'src',
  dstDir : 'prod'
}

gulp.task("server", function() {
    browser({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task("bsReload",function(){
  browser.reload()
});

gulp.task("sass", function() {
    gulp.src("scss/*.scss")
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest("public/css"))
        .pipe(browser.reload({stream:true}))
});

//minify
gulp.task("js", function() {
    gulp.src(["js/*.js"])
        .pipe(plumber())
        .pipe(uglify())
        .pipe(gulp.dest("./public/js"))
        .pipe(browser.reload({stream:true}));
});


gulp.task("default",['server'], function() {
    gulp.watch(["public/**/*.html"],["bsReload"]);
    gulp.watch(["scss/**/*.scss"],["sass"]);
    gulp.watch(["js/*.js"],["js"]);
});


