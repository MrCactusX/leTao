/*
 * @Descripttion: 
 * @version: 
 * @Author: Mr.Cactus
 * @Date: 2020-02-18 11:20:07
 * @LastEditors: Mr.Cactus
 * @LastEditTime: 2020-02-18 18:08:09
 */
;$(function(){
    var historyList = getHistoryData();
    $('.lt_historyBox').html(template('historyData',{list:historyList}));
    $('.search_btn').on('tap',function(){
        var txt = $('.search_input').val();
        if(!txt){
            mui.toast('请输入关键字');
            return false;
        }
        $(historyList).each(function(index,val){
            if(txt==val){
                historyList.splice(index,1)
            }
        });
        historyList.reverse();
        historyList.push(txt);
        if(historyList.length>5){
            historyList.shift();
        }
        localStorage.setItem('history',JSON.stringify(historyList));
        location.href = "searchList.html?key="+txt;        
        $('.lt_historyBox').html(template('historyData',{list:historyList}));
    })
    $('.lt_history').on('tap','a.history_clear',function(){
        localStorage.clear();
        historyList = getHistoryData();
        $('.lt_historyBox').html(template('historyData',{list:historyList}));
    })
});
function getHistoryData (){
   var str = localStorage.getItem('history')||"[]";
   var obj = JSON.parse(str);
   return obj;
}