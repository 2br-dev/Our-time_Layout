const gulp			 = require('gulp');

const gulpSass		 = require('gulp-sass');
const nodeSass		 = require('node-sass');
const sass			 = gulpSass(nodeSass);
const autoprefixer	 = require('gulp-autoprefixer');

const stream		 = require('vinyl-source-stream');
const browserify	 = require('browserify');
const buffer		 = require('gulp-buffer');
const babelify		 = require('babelify');
const uglify		 = require('gulp-uglify');
const browserSync	 = require('browser-sync').init({
	server: {
		baseDir: './release/'
	},
	online: true,
	tunnel: 'test'
});

const include		 = require('gulp-file-include');

gulp.task('sass', () => {
	return gulp.src('./src/scss/**/*.scss')
		.pipe(sass({
			outputStyle: 'compressed'
		}))
		.pipe(autoprefixer())
		.pipe(gulp.dest('./release/css/'))
		.pipe(browserSync.stream())
});

gulp.task('html', () => {
	return gulp.src('./src/html/*.html')
		.pipe(include({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest('./release/'))
		.pipe(browserSync.stream())
});

gulp.task('js', () => {
	return browserify({entries: './src/js/master.js'}).transform(
			babelify, {
				presets: ['@babel/preset-env'],
				comments: false,
				global: true,
				compact: false
			}
		)
		.bundle()
		.pipe(stream('master.js'))
		.pipe(buffer())
		// .pipe(uglify())
		.pipe(gulp.dest('./release/js/'))
		.pipe(browserSync.stream())
})

gulp.task('watch', () => {
	gulp.watch('./src/html/**/*.html', gulp.series('html'));
	gulp.watch('./src/js/**/*.js', gulp.series('js'));
	gulp.watch('./src/scss/**/*.scss', gulp.series('sass'));
})