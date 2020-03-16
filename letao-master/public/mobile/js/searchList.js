/*
 * @Descripttion: 
 * @version: 
 * @Author: Mr.Cactus
 * @Date: 2020-02-18 18:05:23
 * @LastEditors: Mr.Cactus
 * @LastEditTime: 2020-02-20 19:55:05
 */
window.page = 1;
mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    indicators: false,
});
let key = window.LT.getUrlParam().key;

$('.productBox').on('tap','.buy',function(){
    location.href = "detail.html?id="+$(this).attr('id');
})


$('.search_input').val(key);
getData({
    proName: key,
    price: 1,
    page: 1,
    pageSize: 4
}, function (data) {
    $('.productBox ul').html(template('product', data));
});

$('.search_btn').on('tap', function () {
    mui('#refresh').pullRefresh().pulldownLoading();
});

$('.productTitle li').on('tap', function () {
    if ($(this).hasClass('active')) {
        if ($(this).hasClass('price') || $(this).hasClass('num')) {
            if ($(this).find('span').hasClass('fa-arrow-down')) {
                $(this).find('span').removeClass('fa-arrow-down').addClass('fa-arrow-up');
            } else {
                $(this).find('span').removeClass('fa-arrow-up').addClass('fa-arrow-down');
            }
        }
    }
    $(this).siblings().find('span').removeClass('fa-arrow-up').addClass('fa-arrow-down');
    $(this).addClass('active').siblings().removeClass('active');
    mui('#refresh').pullRefresh().pulldownLoading();
})

mui.init({
    pullRefresh: {
        container: "#refresh", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
        down: {
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

function pullDownRefresh() {
    setTimeout(function () {
        window.page = 0;
        var key = $.trim($('.search_input').val());
        if (!key) {
            mui.toast('请输入关键字');
            mui('#refresh').pullRefresh().endPulldownToRefresh();
            return false;
        } else {
            var obj = {
                proName: key,
                page: 1,
                pageSize: 4
            };
            var type = $('.productTitle li.active').find('a').attr('data-type');
            var value = $('.productTitle li.active').find('span').hasClass('fa-arrow-down') ? 2 : 1;
            if(type){
				obj[type] = value;
			}
            getData(obj, function (data) {
                $('.productBox ul').html(template('product', data));
            });
        };
        mui('#refresh').pullRefresh().endPulldownToRefresh();
        mui('#refresh').pullRefresh().refresh(true);
    }, 1000);
}

function pullUpRefresh() {
    window.page++;
    var key = $.trim($('.search_input').val());
    if (!key) {
        mui.toast('请输入关键字');
        mui('#refresh').pullRefresh().endPullupToRefresh(true);
        return false;
    } else {
        setTimeout(function () {
            var key = $.trim($('.search_input').val());
            var obj = {
                proName: key,
                page: window.page,
                pageSize: 4
            };
            var type = $('.productTitle li.active').find('a').attr('data-type');
            var value = $('.productTitle li.active').find('span').hasClass('fa-arrow-down') ? 2 : 1;
            if(type){
                obj[type] = value;
            }
            getData(obj, function (data) {
                $('.productBox ul').append(template('product', data));
                if (data.data.length>0) {
                    mui('#refresh').pullRefresh().endPullupToRefresh();

                } else {
                    mui('#refresh').pullRefresh().endPullupToRefresh(true);
                }
            });

        }, 1000)
    }
}
function getData(parmas, callback) {
    $.ajax({
        url: '/product/queryProduct',
        type: 'get',
        data: parmas,
        dataType: 'json',
        success: function (data) {
            callback && callback(data);
        }
    })
}