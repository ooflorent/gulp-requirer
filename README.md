# gulp-requirer

## Install

```bash
$ npm install --save-dev gulp-requirer
```


## Usage

```js
var gulp = require('gulp');
var requirer = require('gulp-requirer');

gulp.task('default', function () {
  return gulp.src('src/**/*.js')
    .pipe(requirer('all.js', 'boot'))
    .pipe(gulp.dest('dist'));
});
```


### Compression

```js
var gulp = require('gulp');
var requirer = require('gulp-requirer');

gulp.task('default', function () {
  return gulp.src('src/**/*.js')
    .pipe(requirer('all.js', 'boot'))
    .pipe(requirer.compress()) // compress module names
    .pipe(gulp.dest('dist'));
});
```
