const gulp = require('gulp');
const eslint = require('gulp-eslint');

const lintFiles = ['**/*.js', '!node_modules/**', '!coverage/**'];

gulp.task('lint', () => {
  return gulp.src(lintFiles)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
