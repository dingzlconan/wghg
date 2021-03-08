h5ui.menuList.defaults = {
	nomsg:"暂无数据"
};

$.ajaxSetup({
	error: function(){
		h5ui.window.msg("请求发生错误！");
	},
    complete:function(XMLHttpRequest, status){
        if (status == 'timeout') {
        	h5ui.window.msg("网络不稳定，请求超时！");
        }
    }
});

if (isApp()) {
    waitforplus(function(){
        var logs = h5ui.storage.getItem('log');
        if (logs) {
        	eruda.init();
        }
    });
} else {
    var logs = h5ui.storage.getItem('log');
    if (logs) {
    	eruda.init();
    }
}
