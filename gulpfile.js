var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var mainBowerFiles = require('main-bower-files');
var filter = require('gulp-filter');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var es = require('event-stream');
var cssshrink = require('gulp-cssshrink');
var stripCssComments = require('gulp-strip-css-comments');
var htmlmin = require('gulp-htmlmin');
var uncss = require('gulp-uncss');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var runSequence = require('run-sequence');
var clean = require('gulp-clean');

// This will run in this order:
// * build-clean
// * build-scripts and build-styles in parallel
// * build-html
// * Finally call the callback function
gulp.task('default', function (callback){
  runSequence(
              ['img', 'html', 'less', 'js'],
              'css',
              callback);
});

gulp.task('test', function (callback){
  runSequence(
              'default','uncss',
              callback);
});

gulp.task('img', function () {
    return gulp.src('./img/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./dist/img/'));
});

gulp.task('uncss', function() {
    return gulp.src('./dist/temp/main.css')
        .pipe(uncss({
            html: ['./dist/index.html', './dist/about.html' , './dist/contact.html' , './dist/post.html'],
        ignore: [
                '.navbar-custom.is-fixed',
'.navbar-custom.is-fixed .navbar-brand',
'.navbar-custom.is-fixed .navbar-brand:hover,  .navbar-custom.is-fixed .navbar-brand:focus',
'.navbar-custom.is-fixed .nav li a',
'.navbar-custom.is-fixed .nav li a:hover,  .navbar-custom.is-fixed .nav li a:focus',
'.navbar-custom.is-visible',
            ]
        }))
        .pipe(stripCssComments())
        .pipe(cssshrink())
        .pipe(gulp.dest('./dist/temp/'));
});

gulp.task('html', function() {
  gulp.src('./*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist'))
});

gulp.task('less', function () {
  gulp.src('./less/clean-blog.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('js', function() {
 	gulp.src(['./bower_components/jquery/dist/jquery.min.js', './bower_components/angular/angular.min.js', './bower_components/bootstrap/dist/js/bootstrap.min.js','./js/*.js'])
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js/'))
 });

gulp.task('css', function(){
        gulp.src(['./bower_components/bootstrap/dist/css/bootstrap.min.css',
         './dist/css/clean-blog.css'])
        .pipe(concat('main.css'))
        //.pipe(stripCssComments())
        //.pipe(cssshrink())
        .pipe(gulp.dest('./dist/temp/'));
});