/*
 * @Descripttion: 
 * @version: 
 * @Author: Mr.Cactus
 * @Date: 2020-02-23 19:22:55
 * @LastEditors: Mr.Cactus
 * @LastEditTime: 2020-02-23 19:48:26
 */
$(function () {
    //1.渲染页面
    getMemberData(function (data) {
        $(".mui-table-view").html(template("personal",data));
    })
    
    //2.点击退出
    $(".mui-btn-outlined").on("tap",function () {
        SecedeMemberData(function (data) {
            location.href="/mobile/user/login.html?returnURL="+location.href;
        })
    })
    
    function getMemberData(callback) {
        LT.loginAjax({
            url:"/user/queryUserMessage",
            type:"get",
            data:"",
            dataType:"json",
            success:function (data) {
                // console.log(data);
                callback&&callback(data);
            }
        })
    }

    function SecedeMemberData(callback) {
        LT.loginAjax({
            url:"/user/logout",
            type:"get",
            data:"",
            dataType:"json",
            success:function (data) {
                //console.log(data);
                callback&&callback(data);
            }
        })
    }
})