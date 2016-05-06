var gulp        = require('gulp');
var jshint      = require('gulp-jshint');
var uglify      = require('gulp-uglify');
var concat      = require('gulp-concat');
// var less        = require('gulp-less');
var minifyCSS   = require('gulp-minify-css');
var prefix      = require('gulp-autoprefixer');

var gutil       = require('gulp-util');

var del         = require('del');
var browserSync = require('browser-sync').create();
var wiredep     = require('wiredep').stream;
var mainBowerFiles = require('main-bower-files');

var nodemon 	= require('gulp-nodemon');

var cached 		= require('gulp-cached');
var remember 	= require('gulp-remember');
var sourcemaps  = require('gulp-sourcemaps');
var combiner    = require('stream-combiner2');
var through     = require('through2');

var eslint 		= require('gulp-eslint');
var babel 		= require('gulp-babel');

var arguments 	= require('yargs').argv;

var isprod = (arguments.env === 'prod');

var noop = function() {
	return through.obj();
};

var dev = function(task) {
	return isprod ? noop() : task;
};

var prod = function(task) {
	return isprod ? task : noop();
};

// var mainBowerFiles = require('main-bower-files');

var testJs = ['app_api/**/*.js',
		'!app_client/lib/*.js',
		'app_client/about/**/*.js',
		'app_client/auth/**/*.js',
		'app_client/common/**/*.js',
		'app_client/contact/**/*.js',
		'app_client/cv/**/*.js',
		'app_client/home/**/*.js',
		'app_client/profile/**/*.js',
		'app_client/projectDetail/**/*.js',
		'app_client/projectList/**/*.js',
		'app_client/app.js',
		'app.js',
		'!public/angular/*.js',
		'public/javascripts/bs-docs-sidebar.js',
		'public/javascripts/validation.js',
		'!public/ngGallery/**/*'
		];

var app_clientJs = ['app_client/app.js',
			'app_client/home/home.controller.js',
			'app_client/projectList/projectList.controller.js',
			'app_client/projectDetail/projectDetail.controller.js',
			'app_client/cv/cv.controller.js',
			'app_client/contact/contact.controller.js',
			'app_client/about/about.controller.js',
			'app_client/profile/profile.controller.js',
			'app_client/auth/login/login.controller.js',
			'app_client/auth/register/register.controller.js',
			'app_client/auth/resetPassword/resetPassword.controller.js',
			'app_client/common/factories/underscore.factory.js',
			'app_client/common/factories/authInterceptor.factory.js',
			'app_client/common/services/authentication.service.js',
			'app_client/common/services/contactData.service.js',
			'app_client/common/services/projectsData.service.js',
			'app_client/common/filters/addHtmlLineBreaks.filter.js',
			'app_client/common/directives/navigation/navigation.controller.js',
			'app_client/common/directives/navigation/navigation.controller.js',
			'app_client/common/directives/navigation/navigation.directive.js',
			'app_client/common/directives/pageHeader/pageHeader.directive.js'
			];

gulp.task('test', function() {
	return gulp.src(testJs /*, {since: gulp.lastRun('test')}*/)
	.pipe(jshint())
	.pipe(jshint.reporter('default'))
	.pipe(jshint.reporter('fail'));
});


gulp.task('scripts',
	gulp.series('test', function scriptsInternal() {
          // var glob = mainBowerFiles('*.js');
          // glob.push('app/scripts/**/*.js');
          return gulp.src(/*glob*/ 
			//only app_client files, because the generated file will be imported into app_client/index.html
			app_clientJs , {	sourcemaps: true /*,
				since: gulp.lastRun('test')*/} )
          .pipe(dev(sourcemaps.init()))
          .pipe(cached('ugly'))
          .pipe(uglify().on('error', gutil.log))
          .pipe(remember('ugly'))
          .pipe(concat('mysite.min.js'))
          //.pipe(dev(sourcemaps.write('.', {sourceRoot: 'js-source'})))
          .pipe(gulp.dest('public/angular'));
      })
	);

gulp.task('styles', function() {
	return gulp.src('public/stylesheets/*' , { since: gulp.lastRun('styles') })
	.pipe(minifyCSS())
	.pipe(prefix())
	.pipe(gulp.dest('dist/styles'));
});

gulp.task('clean', function(done) {
	return del(['dist', 'public/angular']);
});


gulp.task('nodemon', function (cb) {

	var started = false;

	return nodemon({
		script: 'bin/www',
		// watch core server file(s) that require server restart on change
    	//watch: ['app.js']
		// ext: 'js html',
		env: { 'NODE_ENV': 'development' }
	})
	.on('start', function () {
		if(!started) {
			cb();
			started = true;
		}
		
	})
	.on('error', function(err) {
     // Make sure failure causes gulp to exit
     throw err;
 })
});


gulp.task('server',
	gulp.series('nodemon', function bSyncInternal() {

	  // for more browser-sync config options: http://www.browsersync.io/docs/options/
	  browserSync.init({

	    // informs browser-sync to proxy our expressjs app which would run at the following location
	    proxy: 'http://localhost:3000',

	    // informs browser-sync to use the following port for the proxied app
	    // notice that the default port is 3000, which would clash with our expressjs
	    port: 3001,

	    // open the proxied app in chrome
	    browser: ["google chrome"]
	 })
	})
);

// gulp.task('server', function(done) {
// 	if(!isprod) {	
//      bSync({
//           server: {
//                baseDir: ['bin/www']
//           }
//      })
// 	}
//  done();
// });

gulp.task('deps', function() {
	return gulp.src('public/html/**/*.html')
        //.pipe(wiredep())
        .pipe(gulp.dest('dist'));
    });

gulp.task('default',
	gulp.series('clean',
		gulp.parallel('styles', 'scripts'),
		'server',

		function watcher(done) {
		    gulp.watch(['app_api/**/*.js', 'app_client/**/*.js', 'public/**/*.js', 'app.js'], 
		    	gulp.parallel('scripts'));
		    gulp.watch('public/stylesheets/**/*.css', gulp.parallel('styles'));
		    gulp.watch('public/**/*.js', browserSync.reload);
		  })

		//function watcher() {
			//gulp.watch('**/*.*', browserSync.reload
			// if(!isprod) {
			// 	var watcher = gulp.watch(['app_api/**/*.js',
			// 	'app_client/**/*.js',
			// 	'public/**/*.js',
			// 	'app.js',
			// 	], gulp.parallel('scripts'));
			// 	gulp.watch('public/stylesheets/*', gulp.parallel('styles'));
			// 	gulp.watch('**/*.*', browserSync.reload); //TODO remove this, i'm not using bsync anymore
			// }
			//)
		//}
	//)
);
