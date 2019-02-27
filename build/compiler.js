const gulp = require('gulp');
const path = require('path');
const less = require('gulp-less');
const babel = require('gulp-babel');
const insert = require('gulp-insert');
const rename = require('gulp-rename');
const cssmin = require('gulp-clean-css');
const postcss = require('gulp-postcss');

const isProduction = process.env.NODE_ENV === 'production';
const src = path.join(__dirname, '../src');
const dist = path.join(__dirname, isProduction ? '../dist' : '../demo/dist');
const ext = ['ts', 'less', 'json', 'wxml', 'wxs'];

function copy(ext) {
  return gulp.src([src + '/**/*.' + ext]).pipe(gulp.dest(dist));
}

gulp.task('compile-less', () => {
  return gulp
    .src([src + '/**/*.less'])
    .pipe(less())
    .pipe(postcss())
    .pipe(cssmin())
    .pipe(insert.transform((contents, file) => {
      // 为src下每个less文件执行这个回调函数
      // path.sep: 平台的文件路径分隔符，'\\' 或 '/'
      // 该回调函数的具体作用是为src/packages下的每个文件都引入common/index.wxss
      if (file.path.includes('src' + path.sep + 'packages')) {
        contents = `@import '../../common/index.wxss';` + contents;
      }
      return contents;
    }))
    .pipe(
      rename(path => {
        path.extname = '.wxss';
      })
    )
    .pipe(gulp.dest(dist));
});

gulp.task('compile-ts', () =>
  gulp
    .src([src + '/**/*.ts'])
    .pipe(babel())
    .on('error', (err) => {
      console.log(err);
    })
    .pipe(gulp.dest(dist))
);
gulp.task('compile-wxs', () => copy('wxs'));
gulp.task('compile-json', () => copy('json'));
gulp.task('compile-wxml', () => copy('wxml'));
gulp.task('build', ext.map(ext => 'compile-' + ext));
gulp.start('build');

if (!isProduction) {
  // 非生产模式下，改动src下的任意文件，都会触发compile-ext的重新构建
  ext.forEach(ext => {
    gulp.watch(src + '/**/*.' + ext, ['compile-' + ext]);
  });
}
