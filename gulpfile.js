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

gulp.task('sass:dev', () => {
  return gulp.src('./src/sass/*.scss')
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass.sync().on('error', plugins.sass.logError))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest('./local/css'))
    .pipe(browserSync.stream())
})

gulp.task('sass:prod', () => {
  return gulp.src('./src/sass/*.scss')
    .pipe(plugins.sass.sync().on('error', plugins.sass.logError))
    .pipe(plugins.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./build/css'))
})

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

gulp.task('js:dev', () => {
  return gulp.src('./src/js/*')
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.babel({
        presets: ['env']
    }))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest('./local/js'))
    .pipe(browserSync.stream())
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
  return gulp.src('./src/img/*')
    .pipe(plugins.imagemin())
    .pipe(gulp.dest('./build/img'))
})

gulp.task('minHtml:dev', () => {
  return gulp.src('./src/*.html')
  .pipe(gulp.dest('./local'))
  .pipe(browserSync.stream())
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

gulp.task('default', () => {
  browserSync.init({
    server: {
        baseDir: "local/"
    }
  })

  gulp.watch('./src/sass/*.scss', ['sass:dev']).on('change', browserSync.reload);
  gulp.watch('./src/*.html', ['minHtml:dev']).on('change', browserSync.reload);
  gulp.watch('./src/js/*.js', ['js:dev']).on('change', browserSync.reload);
})

gulp.task('build', plugins.sequence(['sass:prod', 'js:prod', 'image:optimize', 'minHtml:prod', 'gh-page-domain'], 'assets_versions:prod', 'clean', 'minify'))

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
