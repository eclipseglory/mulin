process.env.VUE_APP_AUTHOR_MANE = "老脸";
process.env.VUE_APP_VERSION = require('./package.json').version;
module.exports = {
    productionSourceMap: false,
    publicPath: process.env.NODE_ENV === 'production' ? '' : '/'
};