"use strict"

const gulp = require("gulp")
const tsc = require("gulp-typescript")
const sourcemaps = require("gulp-sourcemaps")
const del = require("del")

gulp.task("clean", () => del(["lib"]))

const tstProject = tsc.createProject("tsconfig.json",
  { module: "commonjs", typescript: require("typescript") })

gulp.task("build-src", () => gulp.src(["src/**/*.ts"])
  .pipe(sourcemaps.init())
  .pipe(tstProject())
  .on("error", (_) => {process.exit(1)})
  .js.pipe(sourcemaps.write(".", { sourceRoot: (file) => file.cwd + "/src" }))
  .pipe(gulp.dest("lib/"))
)

const tsDtsProject = tsc.createProject("tsconfig.json", {
  declaration: true,
  noResolve: false,
  typescript: require("typescript")
})

gulp.task("build-dts", () => gulp.src(["src/**/*.ts"])
  .pipe(tsDtsProject())
  .on("error", (_) => {process.exit(1)})
  .dts.pipe(gulp.dest("lib"))
)

gulp.task("build",
  gulp.series("clean",
    gulp.parallel(
      "build-src",
      "build-dts"
    )
  )
)

gulp.task(
  "default",
  gulp.series("build")
)
