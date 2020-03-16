/*
 * @Descripttion: 
 * @version: 
 * @Author: Mr.Cactus
 * @Date: 2020-02-20 10:20:20
 * @LastEditors: Mr.Cactus
 * @LastEditTime: 2020-02-23 20:00:41
 */

mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    indicators: false,
});
var mask = mui.createMask(function () {
    $('.updata').removeClass('up').addClass('down')
}); //callback为用户点击蒙版时自动执行的回调；

//点击全选
$('.lt_mannage').on('change', 'input', function () {
    if (this.checked) {
        mui(".lt_productList input.ckBox").each(function () {
            this.checked = true;
            $(this).parents('li').addClass('checked')
        });

    } else {
        mui(".lt_productList input.ckBox").each(function () {
            this.checked = false;
            $(this).parents('li').removeClass('checked')
        });
    }
    total();
})

//选中商品结算
$('.lt_productList').on('change', 'li input.ckBox', function () {
    this.checked ? $(this).parents('li').addClass('checked') : $(this).parents('li').removeClass('checked')
    total()
})

//商品数量增加
$('.mui-scroll').on('tap', '.lt_num .num_add', function () {
    var num = parseInt($(this).prev().val());
    var proNum = parseInt($(this).prev().attr('data-pronum'));
    if (num >= proNum) {
        mui.toast('商品库存不足');
        return false;
    } else {
        num += 1;
        $(this).prev().val(num);
        var id = $(this).parents('li').attr('id');
        var size = $(this).parents('option').prev().children('button').text();
        updataData({
            id:id,
            size:size,
            num:num
        })
    }
    total();
})

//商品数量减少
$('.mui-scroll').on('tap', '.lt_num .num_jian', function () {
    var num = parseInt($(this).next().val());
    if (num > 0) {
        num -= 1;
        $(this).next().val(num);
    }
    total();
})

//更改数据重选尺码
$('.updata .mui-scroll').on('tap', '.lt_size li', function () {
    if ($(this).hasClass('active')) return;
    $(this).addClass('active').siblings().removeClass('active');
    $('.updata .select a').text($(this).text())
})

//点击尺码进入更改数据
var up = {};
$('.lt_productList').on('tap', '.setting button', function () {
    mask.show(); //显示遮罩
    //添加类名实现动画效果
    if ($('.updata').hasClass('down')) {
        $('.updata').removeClass('down')
    }
    $('.updata').addClass('up');
    //获取商品id
    var productId = $(this).parents('li').attr('id');
    
    up['num'] = $(this).parents('li').find('input.num').val();
    //获取数据渲染更改数据页面
    getproData({
        id: productId
    }, function (data) {
        var s = data.size.split('-');
        var size = [];
        for (var i = parseInt(s[0]); i <= parseInt(s[1]); i++) {
            size.push(i);
        }
        var obj = {
            id:data.id,
            pic: data.pic,
            length: data.pic,
            proName: data.proName,
            num: data.num,
            price: data.price,
            oldPrice: data.oldPrice,
            size: size
        };
        $('.updata .mui-scroll').html(template('detail', {
            list: obj
        }))
    });
});

//点击确认判断参数执行更改
$('.updata').on('tap','.btn_yes',function(){
    up['id'] = $('.updata .f_line').attr("id");
    up['size'] = $('.updata .select a').text();
    updataData(up);
});

//点击取消
$('.updata').on('tap','.btn_no',function(){
    mask.close();
})

//点击删除
$('.lt_productList').on('tap','.mui-btn',function(){
    var IdArr = [];
    var proid = $(this).parents('li').attr('id');
    IdArr.push(proid);
    deleteData(IdArr);
    mui('#refresh').pullRefresh().pulldownLoading();
    $(this).parents('li').remove();
})
//初始化刷新
mui.init({
    pullRefresh: {
        container: "#refresh", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
        down: {
            auto: true,
            callback: pullDownRefresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        },
        up: {
            auto: false,
            contentrefresh: "正在加载...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
            contentnomore: '没有更多数据了',
            callback: pullUpRefresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        }
    }
});

//下拉刷新函数
function pullDownRefresh() {
    setTimeout(function () {
        getData(function (data) {
            $('.lt_productList').html(template('list', {
                data: data
            }));
            //显示购物车商品件数
            $('.lt_header').find('h3 i.product_num').text($('.lt_productList li').length);
        });
        total();
        mui('#refresh').pullRefresh().endPulldownToRefresh();
        mui('#refresh').pullRefresh().refresh(true);
    }, 1000);
}

//上拉加载函数
function pullUpRefresh() {
    
    mui('#refresh').pullRefresh().endPullupToRefresh(true);
}

//获取购物车数据
function getData(callback) {
    LT.loginAjax({
        url: '/cart/queryCart',
        type: 'get',
        dataType: 'json',
        success: function (data) {
            callback && callback(data);
        }
    })
};

//获取商品详细信息(用于显示更改数据界面)
function getproData(parmas, callback) {
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

//计算选中商品总数和总价
function total() {
    var totalNum = 0,
        totalPrice = 0;
    var items = $('.lt_productList li.checked');
    for (var i = 0; i < items.length; i++) {
        var num = parseInt($(items[i]).find('input.num').val())
        totalNum += num;
        totalPrice += parseFloat($(items[i]).find('.price span').text()) * num
    }

    $('.lt_mannage a.totalNum').text(totalNum);
    $('.lt_mannage a.totalPrice').html('&yen; ' + totalPrice.toFixed(2));
}

//更改购物车数据
function updataData(parmas){
    LT.loginAjax({
        url:'/cart/updateCart',
        type:'post',
        data:parmas,
        dataType:'json',
        success:function(data){
            if(data.success==true){
                mui.toast('更改成功');
                mask.close();
                total();
            }
            else{
                mui.toast(data.error)
            }
        }
    })
}
//删除购物车数据
function deleteData(id){
    LT.loginAjax({
        url:'/cart/deleteCart',
        type:'get',
        data:{
            id:id
        },
        dataType:'json',
        success:function(data){
            if(data.success==true){
                mui.toast('删除成功');
             
            }
        }
    })
}