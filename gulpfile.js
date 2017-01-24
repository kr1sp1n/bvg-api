const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint');

gulp.task('default', () => {});

gulp.task('lint', () => {
  return gulp
    .src(['!node_modules/**/*', './**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('develop', () => {
  return nodemon({
    script: 'index.js',
    ext: 'js',
  })
  .on('change', ['lint'])
  .on('restart', () => {
    console.log('restarted!'); // eslint-disable-line
  });
});
