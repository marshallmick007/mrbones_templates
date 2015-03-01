'use strict';

var gulp = require('gulp');
var path = require('path');
var sass = require('gulp-ruby-sass');
var minifyHtml = require('gulp-minify-html');
var ngTemplateCache = require('gulp-angular-templatecache');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'del']
});


var paths = {
  output: {
    js: 'public/js',
    css: 'public/css',
    fonts: 'public/fonts'
  },
  temp: 'tmp',
  assets: {
    js: [
      "assets/js/app.js",
      "assets/js/**/*.module*.js",
      "assets/js/**/*.js"
    ],
    sass: 'assets/sass/',
    images: 'assets/images',
    templates: 'assets/js/**/*.html'
  },
  templateCache: {
    file: 'templates.js',
    options: {
      module: 'app.core',
      root: 'app/',
      standAlone: false,
    }
  },
  vendor: "bower_components"
};


gulp.task('styles', function() {
  return gulp.src(path.join( paths.assets.sass, '/app.scss') )
    .pipe(sass({
      style: 'compressed',
      loadPath: [
        paths.assets.sass,
        'bower_components/toastr/',
        'bower_components/bootstrap-sass-official/assets/stylesheets/'
        //config.bowerDir + '/fontawesome/scss',
      ]
    }))
    .on("error", function (error) {
      console.log( "sass error: " + error.message );
    }) 
    //.pipe(autoprefix('last 2 version'))
    .pipe(gulp.dest( paths.output.css ) ); 
});

gulp.task('scripts', ['scripts:hint', 'scripts:vendor', 'templatecache'], function() {
  /* TODO: Add vendor javascripts here (boostrap, ionic, etc)*/

  var source = [].concat(
    path.join(paths.temp, 'vendor.js'),
    paths.assets.js,
    path.join( paths.temp, "templates.js" )
  );
  return gulp.src( source )
    //.pipe($['6to5']())
    .pipe($.concat('app.js'))
    .pipe($.ngAnnotate({
      add: true,
      single_quotes: true
    }))
    // todo: mangle/minify the javascripts
    .pipe(gulp.dest( paths.output.js ))
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })

});

gulp.task('scripts:vendor', function() {
  return gulp.src( [
    //path.join( paths.vendor, 'lodash/dist/lodash.min.js'),
    //path.join( paths.vendor, 'moment/min/moment.min.js'),
    path.join( paths.vendor, 'jquery/dist/jquery.min.js'),
    path.join( paths.vendor, 'toastr/toastr.min.js'),
    path.join( paths.vendor, 'angular/angular.min.js'),
    path.join( paths.vendor, 'angular-resource/angular-resource.min.js'),
    path.join( paths.vendor, 'angular-ui-router/release/angular-ui-router.min.js'),
    path.join( paths.vendor, 'angular-sanitize/angular-sanitize.min.js'),
    path.join( paths.vendor, 'angular-animate/angular-animate.min.js')
  ])
  .pipe($.concat("vendor.js"))
  .pipe(gulp.dest( paths.temp ) )
});

gulp.task('templatecache', function() {
  return gulp.src( paths.assets.templates )
             .pipe(minifyHtml({
                empty: true
             }))
             .pipe(ngTemplateCache('templates.js', {
                module: 'app.core',
                standalone: false,
                root: 'app/'
              }))
              .pipe(gulp.dest(paths.temp));
});

gulp.task('scripts:hint', function() {
  var config = './.jshintrc';
  return gulp.src( paths.assets.js )
    .pipe($.jshint( config ))
    .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('fonts', function() {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest(paths.output.fonts));
});

gulp.task('images', function () {
  //return gulp.src('src/assets/images/**/*')
  //  .pipe($.imagemin({
  //    optimizationLevel: 3,
  //    progressive: true,
  //    interlaced: true
  //  }))
  //  .pipe(gulp.dest('dist/assets/images/'));
});

gulp.task('misc', function() {

});

gulp.task('clean', function (done) {
  //$.del(['dist/', '.tmp/'], done);
  $.del( paths.output.fonts, done );
});


gulp.task('build', ['styles', 'scripts', 'fonts', 'images', 'misc']);

