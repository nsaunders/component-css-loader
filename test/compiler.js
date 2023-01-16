import path from "path";
import webpack from "webpack";
import { createFsFromVolume, Volume } from "memfs";

export default (fixture, options = {}) => {
  const compiler = webpack({
    context: __dirname,
    entry: `./${fixture.replace(/\.json$/, ".js")}!=!raw-loader!${path.resolve(
      __dirname,
      "../src/loader.js",
    )}?${JSON.stringify(options)}!./fixtures/${fixture}`,
    output: {
      path: path.resolve(__dirname),
      filename: "bundle.js",
    },
  });

  compiler.outputFileSystem = createFsFromVolume(new Volume());
  compiler.outputFileSystem.join = path.join.bind(path);

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }

      if (stats.hasErrors()) {
        return reject(stats.toJson().errors);
      }

      return resolve(stats);
    });
  });
};
