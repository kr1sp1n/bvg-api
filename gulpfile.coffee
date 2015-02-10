# file: gulpfile.coffee

gulp = require 'gulp'
nodemon = require 'gulp-nodemon'
coffeelint = require 'gulp-coffeelint'

gulp.task 'default', ->

gulp.task 'lint', ->
  gulp
    .src ['!node_modules/**/*', './**/*.coffee']
    .pipe coffeelint()
    .pipe coffeelint.reporter()

gulp.task 'develop', ->
  nodemon(
    script: 'index.coffee'
    ext: 'coffee'
    # ignore: ['ignored.js']
  )
  .on 'change', ['lint']
  .on 'restart', ->
      console.log 'restarted!'
