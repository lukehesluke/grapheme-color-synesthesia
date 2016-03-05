var fs = require('fs')
var gulp = require('gulp')
var browserify = require('browserify')
var babelify = require('babelify')
var runSequence = require('run-sequence')

var PATHS = {
  js: {
    src: './src/contentScript.js',
    dist: './dist/contentScript.js'
  }
}

var build = function(isDev) {
  return function() {
    return browserify({debug: isDev})
     .transform(babelify)
     .require(PATHS.js.src, {entry: true})
     .bundle()
     .on('error', function(err) {
       console.error('Error:', err.message)
     })
     .pipe(fs.createWriteStream(PATHS.js.dist))
  }
}

var justWatch = function() {
  return gulp.watch(PATHS.js.src, ['build-dev'])
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
