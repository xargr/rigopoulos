const gulp = require('gulp');
const loadPlugins = require('gulp-load-plugins');
const plugins = loadPlugins(
  {
    rename: {
      'gulp-version-number': 'version'
    }
  }
);

gulp.task('css-tranfer', () => {
  return gulp.src('./src/css/*')
    .pipe(gulp.dest('build/css'))
})



gulp.task('js-tranfer', () => {
  return gulp.src(['./src/js/lightbox.js', './src/js/main.js'])
    .pipe(gulp.dest('./build/js'))
})


gulp.task('image:optimize', () => {
  return gulp.src(['./src/img/gallery/*', './src/img/thumb/*'])
    .pipe(plugins.imagemin())
    .pipe(gulp.dest('./build/img/gallery/'))
    .pipe( gulp.dest('./build/img/thumb/'))
})


gulp.task('image:transfer', () => {
  return gulp.src('./src/images/*')
    .pipe(plugins.imagemin())
    .pipe(gulp.dest('./build/images/'))
})


gulp.task('minHtml:prod', () => {
  return gulp.src('./src/*.html')
    .pipe(plugins.htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./build'))
})

gulp.task('gh-page-domain', () => {
  return gulp.src('./src/CNAME')
    .pipe(gulp.dest('build'))
})


gulp.task('build', plugins.sequence(['image:optimize', 'image:transfer', 'js-tranfer', 'css-tranfer', 'minHtml:prod', 'gh-page-domain'], 'assets_versions:prod'))

gulp.task('assets_versions:prod', () => {
  return gulp.src('./build/*.html')
    .pipe(plugins.version({
        'value' : '%MDS%',
        'append' : {
          'key' : 'v',
          'cover' : 0,
          'to' : ['css', 'js']
        }
      }))
    .pipe(gulp.dest('./build'))
})
