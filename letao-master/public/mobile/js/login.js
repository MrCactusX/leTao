/*
 * @Descripttion: 
 * @version: 
 * @Author: Mr.Cactus
 * @Date: 2020-02-19 21:54:49
 * @LastEditors: Mr.Cactus
 * @LastEditTime: 2020-02-20 19:57:10
 */
$('.mui-btn-primary').on('tap',function(){
    var info = $('#user_login').serialize();
    //console.log(info);
    var data = LT.setObj(info);
    if(!data.username){
        mui.toast('请输入用户名')
    }
    if(!data.password){
        mui.toast('请输入密码')
    }

    $.ajax({
        url:'/user/login',
        type:'post',
        data:$('#user_login').serialize(),
        success:function(data){
            console.log(data);
            if(data.success==true){
                mui.toast('登录成功');
                var returnURL = location.search.replace('?returnURL=','');
                if(returnURL){
                    location.href = returnURL;
                }else{
                    location.href = '../index.html';
                }
            }
            else{
                mui.toast(data.message);
            }
        }
    })
})