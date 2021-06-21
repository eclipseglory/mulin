process.env.VUE_APP_AUTHOR_MANE = "老脸";
module.exports = {
    productionSourceMap: false,
    publicPath: process.env.NODE_ENV === 'production' ? '' : '/'
};