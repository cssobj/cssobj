const f = require('util').format
const fs = require('fs')
const exec = require('child_process').exec
const gulp = require('gulp')
const bump = require('gulp-bump')

// Basic usage:
// Will patch the version
gulp.task('bump', () => {
  gulp.src('./package.json')
    .pipe(bump())
    .pipe(gulp.dest('./'))
})

gulp.task('tag', () => {
  const version = JSON.parse(fs.readFileSync('./package.json', 'utf8')).version
  exec(
    f(`git tag '%s' && git push --tags`, version),
    err => console.log(err ? err : f('version "%s" published successfully.', version))
  )
})
