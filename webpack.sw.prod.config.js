// PROD Webpack configuration used to build the service worker

const path = require("path");

const webpackDevConfig = require("./webpack.sw.config");

const webBuildTargetFolder = path.join(__dirname, "build");

module.exports = Object.assign({}, webpackDevConfig, {
    mode: "production",
    output: {
        ...webpackDevConfig.output,
        path: webBuildTargetFolder,
    },
});
