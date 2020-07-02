// PROD Webpack configuration used to build the service worker

const path = require("path");

const webpackDevConfig = require("./webpack.sw.config");

const webBuildTargetFolder = path.join(__dirname, "build");

module.exports = Object.assign({}, webpackDevConfig, {
    devtool: 'inline-source-map',
    output: {
        ...webpackDevConfig.output,
        path: webBuildTargetFolder,
    },
    watch: true
});
