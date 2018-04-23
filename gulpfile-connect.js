

const gulp = require("gulp");  

const autoprefixer = require('gulp-autoprefixer');

const babel = require('gulp-babel');

const webserver = require('gulp-webserver');

const connect = require('gulp-connect');

const uglify = require('gulp-uglify');

const cssmin = require('gulp-minify-css');

const imagemin = require('gulp-imagemin');

const pngquant = require('imagemin-pngquant');

const rename = require("gulp-rename");

const htmlmin = require('gulp-htmlmin');

/* 开启本地服务，浏览器自动刷新 */
gulp.task('server',function(){
    connect.server({
        root:'turntable',  //以谁为服务器根目录,监听原来文件夹，要是监听打包后的文件夹浏览器刷新会延迟
        port:8888,  // 端口号 
        livereload: true
    });
})
 
/* es6编译 */
gulp.task('es6', () =>
    gulp.src('turntable/js/*.js')
        .pipe(babel({
            presets: ['env','stage-1','stage-2','stage-3'],/* 暂时编译出来的es7有问题，不建议使用ansyc和await */
            // plugins: ['transform-runtime']
        }))
        .pipe(uglify())
        // .pipe(rename({suffix: '.min'})) 
        .pipe(gulp.dest('dist/js'))
        .pipe(connect.reload())
)

/* html生成 */
gulp.task('html', () =>
    gulp.src('turntable/html/turntable.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(rename("index.min.html"))/* 重新命名 */
        .pipe(gulp.dest('dist/html'))
        .pipe(connect.reload())
)

/* css生成 */
gulp.task('css', () =>
    gulp.src('turntable/css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            remove:true //是否去掉不必要的前缀 默认：true 
        }))
        .pipe(cssmin())
        // .pipe(rename({suffix: '.min'})) 
        .pipe(gulp.dest('dist/css'))
        .pipe(connect.reload())
)

/* 生成图片 */
gulp.task('testImagemin', function () {
    gulp.src('turntable/imgs/*.{png,jpg,gif,ico}')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
            use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        }))
        .pipe(gulp.dest('dist/imgs'))
        .pipe(connect.reload());
});


/* 开启watch监听 */
gulp.task('watch', function () {
    gulp.watch('./turntable/html/turntable.html', ['html']);
    gulp.watch('./turntable/css/*.css', ['css']);
    gulp.watch('./turntable/js/*.js', ['es6']);
    gulp.watch('./turntable/imgs/*.{png,jpg,gif,ico}', ['testImagemin']);
});


/* 添加自动打开浏览器，实现热更新 */
/* gulp.task('webserver', function() {
    gulp.src("dist/")
      .pipe(webserver({
        livereload: true,
        host:"localhost",
        directoryListing: true,
        port:3000,
        open: true,
        fallback: 'dist/'
      }));
  }); */


/* 默认打开gulp */
gulp.task('default', ['server','watch','html','css','es6','testImagemin'])




