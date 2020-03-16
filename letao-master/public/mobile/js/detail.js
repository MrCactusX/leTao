/*
 * @Descripttion: 
 * @version: 
 * @Author: Mr.Cactus
 * @Date: 2020-02-19 13:17:48
 * @LastEditors: Mr.Cactus
 * @LastEditTime: 2020-02-20 20:08:17
 */
mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    indicators: false,
});
var gallery = mui('.mui-slider');
//console.log(gallery);
gallery.slider({
    interval: 2000 //自动轮播周期，若为0则不自动播放，默认为0；
});

let productId = window.LT.getUrlParam().id;

$('.mui-scroll').on('tap', '.lt_size li', function () {
    if ($(this).hasClass('active')) return;
    $(this).addClass('active').siblings().removeClass('active');
})

$('.mui-scroll').on('tap', '.lt_num .num_add', function () {
    var sy = parseInt($(this).next().children('.sy').text());
    if (sy <= 0) {
        mui.toast('商品库存不足');
        return false;
    } else {
        var value = parseInt($(this).prev().val());
        value += 1;
        $(this).prev().val(value);
        sy -= 1;
        $(this).next().children('.sy').text(sy);
    }

})

$('.join_cart').on('tap',function(){
    var $size = $('.mui-scroll .lt_size li.active');
    if(!$size.length){
        mui.toast('请选择尺码');
        return false;
    }
    var num = $('.mui-scroll .lt_num .num').val();
    if(num==0){
        mui.toast('请选择数量');
        return false;
    }
    LT.loginAjax({
        url:'/cart/addCart',
        type:'post',
        data:{
            productId:productId,
            size:$size.text(),
            num:num
        },
        dataType:'json',
        success:function(data){
            if (data.success == true) {
                var btnArray = ['是', '否'];
                mui.confirm('已添加至购物车，是否查看?', '加入购物车', btnArray, function (e) {
                    if (e.index == 0) {
                        console.log('yes');
                        location.href = '/mobile/cart.html?';
                    } else {
                        console.log('no');
                    }
                })
            }
        }
    })
})

$('.mui-scroll').on('tap', '.lt_num .num_jian', function () {
    var value = parseInt($(this).next().val());
    var sy = parseInt($(this).siblings('.num_sy').children('.sy').text());
    if(value>0){
        value -= 1;
        $(this).next().val(value);
        sy += 1;
        $(this).siblings('.num_sy').children('.sy').text(sy)
    }
})


getData({
    id: productId
}, function (data) {
    var s = data.size.split('-');
    var size = [];
    for (var i = parseInt(s[0]); i <= parseInt(s[1]); i++) {
        size.push(i);
    }
    var obj = {
        pic: data.pic,
        length: data.pic,
        proName: data.proName,
        num: data.num,
        price: data.price,
        oldPrice: data.oldPrice,
        size: size
    };
    $('.mui-scroll').html(template('detail', {
        list: obj
    }))
})

function getData(parmas, callback) {
    $.ajax({
        url: '/product/queryProductDetail',
        type: 'get',
        data: parmas,
        dataType: 'json',
        success: function (data) {
            callback && callback(data);
        }
    })
}