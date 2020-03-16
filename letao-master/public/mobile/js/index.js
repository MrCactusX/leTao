/*
 * @Descripttion: 
 * @version: 
 * @Author: Mr.Cactus
 * @Date: 2020-02-17 10:50:33
 * @LastEditors: Mr.Cactus
 * @LastEditTime: 2020-02-19 18:16:46
 */
var gallery = mui('.mui-slider');
gallery.slider({
    interval: 2000 //自动轮播周期，若为0则不自动播放，默认为0；
});
mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    indicators: false
});