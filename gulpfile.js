'use strict';

const del = require('del');
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const server = require('browser-sync').create();
const minimize = require('gulp-csso');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const rollup = require('gulp-better-rollup');
const babel = require('gulp-babel');

gulp.task('style', function () {
	gulp.src('css/style.css')
	.pipe(plumber())
	.pipe(postcss([
		autoprefixer({
			browsers: ['last 2 version']
		}),
		]))
	.pipe(gulp.dest('build/css'))
	.pipe(server.stream())
	.pipe(minimize())
	.pipe(rename('style.min.css'))
	.pipe(gulp.dest('build/css'));
});

gulp.task('copy-html', function () {
	return gulp.src('*.html')
	.pipe(gulp.dest('build'))
	.pipe(server.stream());
});


gulp.task('scripts', function(){
	gulp.src('js/main.js')
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(rollup({}, 'iife'))
	.pipe(babel({
		presets: ['env']
	}))
	.pipe(sourcemaps.write(''))
	.pipe(gulp.dest('build/js/'));
});

gulp.task('copy', ['scripts', 'style'], function () {
	return gulp.src([
		'fonts/**/*.{woff,woff2, ttf}',
		], {base: '.'})
	.pipe(gulp.dest('build/fonts'));
});

gulp.task('clean', function () {
	return del('build');
});

gulp.task('js-watch', ['scripts'], function (done) {
	server.reload();
	done();
});

gulp.task('serve', ['assemble'], function () {
	server.init({
		server: './build',
		notify: false,
		open: true,
		port: 3502,
		ui: false
	});

	gulp.watch('css/**/*.css', ['style']);
	gulp.watch('*.html').on('change', (e) => {
		if (e.type !== 'deleted') {
			gulp.start('copy-html');
		}
	});
	gulp.watch('js/**/*.js', ['js-watch']);
});

gulp.task('assemble', ['clean'], function () {
	gulp.start('copy', 'style');
});

gulp.task('build', ['assemble']);