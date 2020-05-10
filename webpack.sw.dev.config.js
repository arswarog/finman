// PROD Webpack configuration used to build the service worker

const path = require("path");

const webpackDevConfig = require("./webpack.sw.config");

const webBuildTargetFolder = path.join(__dirname, "public");

module.exports = Object.assign({}, webpackDevConfig, {
    output: {
        ...webpackDevConfig.output,
        path: webBuildTargetFolder,
    },
    watch: true
});
