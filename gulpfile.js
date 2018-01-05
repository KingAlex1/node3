const gulp = require('gulp');
const pug = require('gulp-pug');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const minifyCss = require('gulp-csso');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const del = require('del');
const runSequence = require('run-sequence');

/* ------ Конфигурация и настройка сборки  -------- */

const vendorJs = [
  'node_modules/jquery/dist/jquery.js',
  'app/libs/jquery.bpopup.js',
  'node_modules/qtip2/dist/jquery.qtip.js'
];

const mainJs = [
  'app/js/login.js',
  'app/js/add_project.js',
  'app/js/validation.js',
  'app/js/contact_me.js'
];

const vendorCss = [
  'node_modules/normalize.css/normalize.css',
  'node_modules/qtip2/dist/jquery.qtip.css'
];

const mainCss = [
  'app/css/about_me_page.css',
  'app/css/my_work_page.css',
  'app/css/contact_me.css',
  'app/css/main.css',
  'app/css/modal.css',
  'app/css/form_elements.css',
  'app/css/login.css'
];

// ====================================================
//============== Локальная разработка APP

//  Компилируем Pug в html
gulp.task('pug', function() {
  return gulp
    .src('app/templates/pages/*.pug')
    .pipe(pug({ pretty: true }))
    .on(
      'error',
      notify.onError(function(error) {
        return { title: 'Pug', message: error.message };
      })
    )
    .pipe(gulp.dest('dist/'));
});

// перенос картинок
gulp.task('images', function() {
  return gulp.src('app/img/**/*.{png,svg,jpg}').pipe(gulp.dest('dist/img/'));
});

// перенос наших шрифтов
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*.*').pipe(gulp.dest('dist/fonts'));
});

// перенос вспомогательных файлов
gulp.task('support', function() {
  return gulp.src('app/*.*').pipe(gulp.dest('dist/'));
});

// Обьединение файлов стилей из папки app/css/ и перенос в папку dist/css
gulp.task('styles', function() {
  return gulp
    .src(mainCss)
    .pipe(
      plumber({
        errorHandler: notify.onError(function(err) {
          return { title: 'Style', message: err.message };
        })
      })
    )
    .pipe(autoprefixer('last 2 versions'))
    .pipe(concat('main.min.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest('dist/css/'))
    .pipe(browserSync.stream());
});

//Модули javascript. С минификацией и переносом
gulp.task('build:js', function() {
  return gulp
    .src(mainJs)
    .pipe(
      plumber({
        errorHandler: notify.onError(function(err) {
          return { title: 'javaScript', message: err.message };
        })
      })
    )
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

/* -------- Объединение всех подключаемых плагинов в один файл -------- */
gulp.task('vendor:js', function() {
  return gulp
    .src(vendorJs)
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});
/* -------- Объединение всех стилей подключаемых плагинов в один файл -------- */
gulp.task('vendor:css', function() {
  return gulp
    .src(vendorCss)
    .pipe(concat('vendor.min.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest('dist/css/'));
});

// Запускаем локальный сервер (только после компиляции jade)
gulp.task(
  'browser-sync',
  [
    'pug',
    'styles',
    'images',
    'build:js',
    'vendor:js',
    'vendor:css',
    'fonts',
    'support'
  ],
  function() {
    browserSync.init({
      server: {
        baseDir: './dist'
      }
    });
    // наблюдаем и обновляем страничку
    browserSync.watch(['./dist/**/*.*', '!**/*.css'], browserSync.reload);
  }
);

gulp.task('watch', function() {
  gulp.watch('app/templates/**/*.pug', ['pug']);
  gulp.watch('app/css/**/*.css', ['styles']);
  gulp.watch('app/js/**/*.js', ['build:js']);
  gulp.watch('app/img/**/*.*', ['images']);
});

gulp.task('default', ['browser-sync', 'watch']);

// Очистка папки dist
gulp.task('clean:dist', function() {
  return del(['dist'], { force: true }).then(paths => {
    console.log('Deleted files and folders: in dist');
  });
});

// ====================================================
//================= Сборка SERVER для EXPRESS

// Очистка папки
gulp.task('clean:server', function() {
  return del(['server'], { force: true }).then(paths => {
    console.log('Deleted files and folders: in server');
  });
});

// перенос вспомогательных файлов
gulp.task('move:support', function() {
  return gulp.src('app/*.*').pipe(gulp.dest('server/public/'));
});

// перенос статических ресурсов
gulp.task(
  'move:assets',
  [
    'styles',
    'images',
    'build:js',
    'vendor:js',
    'vendor:css',
    'fonts',
    'move:support'
  ],
  function() {
    return gulp
      .src(['dist/**/*.*', '!dist/*.html'])
      .pipe(gulp.dest('server/public/'));
  }
);

// перенос шаблонов pug
gulp.task('move:pug', function() {
  return gulp.src('app/templates/**/*.*').pipe(gulp.dest('server/views/'));
});

// Выполнить билд проекта
gulp.task('build', function(callback) {
  runSequence(['clean:server'], ['move:assets', 'move:pug'], callback);
});
