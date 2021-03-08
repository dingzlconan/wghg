var path = __CreateJSPath("bootstrapTable.js");

(function(){
	var js = [
        "modules/bootstrap/js/bootstrap.min.js",
        "modules/bootstrapTable/bootstrap-table.js",
        "modules/bootstrapTable/extensions/editable/bootstrap-table-editable.js",
        "modules/bootstrap3-editable/js/bootstrap-editable.js",
        "modules/bootstrapTable/locale/bootstrap-table-zh-CN.js"
    ];

    for (var i=0;i<js.length;i++) {
        var url;
        // if (isApp()) {
        //     url = "http://localhost:13131/_www/mobile/"+js[i];
        // } else {
            url = path+js[i];
        // }
        document.write('<script src="'+url+'" type="text/javascript"></script>');
    }

    var css = [
        "modules/bootstrap/css/bootstrap.min.css",
        "modules/bootstrapTable/bootstrap-table.css",
        "modules/bootstrap3-editable/css/bootstrap-editable.css"
    ];
    for (var i=0;i<css.length;i++) {
        var url;
        // if (isApp()) {
        //     url = "http://localhost:13131/_www/mobile/"+css[i];
        // } else {
            url = path+css[i];
        // }
        document.write('<link href="'+url+'" rel="stylesheet" type="text/css" />');
    }

})();