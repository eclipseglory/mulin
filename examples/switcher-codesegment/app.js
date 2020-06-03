const mulin = require('./libs/mulin-wx.min.js');
const switchDaytimeObject = require('./libs/swich_daytime.js');

App({
  onLaunch: function () {
    console.log(switchDaytimeObject);
  },
  readFile: Promise.resolve(switchDaytimeObject),
  mulin: mulin
})
