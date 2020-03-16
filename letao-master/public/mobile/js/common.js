/*
 * @Descripttion: 
 * @version: 
 * @Author: Mr.Cactus
 * @Date: 2020-02-18 20:47:53
 * @LastEditors: Mr.Cactus
 * @LastEditTime: 2020-02-19 22:29:46
 */
window.LT={};
LT.getUrlParam = function () {
    var str = decodeURI(location.href);
    if (str.indexOf('?') != -1) {
        var obj = {};
        str = str.substr(str.indexOf('?') + 1);
        if (str.indexOf('&') != -1) {
            var arr = str.split('&');
            for (var i = 0; i < arr.length; i++) {
                var a = arr[i].split('=');
                obj[a[0]] = a[1];
            }
        } else {
            var a = str.split('=');
            obj[a[0]] = a[1];
        }
        return obj
    } else {
        return 'undefined';
    }
};
LT.loginAjax = function(obj){
    $.ajax({
        url:obj.url||'#',
        type:obj.type||'get',
        data:obj.data||'',
        dataType:obj.dataType||'json',
        success:function(data){
            if(data.error==400){
                //login
                location.href = '/mobile//user/login.html?returnURL='+location.href;
            }else{
                obj.success&&obj.success(data);
            }
        }
    })
}

LT.setObj = function(str){
    var obj = {};
    if(str){
        var arr = str.split('&');
        arr.forEach(function(item,index){
            var newArr = item.split('=');
            obj[newArr[0]] = newArr[1];
        })
        return obj;
    }
}