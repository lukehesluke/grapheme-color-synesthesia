var fs = require('fs')
var gulp = require('gulp')
var browserify = require('browserify')
var babelify = require('babelify')
var runSequence = require('run-sequence')

var build = function(isDev) {
  return function() {
    return browserify({debug: isDev})
     .transform(babelify)
     .require('./src/contentScript.js', {entry: true})
     .bundle()
     .on('error', function(err) {
       console.error('Error:', err.message)
     })
     .pipe(fs.createWriteStream('./dist/contentScript.js'))
  }
}

var justWatch = function() {
  return gulp.watch('./src/**/*.js', ['build-dev'])
}

var watchAndBuild = function(cb) {
  runSequence(
    'build-dev',
    'just-watch',
    cb
  )
}

gulp.task('build-dev', build(true))
gulp.task('just-watch', justWatch)
gulp.task('dev', watchAndBuild)

gulp.task('prod', build(false))

gulp.task('default', ['dev'])
