/*
 * @Descripttion: 
 * @version: 
 * @Author: Mr.Cactus
 * @Date: 2020-02-17 16:40:41
 * @LastEditors: Mr.Cactus
 * @LastEditTime: 2020-02-17 16:40:42
 */
;
$(function () {
    rander();
});
var rander = function () {
    getFirstData(function () {
        var firstHtml = template('first', data);
        $('.c_left ul').html(firstHtml);
        var categoryId = $('.c_left ul').find('a').attr('data-id');
        rander2(categoryId);
    });
   
};
var getFirstData = function (callback) {
    if (window.data) {
        callback && callback(window.data)
    } else {
        $.ajax({
            url: '/category/queryTopCategory',
            type: 'get',
            dataType: 'json',
            success: function (data) {
                window.data = data;
                callback && callback(window.data);
            }
        })
    }
};
var rander2 = function(categoryId){
    getSecondData({id:categoryId},function(data){
        var secondHtml = template('second', data);
        $('.c_right ul').html(secondHtml);
    })
}
var getSecondData = function (id, callback) {
    $.ajax({
        url: '/category/querySecondCategory',
        type: 'get',
        data:id,
        dataType: 'json',
        success: function (data) {
            callback && callback(data);
        }
    })
};
$('.c_left').on('tap','li',function(){
    if($(this).hasClass('active')) return;
    $(this).addClass('active').siblings().removeClass('active');
    rander2($(this).find("a").attr('data-id'));
})