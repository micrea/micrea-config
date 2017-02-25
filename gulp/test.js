const gulp = require('gulp');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');
const util = require('gulp-util');

const sourceFiles = ['**/*.js', '!node_modules/**/*.js', '!**/*.test.js', '!gulpfile.js', '!gulp/**/*.js'];
const testFiles = ['**/*.test.js'];

const options = {
  reporter: 'spec',
  timeout: 15000,
};

gulp.task('pre-test', () => {
  return gulp.src(sourceFiles)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], () => {
  process.env.NODE_ENV = 'test';

  return gulp.src(testFiles, {read: false})
    .pipe(mocha(options))
    .pipe(istanbul.writeReports())
    .pipe(istanbul.enforceThresholds({thresholds: {global: 90}}))
    .on('error', util.log);
});
