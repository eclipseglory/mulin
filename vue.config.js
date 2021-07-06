process.env.VUE_APP_AUTHOR_MANE = "老脸";
process.env.VUE_APP_GITHUB = "https://github.com/eclipseglory/mulin";
process.env.VUE_APP_VERSION = require('./package.json').version;
process.env.VUE_APP_CANVASKIT_PATH = process.env.NODE_ENV === 'production' ? 'https://unpkg.com/canvaskit-wasm@0.26.0/bin/' : 'lib/';
process.env.VUE_APP_FONTS_PATH = process.env.NODE_ENV === 'production' ? 'https://unpkg.com/mulin-default-fonts@0.0.1/fonts/' : 'assets/fonts/';
module.exports = {
    productionSourceMap: false,
    publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].canvaskitPath = process.env.NODE_ENV === 'production' ? 'https://unpkg.com/canvaskit-wasm@0.26.0/bin/' : 'lib/';
                return args
            })
    }
};