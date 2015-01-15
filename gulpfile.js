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

gulp.task('img', function () {
    return gulp.src('./img/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./dist/img/'));
});

gulp.task('simple', function() {
    return gulp.src('./dist/temp/main.css')
        .pipe(uncss({
            html: ['./dist/index.html'],
        ignore: [
                ''
            ]
        }))
        .pipe(cssshrink())
        .pipe(gulp.dest('./dist/finalcss/'));
});

gulp.task('html', function() {
  gulp.src('./*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist'))
});

gulp.task('less', function () {
  gulp.src('./less/**/clean-blog.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./css'));
});

gulp.task('js', function() {
 	gulp.src(['./bower_components/jquery/dist/jquery.min.js', './bower_components/angular/angular.min.js', './bower_components/bootstrap/dist/js/bootstrap.min.js','./js/*.js'])//, '/bower_components/jquery/dist/jquery.min.js'])//gulp.src(['./js/clean-blog.js'])//, './lib/file1.js', './lib/file2.js'])
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js/'))
 });

gulp.task('css', function(){
    var vendorFiles = gulp.src('./bower_components/bootstrap/dist/css/bootstrap.min.css');
    var appFiles = gulp.src('./dist/css/*.css');

    return es.concat(appFiles, vendorFiles)
        .pipe(concat('main.css'))
        .pipe(stripCssComments())
        .pipe(cssshrink())
        .pipe(gulp.dest('./dist/temp/'));
});