const gulp = require('gulp');
const loadPlugins = require('gulp-load-plugins');
const plugins = loadPlugins(
  {
    rename: {
      'gulp-version-number': 'version'
    }
  }
);
const browserSync = require('browser-sync').create();


gulp.task('clean', () => {
  return gulp.src('./build/css/style.css')
    .pipe(plugins.purifycss(['./build/*.html']))
    .pipe(gulp.dest('build/css'))
})

gulp.task('minify', () => {
  return gulp.src('./build/css/style.css')
    .pipe(plugins.cssmin())
    .pipe(gulp.dest('build/css'))
})


gulp.task('js:prod', () => {
  return gulp.src('./src/js/*')
    .pipe(plugins.babel({
      presets: ['env']
    }))
    .pipe(plugins.minify({
      ext:{
          src:'-debug.js',
          min:'.js'
      }
  }))
    .pipe(gulp.dest('./build/js'))
})

gulp.task('image:optimize', () => {
  return gulp.src(['./src/img/gallery/*', './src/img/thumb/*'])
    .pipe(plugins.imagemin())
    .pipe(gulp.dest('./build/img/gallery'))
    .pipe( gulp.dest('./build/img/thumb'))
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


gulp.task('build', plugins.sequence(['image:optimize', 'minHtml:prod', 'gh-page-domain'], 'assets_versions:prod', 'clean', 'minify'))

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
