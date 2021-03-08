/**
 * Created by ��С�� on 2017/12/6.
 */

__CreateJSPath = function (js) {
    var scripts = document.getElementsByTagName("script");
    var path = "";
    for (var i = 0, l = scripts.length-1; i < l; i++) {
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

var path = __CreateJSPath("mui.js");
console.log(path);


//var path=path+'modules/mui'
console.log(path);

//bootstrop css
//document.write('<link href="'+path+'modules/mui/css/app.css" rel="stylesheet" type="text/css" />');
document.write('<link href="'+path+'modules/mui/css/mui.min.css" rel="stylesheet" type="text/css" />');
document.write('<link href="'+path+'modules/mui/css/feedback.css" rel="stylesheet" type="text/css" />');
/*
document.write('<link href="'+path+'modules/mui/css/app.css" rel="stylesheet" type="text/css" />');
document.write('<link href="'+path+'modules/mui/css/feedback.css" rel="stylesheet" type="text/css" />');
document.write('<link href="'+path+'modules/mui/css/icons-extra.css" rel="stylesheet" type="text/css" />');
document.write('<link href="'+path+'modules/mui/css/mui.dtpicker.css" rel="stylesheet" type="text/css" />');
document.write('<link href="'+path+'modules/mui/css/mui.imageviewer.css" rel="stylesheet" type="text/css" />');
document.write('<link href="'+path+'modules/mui/css/mui.listpicker.css" rel="stylesheet" type="text/css" />');
document.write('<link href="'+path+'modules/mui/css/mui.picker.all.css" rel="stylesheet" type="text/css" />');
document.write('<link href="'+path+'modules/mui/css/mui.poppicker.css" rel="stylesheet" type="text/css" />');

*/

//���

//document.write('<script src="'+path+'modules/jquery.min.js" type="text/javascript"></script>');

document.write('<script src="'+path+'modules/mui/js/mui.min.js" type="text/javascript"></script>');
/*console.log('<script src="'+path+'modules/mui/js/mui.min.js" type="text/javascript"></script>')
//document.write('<script src="'+path+'modules/mui/js/ad.js" type="text/javascript"></script>');
document.write('<script src="'+path+'modules/mui/js/arttmpl.js" type="text/javascript"></script>');
 //document.write('<script src="'+path+'modules/mui/js/beecloud.js4" type="text/javascript"></script>');
 document.write('<script src="'+path+'modules/mui/js/city.data-3.js" type="text/javascript"></script>');
 document.write('<script src="'+path+'modules/mui/js/city.data.js" type="text/javascript"></script>');
*/
 document.write('<script src="'+path+'modules/mui/js/feedback.js" type="text/javascript"></script>')
document.write('<script src="'+path+'modules/mui/js/mui.view.js" type="text/javascript"></script>');
/*document.write('<script src="'+path+'modules/mui/js/mui.lazyload.js" type="text/javascript"></script>');
document.write('<script src="'+path+'modules/mui/js/mui.lazyload.img.js" type="text/javascript"></script>');
document.write('<script src="'+path+'modules/mui/js/mui.dtpicker.js" type="text/javascript"></script>');
 document.write('<script src="'+path+'modules/mui/js/mui.imageViewer.js" type="text/javascript"></script>');
 document.write('<script src="'+path+'modules/mui/js/mui.js" type="text/javascript"></script>');
 document.write('<script src="'+path+'modules/mui/js/mui.indexedlist.js" type="text/javascript"></script>');
 document.write('<script src="'+path+'modules/mui/js/mui.listpicker.js" type="text/javascript"></script>');
 document.write('<script src="'+path+'modules/mui/js/mui.picker.all.js" type="text/javascript"></script>');
 document.write('<script src="'+path+'modules/mui/js/mui.poppicker.js" type="text/javascript"></script>');
 document.write('<script src="'+path+'modules/mui/js/mui.pullToRefresh.js" type="text/javascript"></script>');
 document.write('<script src="'+path+'modules/mui/js/mui.locker.js" type="text/javascript"></script>');

 document.write('<script src="'+path+'modules/mui/js/mui.pullToRefresh.js" type="text/javascript"></script>');
 document.write('<script src="'+path+'modules/mui/js/mui.pullToRefresh.material.js" type="text/javascript"></script>');
 document.write('<script src="'+path+'modules/mui/js/mui.zoom.js" type="text/javascript"></script>');
 document.write('<script src="'+path+'modules/mui/js/mui.picker.min.js" type="text/javascript"></script>');
 //document.write('<script src="'+path+'modules/mui/js" type="text/javascript"></script>');

 document.write('<script src="'+path+'modules/mui/js/update.js" type="text/javascript"></script>');
 document.write('<script src="'+path+'modules/mui/libs/echarts-all.js" type="text/javascript"></script>');*/
//bootstrop js
//document.write('<script src="util.js" type="text/javascript"></script>');

var link=["modules/mui/css/mui.min.css",
    "modules/mui/css/app.css",
    "modules/mui/css/feedback.css"

];

var scripts=["modules/jquery.min.js",
    "modules/mui/js/mui.min.js",
    "modules/mui/js/feedback.js",
    "modules/mui/js/mui.view.js"

];
new bootrs(path,link,scripts);
h5ui = {};

h5ui.ajax = function() {

}


h5ui.combobox = function() {

}

h5ui.combobox.prototype.load = function(){

}


/**
 * Created by 田小虎 on 2017/12/7.
 */
