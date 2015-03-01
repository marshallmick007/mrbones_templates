'use strict';

var gulp = require('gulp');

gulp.task('watch' ,function () {
  gulp.watch('assets/sass/**/*.scss', ['styles']);
  gulp.watch('assets/js/**/*.js', ['scripts']);
  gulp.watch('assets/images/**/*', ['images']);
  //gulp.watch('bower.json', ['wiredep']);
});

