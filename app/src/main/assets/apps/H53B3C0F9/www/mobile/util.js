__CreateJSPath = function (js) {
    var scripts = document.getElementsByTagName("script");
    var path = "";
    for (var i = 0, l = scripts.length-1; i <= l; i++) {
        var src = scripts[i].src;
        if (src.indexOf(js) != -1) {
            var ss = src.split(js);
            path = ss[0];
            break;
        }
    }
    var href = location.href;
    href = href.split("#")[0];
    href = href.split("?")[0];
    var ss = href.split("/");
    ss.length = ss.length - 2;
    href = ss.join("/");
    if (path.indexOf("https:") == -1 && path.indexOf("http:") == -1 && path.indexOf("file:") == -1 && path.indexOf("\/") != 0) {
        path = href + "/" + path;
    }
    return path;
}

var path = __CreateJSPath("util.js");

function isApp() {
    if (navigator.userAgent.indexOf("Html5Plus")>=0){
        return true;
    } else {
        return false;
    }
}

h5ui = {};

(function(){
    if (path.indexOf("file:///")==0) {
        if (typeof(HomePath)=='undefined') {
            HomePath = localStorage.getItem("HomePath");
            var a = HomePath.split("/");
            locate = [a[0],a[1],a[2]].join("/");
            context = a[3];
        }
        AppPath = localStorage.getItem("AppPath");
    } else {
        HomePath = path.substring(0,path.length-10);
        var a = HomePath.split("/");
        locate = [a[0],a[1],a[2]].join("/");
        context = a[3];
        // AppPath = "http://localhost:13131/_www/";
        AppPath = "";
    }
})();

(function importRS(){
    var js = [
        "modules/bluebird.js",
        "modules/vue.min.js",
        "modules/vue-gesture.js",
        "modules/vee-validate.js",
        "modules/zh_CN.js",
        "modules/jquery.min.js",
        "modules/eruda.min.js",
        "modules/mui/js/mui.min.js",
        "modules/mui/js/mui.lazyload.js",
        "modules/mui/js/mui.lazyload.img.js",
        "modules/mui/js/mui.picker.all.js",
        "modules/mui/js/mui.poppicker.js",
        "modules/mui/js/mui.pullToRefresh.js",
        "modules/mui/js/mui.pullToRefresh.material.js",
        "modules/mui/js/mui.zoom.js",
        "modules/mui/js/mui.previewimage.js",
        "module.js?v=20190717",
        "modules/demo.js"
    ];

    for (var i=0;i<js.length;i++) {
        var url;
        if (isApp()&&AppPath) {
            url = AppPath+"mobile/"+js[i];
        } else {
            url = path+js[i];
        }
        document.write('<script src="'+url+'" type="text/javascript"></script>');
    }

    var css = [
        "modules/mui/css/mui.min.css",
        "modules/mui/css/icons-extra.css",
        "modules/mui/css/mui.dtpicker.css",
        "modules/mui/css/mui.imageviewer.css",
        "modules/mui/css/mui.listpicker.css",
        "modules/mui/css/mui.picker.css",
        "modules/mui/css/mui.poppicker.css",
        "modules/mui/css/mui.picker.min.css",
        "modules/mui/css/app.css"
    ];
    for (var i=0;i<css.length;i++) {
        var url;
        if (isApp()&&AppPath) {
            url = AppPath+"mobile/"+css[i];
        } else {
            url = path+css[i];
        }
        document.write('<link href="'+url+'" rel="stylesheet" type="text/css" />');
    }
})();

function require(str) {
    if ("echart"==str) {
        document.write('<script src="'+path+'modules/echarts-all.js" type="text/javascript"></script>');
        document.write('<script src="'+path+'modules/vintage.js" type="text/javascript"></script>');
    }
}