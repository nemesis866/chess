// Importamos las dependencias
var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	gutil = require('gulp-util'),
	minifyCss = require('gulp-minify-css'),
	concat = require('gulp-concat'),
	connect = require('gulp-connect'),
	historyApiFallback = require('connect-history-api-fallback'),
	inject = require('gulp-inject'),
	wiredep = require('wiredep').stream,
	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish');

// Creamos objeto con las rutas utilizadas en gulfile.js
var paths = {
	html: './app/**/*.html',
	js: './app/scripts/**/*.js',
	jsMin: './app/min/js/**/*.js',
	css: './app/styles/**/*.css',
	cssMin: './app/min/css/**/*.css',
	bower: './bower.json'
};

// Comprime los archivos css
gulp.task('minify-css', function() {
  return gulp.src(paths.css)
    .pipe(minifyCss({
    	compatibility: 'ie8'
    }))
    .pipe(gulp.dest('./app/min/css'));
});

// Comprime los archivos javascript
gulp.task('minify-js', function() {
	gulp.src(paths.js)
	.pipe(concat('build.js'))
	.pipe(uglify().on('error', gutil.log))
	.pipe(gulp.dest('./app/min/js'))
});

// Creamos el servidor con la opcion livereload activada y con
// el historial activado para app SPA
gulp.task('server', function (){
	connect.server({
		root: './app',
		port: 3000,
		livereload: true,
		middleware: function (connect, opt){
			return [historyApiFallback({})];
		}
	});
});

// Recargamos el navegador cuando hay cambios en el html
gulp.task('html', function (){
	gulp.src(paths.html)
	.pipe(connect.reload());
});

// Inyectamos los archivos propios (js y css) al index.html
gulp.task('inject', ['wiredep'], function (){
	var sources = gulp.src([paths.jsMin, paths.cssMin]);

	return gulp.src('index.html', {
		cwd: './app'
	})
	.pipe(inject(sources, {
		read: false,
		ignorePath: '/app'
	}))
	.pipe(gulp.dest('./app'));
});

// Inyectamos las dependencias que instalemos con bower
gulp.task('wiredep', function (){
	return gulp.src('index.html', {
		cwd: './app'
	})
	.pipe(wiredep({
		directory: './app/vendor',
		read: false,
		onError: function (err){
			console.log(err.code);
		}
	}))
	.pipe(gulp.dest('./app'));
});

// Mostramos los errores javascript en consola
gulp.task('lint', function (){
	return gulp.src(paths.js)
	.pipe(jshint('.jshintrc'))
	.pipe(jshint.reporter('jshint-stylish'))
	.pipe(jshint.reporter('fail'));
});

// Dejamos en escucha las siguientes tareas - modo developer
gulp.task('watch', function (){
	gulp.watch([paths.html], ['html']);
	gulp.watch([paths.js], ['inject', 'minify-js', 'lint']);
	gulp.watch(['./gulpfile.js'], ['lint']);
	gulp.watch([paths.css], ['inject', 'minify-css']);
	gulp.watch([paths.bower], ['wiredep']);
});

// Tareas watch para modo servidor
gulp.task('server-only', ['server', 'html'], function (){
	gulp.watch([paths.html], ['html']);
});

// Tarea por defecto
gulp.task('default', ['server', 'minify-js', 'minify-css', 'inject', 'watch']);