const gulp = require("gulp");
const cleanCSS = require("gulp-clean-css");
const htmlmin = require("gulp-htmlmin");
const htmlclean = require("gulp-htmlclean");
//tester
var uglifyjs = require("terser");
var composer = require("gulp-uglify/composer");
var pump = require("pump");
var minify = composer(uglifyjs, console);
const workbox = require("workbox-build");

//css
gulp.task("minify-css", () => {
  return gulp
    .src("./public/**/*.css")
    .pipe(
      cleanCSS({
        compatibility: "ie11",
      })
    )
    .pipe(gulp.dest("./public"));
});

// 压缩 public 目录内 html
gulp.task("minify-html", function (done) {
  return gulp
    .src("./public/**/*.html")
    .pipe(htmlclean())
    .pipe(
      htmlmin({
        removeComments: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      })
    )
    .pipe(gulp.dest("./public"));
  done();
});

//minify js tester
gulp.task("compress", function (cb) {
  var options = {};
  pump(
    [
      gulp.src(["./public/**/*.js", "!./public/**/*.min.js"]),
      minify(options),
      gulp.dest("./public"),
    ],
    cb
  );
});

//pwa
gulp.task("generate-service-worker", () => {
  return workbox.injectManifest({
    swSrc: "./sw-template.js",
    swDest: "./public/sw.js",
    globDirectory: "./public",
    globPatterns: ["**/*.{html,css,js,json,woff2}"],
    modifyURLPrefix: {
      "": "./",
    },
  });
});

gulp.task(
  "default",
  gulp.series(
    "generate-service-worker",
    gulp.parallel("minify-css", "compress", "minify-html")
  ),
  function () {
    console.log("----------gulp Finished----------");
  }
);
