
var gulp = require('gulp')
var bump = require('gulp-bump')

// Basic usage:
// Will patch the version
gulp.task('bump', function () {
  gulp.src('./package.json')
    .pipe(bump())
    .pipe(gulp.dest('./'))
})

