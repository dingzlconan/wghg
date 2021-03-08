Date.prototype.format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}


function GetUrlRelativePath(){
    var url = document.location.toString();
    var arrUrl = url.split("//");
    var start = arrUrl[1].indexOf("/");
    var relUrl = arrUrl[1].substring(start);//stop省略，截取从start开始到结尾的所有字符
    if(relUrl.indexOf("?") != -1){
    　　relUrl = relUrl.split("?")[0];
    }
    return relUrl;
}

function waitforplus(a){return window.plus?setTimeout(function(){a()},0):document.addEventListener("plusready",function(){a()},!1),this}

if (typeof Object.assign != 'function') {
  (function () {
    Object.assign = function (target) {
     'use strict';
     if (target === undefined || target === null) {
       throw new TypeError('Cannot convert undefined or null to object');
     }
    
     var output = Object(target);
     for (var index = 1; index < arguments.length; index++) {
       var source = arguments[index];
       if (source !== undefined && source !== null) {
         for (var nextKey in source) {
           if (source.hasOwnProperty(nextKey)) {
             output[nextKey] = source[nextKey];
           }
         }
       }
     }
     return output;
    };
    })();
}

if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.indexOf(str) === 0;
  };
}

h5ui.window = {
    forward:function(src,callback){
        if (!(window.self === window.top)) {
            top.h5ui.window.forward(src,callback);
            return;
        }
        h5ui.window.showLoading();
        if (src.indexOf("${ctx}/")==0){
            src = src.replace("${ctx}/",HomePath);
        } else if (src.indexOf(locate)!==0) {
            if (src.indexOf("http://")==0) {
                src = src;//处理http开头的url
            } else {
                if (src.indexOf("file:///")!==0){//开头是file:///调过处理
                    src = locate+src;//处理${ctx}转成/项目名问题
                }
            }
        }
        if (typeof(plus)=='undefined') {
            h5ui.window.hideLoading();
            top.window.location.href=src;
        } else {
            var wp=plus.webview.create(src,src,{scrollIndicator:'none',scalable:false,popGesture:'none'},{preate:true});
            wp.onloaded=function(){
                h5ui.window.hideLoading();
                plus.webview.show(wp,"pop-in",100,function(){
                    if (callback)
                        callback(wp);
                });
            };
        }
    },
    back:function(callback){
        if (typeof(plus)=='undefined') {
            top.window.history.back(-1); 
        } else {
            var views = plus.webview.all();
            var len = views.length;
            if (len>1) {
                var np = views[len-1];
                var wp = views[len-2];
                try {
                    plus.webview.startAnimation({
                        view:np,
                        styles:{fromLeft:'0%',toLeft:'100%'},
                        action:'none'
                    },
                    {
                        view:wp,
                        styles:{fromLeft:'-100%',toLeft:'0%'},
                        action:'none'
                    },
                    function(e){
                        if (e.id==wp.id) {
                            if (callback)
                                callback(wp);
                            np.close();
                        }
                    });
                } catch(e) {
                    console.log(JSON.stringify(e));
                }
            }
        }
    },
    alert:function(title,content,func){
        top.mui.alert(content,title, func);
    },
    confirm:function(title,content,btnArray,func){
        top.mui.confirm(content, title, btnArray, func);
    },
    prompt:function(title,content,placeholder,btnArray,func){
        top.mui.prompt(content, placeholder, title, btnArray, func);
    },
    msg:function(msg){
        top.mui.toast(msg);
    },
    showLoading: function(message,type){
        if (mui.os.plus && type !== 'div') {
            mui.plusReady(function() {
                plus.nativeUI.showWaiting(message);
            });
        } else {
            var html = '';
            html += '<i class="mui-spinner mui-spinner-white"></i>';
            html += '<p class="text">' + (message || "数据加载中") + '</p>';

            //遮罩层
            var mask=document.getElementsByClassName("mui-show-loading-mask");
            if(mask.length==0){
                mask = document.createElement('div');
                mask.classList.add("mui-show-loading-mask");
                document.body.appendChild(mask);
                mask.addEventListener("touchmove", function(e){e.stopPropagation();e.preventDefault();});
            }else{
                mask[0].classList.remove("mui-show-loading-mask-hidden");
            }
            //加载框
            var toast=document.getElementsByClassName("mui-show-loading");
            if(toast.length==0){
                toast = document.createElement('div');
                toast.classList.add("mui-show-loading");
                toast.classList.add('loading-visible');
                document.body.appendChild(toast);
                toast.innerHTML = html;
                toast.addEventListener("touchmove", function(e){e.stopPropagation();e.preventDefault();});
            }else{
                toast[0].innerHTML = html;
                toast[0].classList.add("loading-visible");
            }
        }   
    },
    hideLoading: function(callback){
        if (mui.os.plus) {
            mui.plusReady(function() {
                plus.nativeUI.closeWaiting();
            });
        } 
        var mask=document.getElementsByClassName("mui-show-loading-mask");
        var toast=document.getElementsByClassName("mui-show-loading");
        if(mask.length>0){
            mask[0].classList.add("mui-show-loading-mask-hidden");
        }
        if(toast.length>0){
            toast[0].classList.remove("loading-visible");
            callback && callback();
        }
    },
    popoverMenu: function(btns){
        var len = $("#popoverMenu").length;
        if (len==0) {
            $("body").append('<div id="popoverMenu" class="mui-popover mui-popover-action mui-popover-bottom">\
                <ul class="mui-table-view">\
                    <li class="mui-table-view-cell"  v-for="(item,index) in items" :name="['+"'menu'"+'+index]">\
                        <a href="#">{{item.text}}</a>\
                    </li>\
                    <li class="mui-table-view-cell">\
                        <a href="#popoverMenu">取消</a>\
                    </li>\
                </ul>\
            </div>');
        }

        new Vue({
            el: '#popoverMenu',
            data: {
                items:btns,
            },
            mounted: function(){
                var $menu = mui('#popoverMenu');
                $menu.popover('toggle');
                $menu.on('tap', '.mui-table-view-cell', function() {
                    $menu.popover('hide');
                    var name = $(this).attr("name");
                    if (name) {
                        var s = parseInt(name.substring(4));
                        if (btns[s].func)
                            btns[s].func();
                    }
                });
            }
        });
    },
    openwin:function(url,index,width,height){//url,index,width,height
        this.showLoading();
        if (!index) {
            index = "";
        }
        var id = "popoverFrame"+index;
        var len = $("#"+id).length;
        if (len==0) {
            $("body").append('<div id="'+id+'" class="mui-popover mui-popover-action mui-popover-bottom zbui-dialog">\
                <iframe src='+url+' frameborder="0" scrolling="yes" style="border:0;width:100%;height:100%;" ></iframe>\
            </div>');
        } else {
            $("#"+id).find("iframe").attr("src",url);
        }
        actwindow($("#"+id),"hidden");
        $("#"+id).css({
            width:width?width:"100%",
            height:height?height:"100%",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            margin: "auto"
        });
        var $menu = mui('#'+id);
        $("#"+id+" iframe").load(function(e){
            if (typeof(plus)!=='undefined'&&e.target.contentWindow) {
                e.target.contentWindow.plus = plus;
            }
            h5ui.window.hideLoading();
            actwindow($("#"+id),"visible");
            $menu.popover('show');
        });
    },
    closewin:function(index){
        if (top.thenav.childframe&&top.thenav.childframe.splice)
            top.thenav.childframe.splice(top.thenav.childframe.length-1,1);
        if (!index) {
            index = "";
        }
        var id = "popoverFrame"+index;
        var $menu = mui('#'+id);
        $menu.popover('hide');
    },
    openpdf: function(url,id){
        var param = HomePath+"getPDFFile?url="+url;
        var url = HomePath+"ui/mobile/modules/generic/web/viewer.html?file="+encodeURIComponent(param);
        if (id) {
            var did = document.getElementById(id);
            if (did) {
                while(did.hasChildNodes())
                {
                    did.removeChild(did.firstChild);
                }
                var iframe = document.createElement("iframe");
                iframe.src = url;
                iframe.frameBorder = "0";
                iframe.style.width = "100%";
                iframe.style.height = "100%";
                did.appendChild(iframe);
            }
        } else {
            h5ui.window.forward(url);
        }
    },
    childframe:function(iframeid) {
        return $(iframeid)[0].contentWindow;
    }
};

function actwindow(o,f) {
    var $win = o.css("visibility",f);
    o.css("display","block");
}

h5ui.camera = {
    getImage: function(callback){
        var cmr = plus.camera.getCamera();
        cmr.captureImage(function(p){
            h5ui.window.msg('成功：'+p);
            if(callback)
                callback(p);
        }, function(e){
            h5ui.window.msg('失败：'+e.message);
        }, {filename:'_doc/camera/',index:1});
    },
    getVideo: function(callback){
        var cmr = plus.camera.getCamera();
        cmr.startVideoCapture(function(p){
            h5ui.window.msg('成功：'+p);
            if(callback)
                callback(p);
        }, function(e){
            h5ui.window.msg('失败：'+e.message);
        }, {filename:'_doc/camera/',index:1});
    },
    getCameraList: function(){
        var gentry=null,rs=null;
        plus.io.resolveLocalFileSystemURL('_doc/', function(entry){
            //过URL参数获取目录对象或文件对象
            entry.getDirectory('camera', {create:true}, function(dir){
                //创建或打开子目录
                gentry = dir;
            }, function(e){
                h5ui.window.msg('Get directory "camera" failed: '+e.message);
            } );
        }, function(e){
            h5ui.window.msg('Resolve "_doc/" failed: '+e.message);
        });

        var reader = gentry.createReader();
        reader.readEntries(function(entries){
            rs = entries;
        }, function(e){
            h5ui.window.msg('读取录音列表失败：'+e.message);
        });
        return rs;
    }
};

h5ui.gallery = {
    lfs:null,
    galleryImg:function(callback){
        h5ui.window.msg('从相册中选择图片：');
        plus.gallery.pick(function(path){
            h5ui.window.msg(path);
             if(callback)
                callback(path);
        }, function(e){
            h5ui.window.msg('取消选择图片');
        }, {filter:'image'});
    },
    galleryImgs:function(callback){
        h5ui.window.msg('从相册中选择多张图片：');
        plus.gallery.pick(function(e){
            if(callback)
                callback(e.files);
        }, function(e){
            h5ui.window.msg('取消选择图片');
        },{filter:'image',multiple:true,system:false});
    },
    galleryImgsMaximum:function(callback){
        h5ui.window.msg('从相册中选择多张图片(限定最多选择3张)：');
        plus.gallery.pick(function(e){
            if(callback)
                callback(e.files);
        }, function(e){
            h5ui.window.msg('取消选择图片');
        },{filter:'image',multiple:true,maximum:3,system:false,onmaxed:function(){
            h5ui.window.alert('最多只能选择3张图片');
        }});
    },
    galleryImgsSelected:function(callback){
        var that = this;
        h5ui.window.msg('从相册中选择多张图片(限定最多选择3张)：');
        plus.gallery.pick(function(e){
            that.lfs=e.files;
            if(callback)
                callback(e.files);
        }, function(e){
            h5ui.window.msg('取消选择图片');
        },{filter:'image',multiple:true,maximum:3,selected:that.lfs,system:false,onmaxed:function(){
            h5ui.window.alert('最多只能选择3张图片');
        }});
    }
};

h5ui.device = {
    dial: function(number,confirm){
        if ('undefined'==typeof(confirm)) {
            confirm = true;
        }
        plus.device.dial(number,confirm);
    }
};

h5ui.common = {
    plusready: function(callback){
        document.addEventListener('plusready',callback,false);
    },
    addNavBytitle: function(title){
        var text;
        if (typeof(title)!=='undefined') {
            text = title;
        } else {
            text = document.getElementsByTagName("title")[0].innerHTML;
        }
        $("body").children().wrapAll('<div id="mynav" class="zbui-nav" data-options="title:\''+text+'\',backfunc:function(){parent.h5ui.window.closewin();}"></div>');
        mynav = new h5ui.nav("mynav");
    },
    getUserDirect:function(){
        $.ajax({
            type:'POST',
            async:false,
            url:HomePath+"getUser",
            success:function(data) {
                storage.setItem("user",JSON.stringify(data));
            }
        });
        return JSON.parse(storage.getItem("user"));
    },
    getUser:function(f){
        var that = this;
        if (true==f||null==storage.getItem("user")) {
            return that.getUserDirect();
        } else {
            return eval('('+storage.getItem("user")+')');
        }
    },
};

h5ui.geolocation = {
    getCurrentPosition:function(callback){
        h5ui.window.showLoading("正在获取地址信息,请稍候!");
        plus.geolocation.getCurrentPosition(function(position){
            h5ui.window.hideLoading();
            callback(position);
        },function ( e ) {
            h5ui.window.hideLoading();
            h5ui.window.msg(e.message);
        }, {geocode:true});
    }
};

h5ui.sign = function(id,options){
    var defaultOptions = {
        height:500,
        lineWidth:3,
        color:"black"
    };

    for (var o in defaultOptions) {
        if (!options[o]) {
            options[o] = defaultOptions[o];
        }
    }

    this.options = options;

    var canvas, board;
    canvas = document.getElementById(id);
    this.canvas = canvas;
    canvas.height = options.height;
    if (options.width) {
        canvas.width = options.width;
    } else {
        this.resize({
            width:$(canvas).parent().width()
        });
    }

    board = canvas.getContext('2d');
    this.board = board;
    board.lineWidth = options.lineWidth; //设置画笔粗细
    board.strokeStyle = options.color;
    board.lineJoin = "bevel"; //设置画笔轨迹基于圆点拼接  bevel  round miter

    this.mousePress = false;
    this.last = null;

    var that = this;

    $(function(){
        var $canvas = $(canvas);
        $canvas.on('mousedown touchstart',$.proxy(function(e){
            that.beginDraw(e);
        }));
        $canvas.on('mousemove touchmove',$.proxy(function(e){
            that.drawing(e);
        }));
        $canvas.on('mouseup touchend',$.proxy(function(e){
            that.endDraw(e);
        }));

        if (!options.width) {
            $(window).resize(function(){
                var param = {
                    width:$(that.canvas).parent().width()
                };
                that.resize(param);
            });
        }
        
    });

    
    
};

h5ui.sign.prototype = {
    beginDraw:function(event){
        this.mousePress = true;
    },
    endDraw:function(event){
        this.mousePress = false;
        event.preventDefault();
        this.last = null;
    },
    drawing:function(event){
        event.preventDefault();
        if (!this.mousePress) return;
        var xy = this.GetPos(event);
        if (this.last != null) {
            this.board.beginPath();
            this.board.moveTo(this.last.x, this.last.y);
            this.board.lineTo(xy.x, xy.y);
            this.board.stroke();
        }
        this.last = xy;
    },
    GetPos:function(event){
        var xPos, yPos, rect;
        rect = this.canvas.getBoundingClientRect();
        event = event.originalEvent;
        if (event.type.indexOf('touch') !== -1) { // event.constructor === TouchEvent
            xPos = event.touches[0].clientX - rect.left;
            yPos = event.touches[0].clientY - rect.top;
        }
        else {
            xPos = event.clientX - rect.left;
            yPos = event.clientY - rect.top;
        }
        return {
            x: xPos,
            y: yPos
        };
    },
    get:function(){
        var data = this.canvas.toDataURL("image/png");
        return data;
    },
    clean:function(){
        var options = this.options;
        this.board.clearRect(0, 0, options.width, options.height);
    },
    resize:function(param){
        if (param.width)
            this.canvas.width = param.width;
        if (param.height)
            this.canvas.height = param.height;
    }
};

h5ui.session = sessionStorage;
storage = localStorage;

h5ui.common.plusready(function(){
    storage = plus.storage;
});

h5ui.storage = {
    getAll:function(){
        return JSON.parse(storage.getItem("userStorage"));
    },
    clear:function(){
        delete storage["userStorage"];
    },
    getItem:function(key){
        var items = this.getAll();
        var item;
        for(var k in items) {
            if (k==key) {
                item = items[k];
            }
        }
        return item;
    },
    removeItem:function(key){
        var items = this.getAll();
        var f = false;
        for(var k in items) {
            if (k==key) {
                f=true;
                delete items[k];
            }
        }
        this.setItems(items);
        return f;
    },
    setItem:function(key,item){
        var items = this.getAll();
        if (items==null) {
            items = {};
        }
        items[key] = item;
        this.setItems(items);
    },
    setItems:function(items){
        storage.setItem("userStorage",JSON.stringify(items));
    }
};

h5ui.messagers = {
    clear:function(){
        delete storage["messagers"];
    },
    getAll:function(){//获得缓存消息列表
        var user = h5ui.common.getUser();
        var msgs = JSON.parse(storage.getItem("messagers"));
        if (msgs==null) {
            return null;
        } else {
            return msgs["user_"+user.id];
        }
    },
    setItems:function(msgs){
        var user = h5ui.common.getUser();
        var users;
        if (storage.getItem("messagers")==null) {
            users = {};
        } else {
            users = JSON.parse(storage.getItem("messagers"));
        }
        users["user_"+user.id] = msgs;
        storage.setItem("messagers",JSON.stringify(users));
    },
    getItem:function(cacheid){
        var msgs = this.getAll();
        var msg;
        msgs.forEach(function(v,k,a){
            if(v.cacheid == cacheid){
                msg = v;
            }
        });
        return msg;
    },
    setItem:function(msg){
        var msgs = this.getAll();
        if (!msgs) {
            return false;
        }
        var f = false;
        msgs.forEach(function(v,k,a){
            if (msg.cacheid==v.cacheid){
                f = true;
                a[k] = msg;
            }
        });
        this.setItems(msgs);
        return f;
    },
    appendItem:function(msgs){
        var that = this;

        function append(msg) {
            if (typeof(msg.cacheid)!=='undefined') {
                var f = that.setItem(msg);
                if (!f) {
                    var msgs = that.getAll();
                    if (!msgs) {
                        msgs = [];
                    }
                    msgs.push(msg);
                    that.setItems(msgs);
                }
                return !f;
            }
        }

        if (msgs instanceof Array) {
            msgs.forEach(function(v,k,a){
                append(v);
            });
        } else {
            append(msgs);
        }
    },
    removeItem:function(cacheid){
        var msgs = this.getAll();
        var f = false;
        msgs.forEach(function(v,k,a){
            if (cacheid==v.cacheid){
                f = true;
                a.splice(k,1);
            }
        });
        this.setItems(msgs);
        return f;
    }
};

h5ui.ajax = function(trancode,param,callback,f) {
    if (typeof f == "undefined") {
        f = true;
    }
    var params = {
        param : JSON.stringify(param)
    };
    var zbDsId_ = top.h5ui.storage.getItem("zbDsId_");
    if (null!==zbDsId_) {
        params.zbDsId_ = zbDsId_;
    }
    var preBean = top.h5ui.storage.getItem("preBean");
    if (null!==preBean) {
        params.preBean = preBean;
    }
    var url = "proxy/handle?transCode="+trancode;
    if (isApp()) {
        // url = location.href.substring(0,location.href.lastIndexOf("/"))+"/"+url;
        var rpath = GetUrlRelativePath();
        rpath = rpath.substring(0,rpath.lastIndexOf("/"));
        url = locate+rpath+"/"+url;
    }
    $.ajax({
        type:'POST',
        data: params,
        async:f,
        url:url,
        success:function(data) {
            if(callback){
                callback(data);
            }
        }
    });
};

h5ui.slider = function(id,options) {
    this.id = id;
    this.contentLefts = [];
    var $id = $("#"+id);
    var defaultOptions = {
        fit:true,
        tabfit:true,
        autotabfit:true,
        initLoad:[{index:0}]
    };
    if (!options) {
        if (typeof($id.attr("data-options"))=='undefined') {
            return;
        }
        var o = "{"+$id.attr("data-options")+"}";
        options = eval('(' + o + ')');
        var opts_child = [];
        var $tabs = $id.find(".zbui-hidearea").children("div");
        $tabs.each(function(){
            var o = "{"+$(this).attr("data-options")+"}";
            var opts = eval('(' + o + ')');
            opts.content = this.id;
            opts.id = this.id+"-wrap";
            opts_child.push(opts);
        });
        options.opts_child = opts_child;
    }
    $id.removeAttr("data-options");
    options.id = id;
    $id.addClass("mui-slider");

    for(var o in defaultOptions) {
        if ('undefined'==typeof(options[o])) {
            options[o] = defaultOptions[o];
        }
    }
    if (options.autotabfit) {
        options.tabfit = false;
    }
    this.options = options;
    this.init();
    this.slider = mui('#'+id).slider();
};

h5ui.slider.prototype = {
    init: function(){
        this.dovue();
        this.domui();
    },
    dovue: function(){
        var selfs = this;
        var id = this.id;
        var $id = $("#"+id);
        var opt = this.options;
        var options = this.options.opts_child;
        var template= '<div :class="opt.tabfit==false?\'mui-slider-indicator mui-segmented-control mui-segmented-control-inverted tabfit\':\'mui-slider-indicator mui-segmented-control mui-segmented-control-inverted\'">\
                            <a v-for="(item,index) in items" :class="index>0?\'mui-control-item\':\'mui-control-item mui-active\'" :href="[\'#\'+item.id]">{{item.title}}</a>\
                       </div>\
                        <div class="mui-slider-group">\
                            <div class="mui-slider-item mui-control-content" v-for="(item,index) in items" :id="item.id">\
                                <div class="mui-scroll-wrapper">\
                                    <div class="mui-scroll">\
                                        <div class="mui-loading">\
                                            <div class="mui-spinner">\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>';
        $id.append(template);

        this.items = new Vue({
            el: '#'+id,
            data: {
                items:options,
                opt:opt
            },
            mounted: function(){
                var id = selfs.id;
                var $id = $("#"+id);
                var $items = $id.find(".mui-control-item");
                var left = 0;
                $items.each(function(){
                    selfs.contentLefts.push(left);
                    left += $(this).outerWidth();
                });
                if (selfs.options.autotabfit){
                    var $indicator = $id.find(".mui-slider-indicator");
                    if ($indicator.width()<$id.width()) {
                        selfs.options.tabfit = true;
                    } else {
                        selfs.options.tabfit = false;
                    }
                }
            }
        });

        if (this.options.fit) {
            $("#"+id).addClass("mui-fullscreen");
        } else if (this.options.height) {
            var h = this.options.height-43;
            $("#"+id).find(".mui-control-content").height(h);
        }
    },
    domui: function(){
        var selfs = this;
        mui.init({
            swipeBack: false
        });
        (function($,sefs) {
            $('.mui-scroll-wrapper').scroll({
                indicators: true //是否显示滚动条
            });
            
            var options = sefs.options.opts_child;
            if (!options.length>0) {
                return;
            }

            var iops =  sefs.options.initLoad;
            iops.forEach(function(v,k,a){
                var item1 = document.getElementById(options[v.index].id);
                var c1 = document.getElementById(options[v.index].content);
                c1.style.height="100%";
                if (options[v.index]&&options[v.index].fit) {
                    item1.querySelector('.mui-scroll').outerHTML = c1.outerHTML;
                } else {
                    item1.querySelector('.mui-scroll').innerHTML = c1.outerHTML;
                }
                c1.outerHTML = "";
                if (options[v.index].content) {
                    h5ui.parser.parse("#"+options[v.index].content);
                }
                if (options[v.index].init) {
                    options[v.index].init();
                }
            });

            document.getElementById(selfs.id).addEventListener('slide', function(e) {
                var n = e.detail.slideNumber;
                selfs.scrolltoItem(n);
                if (e.detail.slideNumber>0) {
                    var item = document.getElementById(options[n].id);
                    var content = document.getElementById(options[n].content);
                    if (!content){
                        return;
                    }
                    if (item.querySelector('.mui-loading')) {
                        setTimeout(function() {
                            content.style.height="100%";
                            if (options[n]&&options[n].fit) {
                                item.querySelector('.mui-scroll').outerHTML = content.outerHTML;
                            } else {
                                item.querySelector('.mui-scroll').innerHTML = content.outerHTML;
                            }
                            content.outerHTML = "";
                            if (options[n].content) {
                                h5ui.parser.parse("#"+options[n].content);
                            }

                            var input = $("#"+options[n].content)[0].querySelector(".mui-input-row input");
                            $(input).input();

                            if (options[n].init) {
                                options[n].init();
                            }
                        }, 0);
                    }
                }
            });
           
        })(mui,this);
    },
    scrolltoItem: function(n){
        var selfs = this;
        var id = selfs.id;
        if (selfs.options.tabfit==false) {
            var left = selfs.contentLefts[n-1];
            var id = selfs.id;
            var $id = jQuery("#"+id);
            var $ctrl = $id.find(".mui-segmented-control");
            var len = $ctrl.width()-$id.width();
            if (n>0) {
                if (left<=len) {
                    $ctrl.animate({left:"-"+left+"px"});
                } else {
                    $ctrl.animate({left:"-"+len+"px"});
                }
            } else {
                $ctrl.animate({left:"0px"});
            }
        }
    },
    gotoItem: function(i){
        this.slider.gotoItem(i);
        this.scrolltoItem(i);
    },
    prevItem: function(){
        this.slider.prevItem();
        var n = this.getSlideNumber()-1;
        if (n>=0) {
            this.scrolltoItem(n);
        }
    },
    nextItem: function(){
        this.slider.nextItem();
        var n = this.getSlideNumber()+1;
        if (n>=0) {
            this.scrolltoItem(n);
        }
    },
    getSlideNumber: function(){
        return this.slider.getSlideNumber();
    },
    enableslide: function(){
        this.slider.stopped=false;
    },
    disableslide: function(){
        this.slider.stopped=true;
    },
    resize: function(param) {
        var id = this.id;
        var $id = $("#"+id);
        if (typeof(param.height)!=='undefined') {
            var h = param.height-43;
            $id.find(".mui-control-content").height(h);
        }
    },
    getsize: function(){
        var id = this.id;
        var $id = $("#"+id);
        return {
            width:$id.width(),
            height:$id.find(".mui-control-content").height()+43
        };
    },
    getinsize: function(){
        var id = this.id;
        var $id = $("#"+id);
        return {
            width:$id.width(),
            height:$id.find(".mui-control-content").height()
        };
    }
};

h5ui.vtabs = function(id,options){
    this.id = id;
    this.contentLefts = [];
    var $id = $("#"+id);
    var defaultOptions = {
        fit:true
    };
    if (!options) {
        if (typeof($id.attr("data-options"))=='undefined') {
            return;
        }
        var o = "{"+$id.attr("data-options")+"}";
        options = eval('(' + o + ')');
        var opts_child = [];
        var $tabs = $id.find(".zbui-hidearea").children("div");
        $tabs.each(function(){
            var o = "{"+$(this).attr("data-options")+"}";
            var opts = eval('(' + o + ')');
            opts.content = this.id;
            opts.id = this.id+"-wrap";
            opts.html = document.getElementById(this.id).innerHTML;
            opts_child.push(opts);
        });
        options.opts_child = opts_child;
    }
    $id.removeAttr("data-options");
    options.id = id;
    $id.addClass("mui-slider");

    for(var o in defaultOptions) {
        if ('undefined'==typeof(options[o])) {
            options[o] = defaultOptions[o];
        }
    }
    this.options = options;
    this.init();
};

h5ui.vtabs.prototype = {
    init: function(){
        this.dovue();
    },
    dovue: function(){
        var selfs = this;
        var id = this.id;
        var $id = $("#"+id);
        var opt = this.options;
        var options = this.options.opts_child;
        var template= '<div class="mui-col-xs-3" style="height:100%;overflow-y: auto;"><div class="mui-segmented-control mui-segmented-control-inverted mui-segmented-control-vertical">\
                            <a v-for="(item,index) in items" :class="index>0?\'mui-control-item\':\'mui-control-item mui-active\'" :href="[\'#\'+item.id]">{{item.title}}</a>\
                        </div></div>\
                        <div class="mui-col-xs-9" style="height:100%;overflow-y: auto;">\
                            <div :class="index>0?\'mui-control-content\':\'mui-control-content mui-active\'" v-for="(item,index) in items" :id="item.id">\
                                <div class="mui-scroll-wrapper">\
                                    <div class="mui-scroll" v-html="item.html">\
                                    </div>\
                                </div>\
                            </div>\
                        </div>';
        $id.append(template);

        this.items = new Vue({
            el: '#'+id,
            data: {
                items:options,
                opt:opt
            },
            mounted: function(){
                var id = selfs.id;
                var $id = $("#"+id);
                var $items = $id.find(".mui-control-item");
                var left = 0;
                $items.each(function(){
                    selfs.contentLefts.push(left);
                    left += $(this).outerWidth();
                });
            }
        });

        if (this.options.fit) {
            $("#"+id).addClass("mui-fullscreen");
        } else if (this.options.height) {
            var h = this.options.height;
            $("#"+id).height(h);
        }
    }
};

h5ui.parser = {
    auto:true,
    sign:"pad",
    modules:[
        "zbui-textbox",
        "zbui-combobox",
        "zbui-datebox",
        "zbui-numberbox",
        "zbui-switchbutton",
        "zbui-checklist",
        "zbui-radiolist",
        "zbui-multitext",
        "zbui-button",
        "zbui-searchbox",
        "zbui-progressbar",
        "zbui-form",
        "zbui-datagrid",
        "zbui-nav",
        "zbui-accordion",
        "zbui-sqgrid",
        "zbui-tabbar",
        "zbui-datalist",
        "zbui-slider",
        "zbui-menuList",
        "zbui-picSlider",
        "zbui-card",
        "zbui-echarts",
        "zbui-vtabs",
        "zbui-star",
        "zbui-pics"],
    parse:function(select,force){
        var selfs = this;
        if (!this.auto) {
            return [];
        }
        if (!select) {
            select = "body";
        }
        var $body = $(select);
        var scrips = "";
        this.modules.forEach(function(v,i,a){
            var $modules = $body.find("."+v);
            $modules.each(function(){
                var $id = $(this);
                $id.addClass(v+"-"+selfs.sign);
                if ($id.parents(".zbui-hidearea").length==0) {
                    if (force) {
                        scrips += "try {\
                            \twindow."+this.id+" = new h5ui."+v.substring(5)+"('"+this.id+"');\
                        }catch(err) {console.log(err);}"
                        // scrips += "\twindow."+this.id+" = new h5ui."+v.substring(5)+"('"+this.id+"');\n";
                    } else {
                        scrips += "if(!(window."+this.id+" instanceof h5ui."+v.substring(5)+")){\n\
                        \twindow."+this.id+" = new h5ui."+v.substring(5)+"('"+this.id+"');\n\
                        }\n";
                    }
                }
            });
        });
        // console.log(scrips);
        eval(scrips);
    },
    getctlbynode: function(select){
        var selfs = this;
        var $body = $(select);
        var idarray = [];
        this.modules.forEach(function(v,i,a){
            var $m1 = $body.find("."+v);
            $m1.each(function(){
                idarray.push(this.id);
            });
        });
        return idarray;
    },
    evil: function(str){
        var fn = Function;
        return new fn('return ' + str)();
    }
};

h5ui.nav = function(id,options){
    this.id = id;
    var $id = $("#"+id);
    var defaultOptions = {
        title:"nav",
        back:true,
        backfunc:function(){
            h5ui.window.back();
        },
        button:undefined
    };
    if (!options) {
        if (typeof($id.attr("data-options"))=='undefined') {
            return;
        }
         var o = "{"+$id.attr("data-options")+"}";
         var opts = eval('(' + o + ')');
         options = opts;
    }
    for(var o in defaultOptions) {
        if ('undefined'==typeof(options[o])) {
            options[o] = defaultOptions[o];
        }
    }
    $id.removeAttr("data-options");
    this.options = options;
    // 添加全局变量thenav，添加返回方法
    if (options.back) {
        if (!(window.self === window.top)) {
            if (top.thenav) {
                if (!top.thenav.childframe||top.thenav.childframe.length==0) {
                    top.thenav.childframe = [];
                }
                top.thenav.childframe.push(this);
            } else {
                top.thenav = {
                    childframe:[this]
                };
            }
        } else {
            thenav = this;
        }
    }
    $id.addClass("mui-content");
    var head = '<header class="mui-bar mui-bar-nav">';
    if (options.back) {
        head += ' <button class="mui-btn mui-btn-blue mui-btn-link mui-btn-nav mui-pull-left">\
            <span class="mui-icon mui-icon-left-nav"></span>\
        </button>';
    }
       
    head += '<h1 class="mui-title">'+options.title+'</h1>';
    if (options.button&&options.button.text) {
        head += '<button class="mui-btn mui-btn-blue mui-btn-link mui-pull-right">'+options.button.text+'</button>';
    }
    head += '</header>';
    $id.before(head);

    var f1 = options.backfunc;
    options.backfunc = function(){
        f1();
    };

    var $navhead = $id.parent().find(".mui-bar-nav");
    this.navhead = $navhead;
    if ($navhead.find(".mui-pull-left").length>0) {
        $navhead.find(".mui-pull-left")[0].addEventListener("tap",function () {
            options.backfunc();
        });
    }
    if ($navhead.find(".mui-pull-right").length>0) {
        $navhead.find(".mui-pull-right")[0].addEventListener("tap",function () {
            if (options.button&&options.button.tap)
                options.button.tap();
        });
    }
    h5ui.parser.parse("#"+id);
};

h5ui.nav.prototype = {
    getinsize:function(){
        return {
            height:$(window).height()-49
        };
    },
    resize: function(param) {
        var id = this.id;
        var $id = $("#"+id);
        if (typeof(param.height)!=='undefined') {
            $id.css("height",param.height+"px");
        }
    },
    refactButton:function(button){
        if (!button.text||!button.tap) {
            return;
        }
        var tap = function(){
            button.tap();
        };
        var that = this;
        var $right = that.navhead.find(".mui-pull-right");
        if ($right.length>0) {
            $right.text(button.text);
        } else {
            that.navhead.append('<button class="mui-btn mui-btn-blue mui-btn-link mui-pull-right">'+button.text+'</button>');
            that.navhead.find(".mui-pull-right")[0].addEventListener("tap",function () {
                button.tap();
            });
        }
        this.options.button = button;
    }
};

h5ui.accordion = function(id,options){
    this.id = id;
    var $id = $("#"+id);
    if (!options) {
        options = [];
        var $lis = $id.children("li");
        $lis.each(function(){
            var $this = $(this);
            var o = "{"+$this.attr("data-options")+"}";
            var opts = eval('(' + o + ')');
            opts.content = this.id;
            opts.id = this.id+"-wrap";
            options.push(opts);

            $this.addClass("mui-table-view-cell mui-collapse");
            var innerhm = $this.html();
            var hm = '<a class="mui-navigate-right" href="#">'+opts.title+'</a>\
                <div class="mui-collapse-content">'+innerhm+'</div>';
            $this.html(hm);
        });
    }

    this.options = options;
    $id.addClass("mui-table-view");
    h5ui.parser.parse("#"+id);
};

h5ui.accordion.prototype = {
    expand:function(index){
        var id = this.id;
        var $li = $("#"+id).children("li");
        $li.removeClass("mui-active");
        $li.eq(index).addClass("mui-active");
    }
};

h5ui.sqgrid = function(id,options){
    this.id = id;
    var $id = $("#"+id);
    var defaultOptions = {
        page:true,
        pageSize:10,
        singleSize:3,
        data:[],
        onLoadSuccess:function(){},
        onUpdated:function(){}
    };
    if (!options) {
        if (typeof($id.attr("data-options"))=='undefined') {
            return;
        }
        var o = "{"+$id.attr("data-options")+"}";
        var opts = eval('(' + o + ')');
        options = opts;
    }
    $id.removeAttr("data-options"); 

    for(var o in defaultOptions) {
        if ('undefined'==typeof(options[o])) {
            options[o] = defaultOptions[o];
        }
    }

    this.options = options;
    if (options.page==true) {
        var pagenumber = Math.ceil(options.data.length/options.pageSize);
        var n=0,pages=[];
        for (var i=0;i<pagenumber;i++) {
            var json = {},data=[];
            for (var j=0;j<options.pageSize;j++) {
                if (n<options.data.length) {
                    data.push(options.data[n]);
                    n++;
                } else {
                    break;
                }
            }
            json["page"] = data;
            pages.push(json);
        }
        options.view = pages;
        $id.addClass("mui-slider");
    } else {
        $id.addClass("mui-table-view").addClass("mui-grid-view").addClass("mui-grid-9");
    }
    $id.addClass("zbui-sqgrid");
    if (options.page==true) {
        $id.append('<div class="mui-slider-group"><div class="mui-slider-item" v-for="(item,index) in options.view">\
                        <ul class="mui-table-view mui-grid-view mui-grid-9">\
                            <li :class="['+"'mui-col-sm-'"+'+options.singleSize+'+"' mui-col-xs-'"+'+options.singleSize+'+"' mui-table-view-cell mui-media'"+']" v-for="(page,pi) in item.page" \
                            :name="[index+'+"'-'"+'+pi]" >\
                                <a href="#">\
                                    <span :class="[page.icon+'+"' mui-icon'"+']" >\
                                        <img :src="page.url" />\
                                        <span :class="typeof(page.size)==\'string\'?\'mui-badge\':\'\'">{{page.size}}</span>\
                                    </span>\
                                    <div class="mui-media-body">{{page.name}}</div>\
                                </a>\
                            </li>\
                        </ul>\
                    </div></div>');
        $id.append('<div class="mui-slider-indicator" >\
                        <div v-for="(item,index) in options.view" :class="index==0?\'mui-indicator mui-active\':\'mui-indicator\'"></div>\
                    </div>');
    } else {
        $id.append('<li v-for="(item,index) in options.data" :class="['+"'mui-col-sm-'"+'+options.singleSize+'+"' mui-col-xs-'"+'+options.singleSize+'+"' mui-table-view-cell mui-media'"+']" :name="index" ><a href="#">\
                        <span :class="[item.icon+'+"' mui-icon'"+']" >\
                            <img :src="item.url" />\
                            <span :class="typeof(item.size)==\'string\'?\'mui-badge\':\'\'">{{item.size}}</span>\
                        </span>\
                        <div class="mui-media-body">{{item.name}}</div>\
                        </a></li>');
    }
    this.grid =  new Vue({
        el: '#'+id,
            data: {
                options:options
        },
        beforeCreate: function(){},
        created: function () {},
        beforeMount: function(){},
        mounted: function(){
            mui("#"+id).on("tap",".mui-table-view-cell",function(e){
                var id = $(this).parents(".zbui-sqgrid")[0].id;
                var page = eval(id).options.page;
                if (page==true) {
                    var name = $(this).attr("name");
                    var na = name.split("-");
                    var data = eval(id).options.view;
                    data.forEach(function(v,k,a){
                        if (na[0]==k) {
                            v.page.forEach(function(v1,k1,a1){
                                if(na[1]==k1) {
                                    v1.callback(v1);
                                }
                            });
                        }
                    });
                } else {
                    var data = eval(id).options.data;
                    var name = $(this).attr("name");
                    data.forEach(function(v,k,a){
                        if (k==name) {
                            v.callback(v);
                        }
                    });
                }
            });
            options.onLoadSuccess(options.data);
        },
        beforeUpdate: function(){},
        updated: function(){
            options.onUpdated(options.data);
        },
        beforeDestroy: function(){},
        destroyed: function(){}
    });

    
};

h5ui.sqgrid.prototype = {
    getsize: function(){
        var id = this.id;
        var $id = $("#"+id);
        return {
            width:$id.width(),
            height:$id.height()
        };
    },
    loadData: function(data){
        this.options.data = data;
    }
};

h5ui.tabbar = function(id,options){
    this.id = id;
    var $id = $("#"+id);
    if (!options) {
        options = [];
        var $lis = $id.children("a");
        $lis.each(function(e){
            var $this = $(this);
            var o = "{"+$this.attr("data-options")+"}";
            var opts = eval('(' + o + ')');
            options.push(opts);
            $this.addClass("mui-tab-item");
            if (e==0) {
                $this.addClass("mui-active");
            }
            $this.attr("href",opts.href);
            var innerhm = $this.html();
            var hm = '';
            if (opts.icon) {hm += '<span class="mui-icon '+opts.icon+'"></span>';}
            hm += '<span class="mui-tab-label">'+innerhm+'</span>';
            $this.html(hm);
            if (opts.target&&opts.target=="blank") {
                this.addEventListener("tap",function () {
                    h5ui.window.forward(opts.href);
                });
            }
            if (opts.onClick) {
                this.addEventListener("tap",function () {
                    opts.onClick();
                });
            }
        });
    }

    this.options = options;
    $id.addClass("mui-bar mui-bar-tab");

    var $content;
    if ($id.next(".mui-content").length>0) {
        $content = $id.next(".mui-content");
    } else {
        $id.after("<div class='mui-content'>");
        $content = $id.next(".mui-content");
    }
    options.forEach(function(v,k,a){
        if (v.href) {
            var h = v.href;
            if (h.substring(0,1)!=="#"){
                if (!(v.target&&v.target=="blank")) {
                    $id.children("a").eq(k).attr("href","#"+id+k);
                }
                $content.append("<div id='"+id+k+"' class='mui-control-content'>\
                    <iframe frameborder='no' border='0' src='"+h+"' style='width:100%;height:100%;'></iframe>\
                    </div>");
            } 
        }
    });
};

h5ui.datalist = function(id,options){
    this.id = id;
    var $id = $("#"+id);
    if (!options) {
        options = [];
        var $lis = $id.children("li");
        $lis.each(function(){
            var $this = $(this);
            var o = "{"+$this.attr("data-options")+"}";
            var opts = eval('(' + o + ')');
            options.push(opts);

            $this.addClass("mui-table-view-cell");
            var innerhm = $this.html();
            var cm =  opts.content?'<p class="mui-h6 mui-ellipsis">'+opts.content+'</p>':'';
            var tm = opts.tag?'<div class="mui-table-cell mui-col-xs-2 mui-text-right">\
                        <span class="mui-h5">'+opts.tag+'</span>\
                    </div>':'';
            var hm = '<div class="mui-table">\
                    <div class="mui-table-cell mui-col-xs-10">\
                        <h4 class="mui-ellipsis">'+opts.title+'</h4>\
                        '+cm+'\
                    </div>\
                    '+tm+'\
                </div>';
            $this.html(hm);
        });
    }

    this.options = options;
    $id.addClass("mui-table-view mui-table-view-striped mui-table-view-condensed");

    // <div class="mui-scroll-wrapper"><div class="mui-scroll">
};

h5ui.datalist.prototype = {
    resize: function(param) {
        var id = this.id;
        var $id = $("#"+id);
        if (typeof(param.height)!=='undefined') {
            $id.css("height",param.height+"px");
        }
    },
    getsize: function(){
        var id = this.id;
        var $id = $("#"+id);
        return {
            width:$id.width(),
            height:$id.height()
        };
    }
};

h5ui.form = function(id,options) {
    this.id = id;
    this.fields = {};
    if (!options) {
        options = {};
    }
    this.options = options;
    if (typeof(options.autoParse)!=='boolean') {
        options.autoParse = true;
    }

    var $id = $("#"+id);
    $id.attr("onSubmit","return false");
    this.init();
};

h5ui.form.prototype = {
    init: function(){
        var selfs = this;
        if (selfs.options.autoParse) {
            var fields_id = h5ui.parser.getctlbynode("#"+this.id);
            fields_id.forEach(function(v,i,a){
                selfs.fields[v] = window[v];
            });
        }
    },
    getData : function(){
        var datas = {};
        for(var p in this.fields ){
            datas[p]=this.fields[p].getValue();
        }
        return datas;
    },
    getNotNullData : function(){
        var datas = {};
        for(var p in this.fields ){
            var v = this.fields[p].getValue();
            if(v && v != ''){
                datas[p]=this.fields[p].getValue();
            }
        }
        return datas;
    },
    isValid:function(callback){

        function validform(fields,p){
            fields[p].isValid(function(rs){
                if (rs) {
                    if (fields.length>p+1){
                        validform(fields,p+1);
                    } else {
                        if (callback)
                            callback(rs);
                    }
                } else {
                    if (callback)
                        callback(rs);
                }
            });
        }

        var that = this;
        var fields = [],f=true;
        for(var p in that.fields ){
            if (that.fields[p].isValid)
                fields.push(that.fields[p]);
        }
        if (fields.length>0) {
            validform(fields,0);
        }
    },
    load: function(data){
        for(var p in data){
            var item = this.fields[p];
            if (item&&data[p]!==null)
                this.fields[p].setValue(data[p]);
        }
    },
    clear: function(){
        for(var p in this.fields ){
            if (this.fields[p].clear)
                this.fields[p].clear();
        }
    },
    readonly: function(f){
        for(var p in this.fields ){
            if (this.fields[p].readonly)
                this.fields[p].readonly(f);
        }
    },
    getsize: function(){
        var id = this.id;
        var $id = $("#"+id);
        return {
            width:$id.width(),
            height:$id.height()
        };
    },
    resize: function(param) {
        var id = this.id;
        var $id = $("#"+id);
        if (typeof(param.height)!=='undefined') {
            $id.css("height",param.height+"px");
        }
    },
    enableValidation:function(){
        for(var p in this.fields ){
            if (this.fields[p].enableValidation)
                this.fields[p].enableValidation();
        }
    },
    disableValidation:function(){
        for(var p in this.fields ){
            if (this.fields[p].disableValidation)
                this.fields[p].disableValidation();
        }
    },
    disable:function(f) {
        for(var p in this.fields ){
            if (this.fields[p].disable)
                this.fields[p].disable(f);
        }
    },
    showicon:function(f){
        for(var p in this.fields ){
            if (this.fields[p].showicon)
                this.fields[p].showicon(f);
        }
    }
};

h5ui.button = function(id,options){
    this.id = id;
    var defaultOptions = {
        readonly:false
    };
    var $id = $("#"+id);
    if (!options) {
        if (typeof($id.attr("data-options"))=='undefined') {
            return;
        }
         var o = "{"+$id.attr("data-options")+"}";
         var opts = eval('(' + o + ')');
         options = opts;
    }
    $id.removeAttr("data-options");
    for(var o in defaultOptions) {
        if ('undefined'==typeof(options[o])) {
            options[o] = defaultOptions[o];
        }
    }
    this.options = options;
    this.select = $("#"+id);
    this.init();
    this.bindevent();
};

h5ui.button.prototype = {
    init: function(){
        var options = this.options;
        this.select.attr("type","button");
        this.select.addClass("mui-btn").addClass("mui-btn-primary");
        if (options.display&&options.display=="block") {
            this.select.addClass("mui-btn-block");
        }
    },
    bindevent: function() {
        var id = this.id;
        var options = this.options;
        for(var o in options) {
            (function(o,options,id){
                if (typeof(options[o])=='function') {
                    switch(o)
                    {
                        case "onClick":
                            document.getElementById(id).addEventListener("tap",function () {
                                if (!options.readonly) {
                                    options[o]();
                                }
                            });
                            break;
                    }
                }
            })(o,options,id);
        }
    },
    getValue:function(){
        return "";
    },
    show:function(){
        var $id = $("#"+this.id);
        $id.show();
    },
    hide:function(){
        var $id = $("#"+this.id);
        $id.hide();
    },
    readonly:function(f){
        if (f) {
            this.options.readonly = true;
        } else {
            this.options.readonly = false;
        }
    }
};

h5ui.star = function(id,options){
    this.id = id;
    var defaultOptions = {
        label:"",
        value:0
    };
    var $id = $("#"+id);
    if (!options) {
        if (typeof($id.attr("data-options"))=='undefined') {
            return;
        }
        var o = "{"+$id.attr("data-options")+"}";
        var opts = eval('(' + o + ')');
        options = opts;
    }

    for(var o in defaultOptions) {
        if ('undefined'==typeof(options[o])) {
            options[o] = defaultOptions[o];
        }
    }
    $id.removeAttr("data-options");
    this.options = options;
    this.init();
};

h5ui.star.prototype = {
    init: function(){
        var id = this.id;
        var options = this.options;
        var $id = $("#"+id);
        $id.before('<label for="'+id+'">'+options.label+'</label>');
        $id.append('<i data-index="1" class="mui-icon mui-icon-star"></i>\
                    <i data-index="2" class="mui-icon mui-icon-star"></i>\
                    <i data-index="3" class="mui-icon mui-icon-star"></i>\
                    <i data-index="4" class="mui-icon mui-icon-star"></i>\
                    <i data-index="5" class="mui-icon mui-icon-star"></i>');

        mui('#'+id).on('tap','i',function(){
            var index = parseInt(this.getAttribute("data-index"));
            options.value = index;
            var parent = this.parentNode;
            var children = parent.children;
            if(this.classList.contains("mui-icon-star")){
                for(var i=0;i<index;i++){
                    children[i].classList.remove('mui-icon-star');
                    children[i].classList.add('mui-icon-star-filled');
                }
            }else{
                for (var i = index; i < 5; i++) {
                    children[i].classList.add('mui-icon-star')
                    children[i].classList.remove('mui-icon-star-filled')
                }
            }
        });
        if (options.value>0) {
            this.setValue(options.value);
        }
    },
    getValue: function(){
        return this.options.value;
    },
    setValue: function(value){
        var $nodes = $("#"+this.id).find("i");
        var index = parseInt(value)-1;
        var options = this.options;
        if (index>=0&&index<6) {
            mui.trigger($nodes[index],"tap");
        }
    }
};

h5ui.textbox = function(id,options) {
    this.id = id;
    var defaultOptions = {
        width:"100%",
        label:"",
        labelWidth:"35%",
        valid:"",
        value:"",
        type:"textbox",
        text:"",
        tag:"",
        icon:"",
        sequence:"icon-tag",
        disable:false,
        textAlign:"right",
        onClickIcon:function(){},
        onClickTag:function(){}
    };

    var $id = $("#"+id);
    if (!options) {
        if (typeof($id.attr("data-options"))=='undefined') {
            return;
        }
        var o = "{"+$id.attr("data-options")+"}";
        var opts = eval('(' + o + ')');
        options = opts;
    }

    for(var o in defaultOptions) {
        if ('undefined'==typeof(options[o])) {
            options[o] = defaultOptions[o];
        }
    }

    $id.removeAttr("data-options");

    this.options = options;
    this.init(options);
    this.bindevent();
    this.container;
};

h5ui.textbox.prototype = {
    init:function(options){
        var that = this;
        var id = this.id;
        var $id = $("#"+id);
        $id.attr("name",id);
        if ("password"==that.options.type) {
            $id.attr("type","password");
        } else if ("number"==that.options.type) {
            $id.attr("type","number");
        } else {
            $id.attr("type","text");
        }
        $id.wrap("<div id='"+id+"-container' style='width:"+options.width+"' class='zbui-box'></div>");
        $id.attr("v-validate","'"+options.valid+"'");
        $id.after("<span class='text-valid-msg'>{{errors.first('"+id+"')}}</span>");

        if (options.readonly) {
            $id.after("<div class='text-shadow readonly'></div>");
        } else {
            $id.after("<div class='text-shadow'></div>");
        }
        var wp;
        if (options.tag||options.icon) {
            var div=document.createElement("div");
            div.className = "textbox-handle";

            var sp = options.sequence.split("-");
            for (var i = 0; i < sp.length; i++) {
                drawcell(sp[i]);
            }

            function drawcell(span){
                switch(span)
                {
                    case 'icon':
                        if (options.icon) {
                            var img= document.createElement("img");
                            img.setAttribute("src", options.icon);
                            div.appendChild(img);
                        }
                        break;
                    case 'tag':
                        if (options.tag) {
                            var a=document.createElement("a");
                            var tag=document.createTextNode(options.tag);
                            a.appendChild(tag);
                            div.appendChild(a);
                        }
                        break;
                }
            }

            $id.parent()[0].appendChild(div);
            var w = $(div).outerWidth();
            if ($id.parent().hasClass("mui-navigate-right")){
                wp = w+18;
            } else {
                wp = w;
            }
        }
        var vp;
        if (options.label) {
            var star = "";
            if (options.valid&&options.valid.indexOf("required")>=0){
                star = "<span class='text-star'>*</span>"
            }
            $id.before("<label for='"+id+"' style='width:"+options.labelWidth+"'>"+star+options.label+"</label>");
            var vw = 1-options.labelWidth.substring(0,options.labelWidth.indexOf("%"))/100;
            vp = (Math.round(vw * 10000)/100).toFixed(2) + '%';
        }

        $id.wrap("<div class='zbui-input'></div>");
        $id.before("<div v-if='options.disable==true'>{{options.value}}</div>");
        $id.parent().css("width",vp).css("padding-right",wp+"px");
        if (options.textAlign=="left") {
            $id.parent().css("text-align","left");
        }
       
        Vue.use(VeeValidate, {
          locale: 'zh_CN'
        });
        this.container = new Vue({
            el: '#'+id+'-container',
            data:{options:options},
            mounted:function(){
                var options = that.options;
                document.getElementById(id).value=options.value;
                if (options.prompt) {
                    that.setPrompt(options.prompt);
                }
                if (options.readonly) {
                    that.readonly(options.readonly);
                }

                if (options.disable) {
                    that.disable(true);
                }


                var options = that.options;
                var $id = $("#"+that.id);
                if (options.icon&&options.onClickIcon){
                    $id.parents(".zbui-box").find(".textbox-handle img")[0].addEventListener("tap",function(){
                        options.onClickIcon();
                    });
                }
                if (options.tag&&options.onClickTag){
                    $id.parents(".zbui-box").find(".textbox-handle a")[0].addEventListener("tap",function(){
                        options.onClickTag();
                    });
                }
            }
        });
    },
    isValid:function(callback){
        var id = this.id;
        this.container.$validator.validateAll().then(function(result){
            if (callback)
                callback(result);
        });
    },
    setPrompt:function(prompt){
        var id = this.id;
        var options = this.options
        if (typeof(prompt)!=='undefined') {
            $("#"+id).attr("placeholder",prompt);
        } else if (options.prompt) {
            $("#"+id).attr("placeholder",options.prompt);
        }
    },
    bindevent:function(){
        this.onChange = function(func){
            $("#"+id).unbind('change').bind('change',function(){
                func(selfs.getValue());
            });
        };

        this.focus = function(func){
            $("#"+id).unbind('focus').bind('focus',function(){
                func();
            });
        };

        this.blur = function(func){
            $("#"+id).unbind('blur').bind('blur',function(){
                func();
            });
        };

        this.keydown = function(func){
            $("#"+id).unbind('keydown').bind('keydown',function(){
                func();
            });
        };

        this.keyup = function(func){
            $("#"+id).unbind('keyup').bind('keyup',function(){
                func();
            });
        };

        var selfs = this;
        var id = this.id;
        var options = this.options;
        for(var o in options) {
            (function(o,options,id){
            if (typeof(options[o])=='function') {
                switch(o)
                {
                    case "onChange":
                    selfs.onChange(options[o]);
                    break;
                    case "focus":
                    selfs.focus(options[o]);
                    break;
                    case "blur":
                    selfs.blur(options[o]);
                    break;
                    case "keydown":
                    selfs.keydown(options[o]);
                    break;
                    case "keyup":
                    selfs.keyup(options[o]);
                    break;
                    default:
                    // console.log("default");
                }
            }
        })(o,options,id);
        }
    },
    setOptions:function(options){
        for(var o in options) {
            this.options[o] = options[o];
        }
        this.bindevent();
    },
    setValue:function(value){
        var id = this.id;
        var ovalue = this.getValue();
        this.options.value = value;
        if (!this.options.text)
            document.getElementById(id).value=value;
        this.isValid();
        if (ovalue!=value&&this.options.onChange) {
            this.options.onChange(value);
        }
    },
    setText:function(value){
        this.options.value = this.getValue();
        this.options.text = value;
        document.getElementById(this.id).value=value;
    }, 
    getValue:function(){
        if (this.options.text) {
            return this.options.value;
        } else {
            return document.getElementById(this.id).value;
        }
    },
    getText:function(){
        return document.getElementById(this.id).value;
    },
    readonly:function(f){
        var id = this.id;
        var $id = $("#"+id);
        if (f) {
            $id.attr("readonly","readonly");
            $id.parents(".zbui-box").find(".text-shadow").addClass("readonly");
            this.setPrompt("");
        } else {
            $id.removeAttr("readonly");
            $id.parents(".zbui-box").find(".text-shadow").removeClass("readonly");
            this.setPrompt();
        }
    },
    disable:function(f){
        var id = this.id;
        var $id = $("#"+id);
        this.options.disable = f;
        if (f){
            $id.css("display","none");
        } else {
            $id.css("display","block");
        }
    },
    clear:function(){
        var id = this.id;
        document.getElementById(id).value="";
    },
    hide:function(){
        var id = this.id;
        $("#"+id).parents(".zbui-input-row").css("display","none");
    },
    show:function(){
        var id = this.id;
        $("#"+id).parents(".zbui-input-row").css("display","block");
    },
    enableValidation:function(){
        this.container.$validator.resume();
        this.container.$validator.validateAll();
        var $c = $("#"+this.id+"-container");
        $c.find(".text-valid-msg").css("display","block");
        $c.find(".text-star").css("display","block");
    },
    disableValidation:function(){
        this.container.$validator.pause();
        var $c = $("#"+this.id+"-container");
        $c.find(".text-valid-msg").css("display","none");
        $c.find(".text-star").css("display","none");
    },
    resize:function(){
        var id = this.id;
        var $input = $("#"+id).parents(".zbui-input");
        var $h = $input.parent().find(".textbox-handle");
        $input.css("padding-right",$h.width()+"px");
    },
    showicon:function(f){
        var id = this.id;
        var $box = $("#"+id).parents(".zbui-box");
        var $img = $box.find(".textbox-handle img");
        if (f) {
            $img.show();
        } else {
            $img.hide();
        }
        this.resize();
    }
};

h5ui.numberbox = function(id,options) {
    this.id = id;
    this.options = options;
    this.init(options);
    this.numberbox = mui("#"+this.id).numbox();
    this.bindevent();
    this.container;
};

h5ui.numberbox.prototype = {
    readonly:function(f){
        var id = this.id;
        var $id = $("#"+id);
        if (f) {
            $id.find(".mui-input-numbox").attr("readonly","readonly");
            $id.find(".text-shadow").addClass("readonly");
        } else {
            $id.find(".mui-input-numbox").removeAttr("readonly");
            $id.find(".text-shadow").removeClass("readonly");
        }
    },
    init:function(options){
        var id = this.id;
        var options = this.options;
        var $id = $("#"+id);
        if (!options) {
            if (typeof($id.attr("data-options"))=='undefined') {
                return;
            }
            var o = "{"+$id.attr("data-options")+"}";
            var opts = eval('(' + o + ')');
            options = opts;
        }
        $id.removeAttr("data-options");
        $id.before("<label for='"+id+"'>"+options.label+"</label>");
        $id.addClass("mui-numbox").attr("data-numbox-step",options.step).attr("data-numbox-min",options.min).attr("data-numbox-max",options.max);
        $id.html("<button class=\"mui-btn mui-btn-numbox-minus\" type=\"button\">-</button>" +
            "<input class=\"mui-input-numbox\" type=\"number\" name=\""+id+"\" />" +
            "<button class=\"mui-btn mui-btn-numbox-plus\" type=\"button\">+</button><div class=\"text-shadow\"></div>");
        if (options.value) {
            $("#"+id).find(".mui-input-numbox").val(options.value);
        }
        if (options.readonly) {
            this.readonly(options.readonly);
        }
    },
    setOptions:function(options){
        for(var o in options) {
            this.options[o] = options[o];
        }
        this.bindevent();
    },
    bindevent:function(){
        this.onChange = function(func){
            $("#"+id).find(".mui-input-numbox").unbind('change').bind('change',function(){
                func(selfs.getValue());
            });
        };

        this.focus = function(func){
            $("#"+id).find(".mui-input-numbox").unbind('focus').bind('focus',function(){
                func();
            });
        };

        this.blur = function(func){
            $("#"+id).find(".mui-input-numbox").unbind('blur').bind('blur',function(){
                func();
            });
        };

        this.keydown = function(func){
            $("#"+id).find(".mui-input-numbox").unbind('keydown').bind('keydown',function(){
                func();
            });
        };

        this.keyup = function(func){
            $("#"+id).find(".mui-input-numbox").unbind('keyup').bind('keyup',function(){
                func();
            });
        };

        var selfs = this;
        var id = this.id;
        var options = this.options;
        for(var o in options) {
            if (typeof(options[o])=='function') {
                switch(o)
                {
                    case "onChange":
                    this.onChange(options[o]);
                    break;
                    case "focus":
                    this.focus(options[o]);
                    break;
                    case "blur":
                    this.blur(options[o]);
                    break;
                    case "keydown":
                    this.keydown(options[o]);
                    break;
                    case "keyup":
                    this.keyup(options[o]);
                    break;
                    default:
                    console.log("default");
                }
            }
        }
    },
    getValue:function(){
        return this.numberbox.getValue();
    },
    setValue:function(value){
        this.numberbox.setValue(value);
    },
    getText:function(){
        return this.numberbox.getValue();
    },
    clear:function(value){
        this.numberbox.setValue(0);
    },
    hide:function(){
        var id = this.id;
        $("#"+id).parents(".zbui-input-row").css("display","none");
    },
    show:function(){
        var id = this.id;
        $("#"+id).parents(".zbui-input-row").css("display","block");
    }
};

h5ui.switchbutton = function(id,options){
    this.id = id;
    this.options = options;
    this.init(options);
};

h5ui.switchbutton.prototype = {
    init:function(options){
        var id = this.id;

        var $id = $("#"+id);
        if (!options) {
            if (typeof($id.attr("data-options"))=='undefined') {
                return;
            }
            var o = "{"+$id.attr("data-options")+"}";
            var opts = eval('(' + o + ')');
            options = opts;
        }
        $id.removeAttr("data-options");

        $id.before("<label for='"+id+"'>"+options.label+"</label>");
        $id.addClass("mui-switch");
        $id.html("<div class=\"mui-switch-handle\"></div>");

        if (options.value) {
            $("#"+id).addClass("mui-active");
        }
        if (options.readonly) {
            this.readonly(options.readonly);
        }
        document.getElementById(id).addEventListener("toggle",function(event){
            if (options.onChange){
                options.onChange(event.detail.isActive);
            }
        });
        mui('#'+id)['switch']();
    },
    getValue:function(){
        var id = this.id;
        var rs = false;
        if ($("#"+id).hasClass("mui-active")) {
            rs = true
        }
        return rs;
    },
    setValue:function(f){
        var id = this.id;
        var $id = $("#"+id);
        if (f) {
            $id.addClass("mui-active");
        } else {
            $id.removeClass("mui-active");
        }
    },
    clear:function(){
    },
    readonly:function(f){
        var id = this.id;
        if (f) {
            $("#"+id).addClass("mui-disabled");
        } else {
            $("#"+id).removeClass("mui-disabled");
        }
    },
    hide:function(){
        var id = this.id;
        $("#"+id).parents(".zbui-input-row").css("display","none");
    },
    show:function(){
        var id = this.id;
        $("#"+id).parents(".zbui-input-row").css("display","block");
    }
};

h5ui.multitext = function(id,options){
    h5ui.textbox.call(this,id,options);
    options = this.options;
    if (options.rows) {
        $("#"+this.id).attr("rows",options.rows);
    }
    var $id = $("#"+id);
    $id.css("width","inherit");
    $id.parent(".zbui-input").addClass("multitext");
    if (options.autoheight) {
        this.autoHeight();
    }
};

(function(){
  var Super = function(){};
  Super.prototype = h5ui.textbox.prototype;
  h5ui.multitext.prototype = new Super();
})();

Object.assign(h5ui.multitext.prototype,{
    hide:function(){
        var id = this.id;
        var $id = $("#"+id);
        $id.parents(".zbui-multi-row").css("display","none");
        $id.parents(".zbui-input-row").css("display","none");
    },
    show:function(){
        var id = this.id;
        var $id = $("#"+id);
        $id.parents(".zbui-multi-row").css("display","block");
        $id.parents(".zbui-input-row").css("display","block");
    },
    autoHeight:function() {
        var elem = document.getElementById(this.id);
        var extra,maxHeight;
        extra = extra || 0;
        var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
        isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
        addEvent = function(type, callback) {
            elem.addEventListener ?
            elem.addEventListener(type, callback, false) :
            elem.attachEvent('on' + type, callback);
        },
        getStyle = elem.currentStyle ? function(name) {
            var val = elem.currentStyle[name];

            if (name === 'height' && val.search(/px/i) !== 1) {
                var rect = elem.getBoundingClientRect();
                return rect.bottom - rect.top -
                parseFloat(getStyle('paddingTop')) -
                parseFloat(getStyle('paddingBottom')) + 'px';
            };

            return val;
        } : function(name) {
            return getComputedStyle(elem, null)[name];
        },
        minHeight = parseFloat(getStyle('height'));


        elem.style.resize = 'none';

        var change = function() {
            var scrollTop, height,
            padding = 0,
            style = elem.style;

            if (elem._length === elem.value.length) return;
            elem._length = elem.value.length;

            if (!isFirefox && !isOpera) {
                padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
            };
            scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

            elem.style.height = minHeight + 'px';
            if (elem.scrollHeight > minHeight) {
                if (maxHeight && elem.scrollHeight > maxHeight) {
                    height = maxHeight - padding;
                    style.overflowY = 'auto';
                } else {
                    height = elem.scrollHeight - padding;
                    style.overflowY = 'hidden';
                };
                style.height = height + extra + 'px';
                scrollTop += parseInt(style.height) - elem.currHeight;
                document.body.scrollTop = scrollTop;
                document.documentElement.scrollTop = scrollTop;
                elem.currHeight = parseInt(style.height);
            };
        };

        addEvent('propertychange', change);
        addEvent('input', change);
        addEvent('focus', change);
        change();
    }
});

h5ui.combobox = function(id,options){
    h5ui.textbox.call(this,id,options);
    var selfs = this;
    var defaultOptions = {
        layer:1,
        data:[],
        readonly:false,
        idField:'id',
        textField:'text',
        async:false,
        asyncload:false,
        finished:false,
        ontriggerChange:function(pick){},
        onLoadSuccess:function(){}
    };
    for(var o in defaultOptions) {
        if ('undefined'==typeof(this.options[o])) {
            this.options[o] = defaultOptions[o];
        }
    }
    this.picker;
    if (!this.options.asyncload) {
            this.doview();
            setTimeout(function(){
                selfs.dodata();
            },100);
    }else {
        var id = this.id;
        var Result = document.getElementById(id);
        var load = function(event){
            if (!selfs.options.readonly) {
                Result.removeEventListener('click',load);
                selfs.doview1();
                setTimeout(function(){
                    selfs.dodata();
                },100);
            }
        };
        Result.addEventListener('click',load);
    }
    $("#"+id).attr("readonly",true);
    var $c = $("#"+id).parents(".zbui-box");
    $c.addClass("mui-navigate-right");
    this.wait = false;
};

(function(){
  var Super = function(){};
  Super.prototype = h5ui.textbox.prototype;
  h5ui.combobox.prototype = new Super();
})();

Object.assign(h5ui.combobox.prototype,{
    setPrompt:function(prompt){
        var id = this.id;
        var options = this.options;
        if (typeof(prompt)!=='undefined') {
            $("#"+id).attr("placeholder",prompt);
        } else if (options.prompt) {
            $("#"+id).attr("placeholder",options.prompt);
        }
    },
    bindevent:function(){
        var selfs = this;
        var id = this.id;
        var options = this.options;
        for(var o in options) {
            if (typeof(options[o])=='function') {
                switch(o)
                {
                    default:
                    // console.log("default");
                }
            }
        }
    },
    dodata:function(){
        var trancode,params;
        if (this.options.trancode) {
            trancode = this.options.trancode;
        } else {
            if (this.options.data) {
                this.loadData(this.options.data);
            } else {
                this.loadData([]);
            }
        }
        if (this.options.params) {
            params = this.options.params;
        }
        var selfs = this;
        if (trancode&&params) {
            h5ui.ajax(trancode,params,function(data){
                if(data.status >=0){
                    selfs.loadData(data.data);
                }else{
                    alert(data.desc);
                    selfs.loadData([]);
                }
            },false);
        }
        if (selfs.options.value&&selfs.picker.pickers[0]) {
            var va = selfs.options.value.split(",");
            selfs.picker.pickers[0].setSelectedValue(va[0]);
        } else {
            selfs.picker.pickers[0].setSelectedIndex(0);
        }
    },
    doview1:function(){
        this.doview(true);
    },
    doview:function(f){
        var id = this.id;
        var options = this.options;
        var selfs = this;
        var $ = mui;
        var jq = jQuery;
        var doc = document;
        var opt = options;
        var userPicker = new $.PopPicker({
            layer:opt.layer,
            ontriggerChange:options.ontriggerChange,
            target:selfs
        });
        jQuery(userPicker.panel).find(".mui-poppicker-header .mui-btn:eq(0)").before("<div class='mui-popicker-label'>"+options.label+"</div>");

        selfs.picker = userPicker;
        var Result = doc.getElementById(id);

        function save(items) {
            var ovalue = selfs.getValue();
            var value = "",text="";
            items.forEach(function(v,index,arr){
                if (v[selfs.options.textField]){
                    text += v[selfs.options.textField]
                }
                if (v[selfs.options.idField]){
                    value += v[selfs.options.idField]+","
                }
            });
            value = value.substring(0,value.length-1);
            selfs.options.value = value;
            Result.value = text;

            if (opt.onUnselect&&ovalue!==value) {
                opt.onUnselect(items);
            }

            if (opt.onSelect) {
                opt.onSelect(items);
            }
            selfs.isValid();
            if (opt.onChange&&ovalue!==value) {
                opt.onChange(value);
            }
        }
        if (f) {
                userPicker.show(save);
            Result.addEventListener('tap',function(event){                
                    userPicker.show(save);                
            }, false);
        } else {
            Result.addEventListener('tap',function(event){
                if (!selfs.options.readonly) {                
                    userPicker.show(save);
                }               
            }, false);
        }
    },
    loadData:function(data){
        function dwdata(data,idField,textField) {
            data.forEach(function(v,index,arr){
                if (idField&&v[idField]) {
                    if (v.value) {
                        v.pre_value = v.value;
                    }
                    v.value = v[idField];
                }
                if (textField&&v[textField]) {
                    if (v.text) {
                        v.pre_text = v.text;
                    }
                    v.text = v[textField];
                }
                if (v.children&&v.children.length>0) {
                    data.children = dwdata(v.children,idField,textField);
                }
            });
            return data;
        }
        data = dwdata(data,this.options.idField,this.options.textField);
        this.options.data = data;
        if (this.picker) {
            this.picker.setData(data);
        }
        var selfs = this;
        if (selfs.options.value) {
            selfs.setValue(selfs.options.value);
        }
    },
    load:function(params) {
        var selfs = this;
        var trancode = this.options.trancode;
        h5ui.ajax(trancode,params,function(data){
            if (data.status >=0) {
                selfs.picker.setData(data.data);
            } else {
                alert(data.desc);
            }
        });
    },
    getSelected:function() {
        var v1 = this.options.value;
        var pickers = this.picker.getSelectedItems();
        var v2="";
        pickers.forEach(function(v,index,arr){
            if (v.value) {
                v2 += v.value+",";
            }
        });
        if (v2!=="") {
            v2 = v2.substring(0,v2.length-1);
        }
        if (v1==v2) {
            return pickers;
        } else {
            return null;
        }
    },
    setValue:function(value){

        function getIndex(v,values,data){//v 值  index:第几个picker  data:所有值

            var seq = $.inArray(v,values);

            var arr;

            if (seq==0) {
                arr = data;
            } else if (seq>0) {
                arr = getchildrenbyvlaue(values[seq-1],data);
            }

            if (!arr) {
                return;
            }

            var rs;
            arr.forEach(function(val,i,a){
                if(val.value == v) {
                    rs = {
                        index:i,
                        data:val
                    };
                }
            });
            return rs;
        }

        function getchildrenbyvlaue(value,data){
            var rs,f=true;
            data.forEach(function(v,i,a){
                if (f) {
                    if (v.value==value) {
                        rs = v.children;
                        f = false;
                    } else if (v.children&&v.children.length>0) {
                        var r = getchildrenbyvlaue(value,v.children);
                        if (r) {
                            rs = r;
                            f = false;
                        }
                    }
                }
            });
            return rs;
        }

        var selfs = this;
        if (!value) {
            return;
        }
        if (selfs.wait) {
            setTimeout(function(){
                selfs.setValue(value);
            },200);
            return;
        }
        var ovalue = selfs.options.value;
        selfs.options.value = value;
        if(selfs.options.async){
            var value = value.split(",");
            var id = this.id;
            if (!selfs.options.asyncload) {
                document.getElementById(id).value = "";
            }
            if (selfs.picker&&selfs.picker.pickers[0])
                selfs.picker.pickers[0].setSelectedValue(value[0]);

        } else {
            selfs.wait = true;
            var pickers = this.picker.pickers;
            var value = value.split(",");
            var id = this.id;
            document.getElementById(id).value = "";
                value.forEach(function(v,index,arr){
                    var vs = v;
                    var level = getIndex(v,value,selfs.options.data);
                    if (typeof(level)=="undefined"||typeof(level.index)=="undefined") {
                        selfs.wait = false;
                        return ;
                    }
                    pickers[index].setSelectedIndex(level.index,200,function(){
                        document.getElementById(id).value += level.data.text;
                        selfs.isValid();
                        selfs.wait = false;
                    });
                });
        }
        if (ovalue!==value.join(",")&&selfs.options.onChange) {
            selfs.options.onChange(selfs.options.value);
        }
    },
    getValue:function(){
        return this.options.value;
    },
    readonly:function(f){
        var id = this.id;
        var $id = $("#"+id);
        var $p = $id.parents(".zbui-box");
        if (f) {
            this.options.readonly = true;
            $p.find(".text-shadow").addClass("readonly");
            this.setPrompt("");
            $p.removeClass("mui-navigate-right");
        } else {
            this.options.readonly = false;
            $p.find(".text-shadow").removeClass("readonly");
            this.setPrompt();
            $p.addClass("mui-navigate-right");
        }
    },
    getData:function(){
        return this.options.data;
    },
    clear:function(){
        var id = this.id;
        document.getElementById(id).value="";
        this.options.value = "";
    }
});

h5ui.datebox = function(id,options){
    h5ui.textbox.call(this,id,options);
    if (!this.options.readonly){
        this.options.readonly = false;
    }
    this.picker;
    $("#"+this.id).attr("readonly",true);
    this.doevent();
    var $c = $("#"+id).parents(".zbui-box");
    $c.addClass("mui-navigate-right");
};

(function(){
  var Super = function(){};
  Super.prototype = h5ui.textbox.prototype;
  h5ui.datebox.prototype = new Super();
})();

Object.assign(h5ui.datebox.prototype,{
    doevent:function(){
        var id = this.id;
        var options = this.options;
        (function($,id,doc,opt,selfs) {
            $.init();
            var result = $('#'+id)[0];
            var btns = $('.btn');
            var optionsJson = opt.type || '{}';
            var options = eval('(' + optionsJson + ')'); 
            var Result = doc.getElementById(id);
            var picker = new $.DtPicker(options);
            jQuery(picker.ui.picker).find(".mui-dtpicker-header .mui-btn:eq(0)").before("<div class='mui-popicker-label'>"+opt.label+"</div>");

            selfs.picker = picker;
            var value = opt.value;
            if (value) {
                selfs.setValue(value);
            }
            Result.addEventListener('click',function(event){
                if (!selfs.options.readonly) {
                    var ovalue = selfs.getValue();
                    picker.show(function(rs) {
                        if (rs) {
                            Result.value = rs.value;
                            selfs.isValid();
                            selfs.options.value = rs.value;
                            var value = rs.value;
                            if (opt.onUnselect&&ovalue!==value) {
                                opt.onUnselect(rs);
                            }

                            if (opt.onSelect) {
                                opt.onSelect(rs);
                            }

                            if (opt.onChange&&ovalue!==value) {
                                opt.onChange(rs);
                            }
                        }
                    });
                }
            });
        })(mui,id,document,options,this);
    },
    getValue:function(){
        return this.options.value;
    },
    setValue:function(value){
        var id = this.id;
        var selfs = this;
        var ovalue = this.options.value;
        this.options.value = value;
        this.picker.setSelectedValue(value,200);
        document.getElementById(id).value = value;
        selfs.isValid();
        if (ovalue!==value&&selfs.options.onChange) {
            selfs.options.onChange(value);
        }
    },
    readonly:function(f){
        var id = this.id;
        var $id = $("#"+id);
        var $p = $id.parents(".zbui-box");
        if (f) {
            this.options.readonly = true;
            $p.find(".text-shadow").addClass("readonly");
            this.setPrompt("");
            $p.removeClass("mui-navigate-right");
        } else {
            this.options.readonly = false;
            $p.find(".text-shadow").removeClass("readonly");
            this.setPrompt();
            $p.addClass("mui-navigate-right");
        }
    },
    clear:function(){
        var id = this.id;
        document.getElementById(id).value="";
    }
});

h5ui.checklist = function(id,options){
    this.id = id;
    var defaultOptions = {
        valid:"",
        readonly:false,
        labelSplit:false,//lable与内容是否分行显示
        cellSplist:false,//选项是否一行显示一个
        onLoadSuccess:function(){},
        onUpdated:function(){}
    };
    var $id = $("#"+id);
    if (!options) {
        if (typeof($id.attr("data-options"))=='undefined') {
            return;
        }
         var o = "{"+$id.attr("data-options")+"}";
         var opts = eval('(' + o + ')');
         options = opts;
    }

    options.id = id;
    $id.removeAttr("data-options");
    for(var o in defaultOptions) {
        if ('undefined'==typeof(options[o])) {
            options[o] = defaultOptions[o];
        }
    }
    if (options.title) {
        options.label = options.title;
    }
    this.options = options;
    if (options.view&&options.view=="button") {
        $id.addClass("f-view-button");
    }
    if (options.labelSplit) {
        $id.addClass("checklist_labelSplit");
    }
    if (options.cellSplit) {
        $id.addClass("checklist_cellSplit");
    }
    this.checkboxlist;
    this.init();
    this.bindevent();
};

h5ui.checklist.prototype = {
    init:function(){
        function dwdata(data,idField,textField) {
            if (!data) {
                data = [];
            }
            data.forEach(function(v,index,arr){
                if (idField&&v[idField]) {
                    if (v.value) {
                        v.pre_value = v.value;
                    }
                    v.value = v[idField];
                }
                if (textField&&v[textField]) {
                    if (v.text) {
                        v.pre_text = v.text;
                    }
                    v.text = v[textField];
                }
                if (v.children&&v.children.length>0) {
                    data.children = dwdata(v.children,idField,textField);
                }
            });
            return data;
        }
        var selfs = this;
        var id = this.id;
        var options = this.options;
        var data = options.data;
        if (options.trancode&&options.params) {
            var trancode = options.trancode;
            var params = options.params;
            h5ui.ajax(trancode,params,function(data){
                if (data.status >=0) {
                    options.data=dwdata(data.data,options.idField,options.textField);
                } else {
                    alert(data.desc);
                }
            },false);
        } else {
            options.data=dwdata(data,options.idField,options.textField);
        }
        Vue.component('checkboxlist', {
            template: '<div :class="typeof(option.label)==\'string\'?\'\':\'f-nolabel\'">\
                <label v-if="option.label!==undefined">\
                    <span class="text-star" v-if="option.valid.indexOf(\'required\')>=0">*</span>\
                    {{option.label}}\
                </label>\
                <div class="zbui-checklist-content">\
                    <div class="mui-input-row mui-checkbox mui-left" v-for="(item,index) in option.data" v-on:click="onClickCell(item,index,$event)">\
                        <label>{{item.text}}</label>\
                        <input :id="[option.id+'+"'_'"+'+index]" :name="option.id" :value="item.value" type="checkbox" >\
                    </div>\
                </div>\
            </div>',
            data: function() {
                return {
                    option:options
                }
            },
            methods: {
                onClickCell:function(item,index,e){
                    if (selfs.options.onClickCell&&!selfs.options.readonly) {
                        var checked = $(e.target).is(":checked");
                        selfs.options.onClickCell(item,index,checked);
                    }
                }
            },
            mounted: function(){
                selfs.options.onLoadSuccess(selfs);
            },
            updated: function(){
                selfs.options.onUpdated(selfs);
            }
        });

        this.checkboxlist =  new Vue({
            el: '#'+id
        });
    },
    getValue:function(){
        var name = this.id;
        var chk_value =[];
        $('input[name="'+name+'"]:checked').each(function(){
            chk_value.push($(this).val());
        });
        return chk_value.join(",");
    },
    setValue:function(values){
        var a = this.getValue();
        var val = values.split(",");
        var name = this.id;
        var boxes = document.getElementsByName(name);
        for(i=0;i<boxes.length;i++){
            boxes[i].checked = false;
            for(j=0;j<val.length;j++){
                if(boxes[i].value == val[j]){
                    boxes[i].checked = true;
                    break;
                }
            }
        }
        if (values!==a) {
            var fun = $("#"+this.id).data("onChange");
            if (fun) {
                fun(a,values);
            }
        }
    },
    getText:function(){
        var name = this.id;
        var chk_text =[];
        $('input[name="'+name+'"]:checked').each(function(){
            var text = $(this).parent().find("label").text();
            chk_text.push(text);
        });
        return chk_text.join(",");
    },
    clear:function(){
        this.setValue("");
    },
    readonly:function(f){
        if (f) {
            var len = this.getData().length;
            var arr = [];
            for (var i = 0; i < len; i++) {
                arr.push(i);
            }
            this.setdisabled(arr);
            this.options.readonly = true;
        } else {
            this.setdisabled([]);
            this.options.readonly = false;
        }
    },
    getData:function(){
        return this.options.data;
    },
    getIndexbyValue:function(ids){
        var a = ids.split(","),b=[];
        if (this.options.idField) {
            var v = this.options.idField;
            $.each(this.options.data,function(i,c){
                if ($.inArray(c[v],a)>=0) {
                    b.push(i);
                }
            });
        }
        return b;
    },
    setdisabled:function(indexs){
        var id = this.id;
        var len = this.options.data.length;
        for (var i = 0; i < len; i++) {
            var cellid = id +"_"+ i;
            document.getElementById(cellid).disabled = false;
        }
        $.each(indexs,function(i,c){
            var cellid = id +"_"+ c;
            document.getElementById(cellid).disabled = true;
        });
    },
    loadData:function(data){
        function dwdata(data,idField,textField) {
            data.forEach(function(v,index,arr){
                if (idField&&v[idField]) {
                    if (v.value) {
                        v.pre_value = v.value;
                    }
                    v.value = v[idField];
                }
                if (textField&&v[textField]) {
                    if (v.text) {
                        v.pre_text = v.text;
                    }
                    v.text = v[textField];
                }
                if (v.children&&v.children.length>0) {
                    data.children = dwdata(v.children,idField,textField);
                }
            });
            return data;
        }
        if (!data) {
            data = [];
        }
        var options = this.options;
        this.options.data = dwdata(data,options.idField,options.textField);
    },
    bindevent:function(){
        var selfs = this;
        var id = this.id;
        var options = this.options;
        for(var o in options) {
            if (typeof(options[o])=='function') {
                switch(o)
                {
                    default:
                        // console.log("default");
                }
            }
        }
    },
    isValid:function(callback){
        var selfs = this;
        if (selfs.options.valid.indexOf("required")>=0){
            var v = selfs.getValue();
            if (callback){
                callback(v!=="");
            }
        } else {
            if (callback){
                callback(true);
            }
        }
    }
};

h5ui.radiolist = function(id,options){
    this.id = id;
    var defaultOptions = {
        valid:"",
        readonly:false,
        labelSplit:false,//lable与内容是否分行显示
        cellSplist:false,//选项是否一行显示一个
        onLoadSuccess:function(){},
        onUpdated:function(){}
    };
    var $id = $("#"+id);
    if (!options) {
        if (typeof($id.attr("data-options"))=='undefined') {
            return;
        }
         var o = "{"+$id.attr("data-options")+"}";
         var opts = eval('(' + o + ')');
         options = opts;
    }
    $id.removeAttr("data-options");
    options.id = id;
    for(var o in defaultOptions) {
        if ('undefined'==typeof(options[o])) {
            options[o] = defaultOptions[o];
        }
    }
    if (options.title) {
        options.label = options.title;
    }
    if (options.labelSplit) {
        $id.addClass("checklist_labelSplit");
    }
    if (options.cellSplit) {
        $id.addClass("checklist_cellSplit");
    }
    this.options = options;
    this.checkboxlist;
    this.init();
    this.bindevent();
    this.finished=false;
};

h5ui.radiolist.prototype = {
    bindevent:function(){
        this.onClickCell = function(func){
            $("input[name='"+id+"']").bind('click',function(){
                func();
            });
        };
        var selfs = this;
        var id = this.id;
        var options = this.options;
        for(var o in options) {
            if (typeof(options[o])=='function') {
                switch(o)
                {
                    case "onClickCell":
                        this.onClickCell(options[o]);
                        break;
                    default:
                        // console.log("default");
                }
            }
        }
    },
    init:function(){
        function dwdata(data,idField,textField) {
            if (!data) {
                data = [];
            }
            data.forEach(function(v,index,arr){
                if (idField&&v[idField]) {
                    if (v.value) {
                        v.pre_value = v.value;
                    }
                    v.value = v[idField];
                }
                if (textField&&v[textField]) {
                    if (v.text) {
                        v.pre_text = v.text;
                    }
                    v.text = v[textField];
                }
                if (v.children&&v.children.length>0) {
                    data.children = dwdata(v.children,idField,textField);
                }
            });
            return data;
        }
        var selfs = this;
        var id = this.id;
        var options = this.options;
        var data = options.data;
        if (options.trancode&&options.params) {
            var trancode = options.trancode;
            var params = options.params;
            h5ui.ajax(trancode,params,function(data){
                if (data.status >=0) {
                    options.data=dwdata(data.data,options.idField,options.textField);
                } else {
                    alert(data.desc);
                }
            },false);
        } else {
            options.data=dwdata(data,options.idField,options.textField);
        }
        Vue.component('radiobuttonlist', {
            template: '<div :class="typeof(option.label)==\'string\'?\'\':\'f-nolabel\'">\
                <label v-if="option.label!==undefined">\
                    <span class="text-star" v-if="option.valid.indexOf(\'required\')>=0">*</span>\
                    {{option.label}}\
                </label>\
                <div class="zbui-checklist-content">\
                    <div class="mui-input-row mui-radio mui-left" v-for="(item,index) in option.data" v-on:click="onClickCell(item,index)">\
                        <label>{{item.text}}</label>\
                        <input :id="[option.id+'+"'_'"+'+index]" :name="option.id" :value="item.value" type="radio" >\
                    </div>\
                </div>\
            </div>',
            data: function() {
                return {
                    option:options
                }
            },
            methods: {
                onClickCell:function(item,index){
                    if (selfs.options.onClickCell&&!selfs.options.readonly) {
                        selfs.options.onClickCell(item,index);
                    }
                }
            },
            mounted: function(){
                selfs.options.onLoadSuccess(selfs);
            },
            updated: function(){
                selfs.options.onUpdated(selfs);
            }
        });

        this.checkboxlist =  new Vue({
            el: '#'+id,
            mounted:function(){
            }
        });
    },
    getValue:function() {
        var name = this.id;
        var chk_value;
        chk_value = $('input[name="'+name+'"]:checked').val();
        if ("undefined"== typeof(chk_value)) {
            chk_value = "";
        }
        return chk_value;
    },
    setValue:function(value) {
        var a = this.getValue();
        var name = this.id;
        var boxes = document.getElementsByName(name);
        for(i=0;i<boxes.length;i++){
            boxes[i].checked = false;
            if(boxes[i].value == value){
                boxes[i].checked = true;
                break;
            }
        }
        if (value!==a) {
            var fun = $("#"+this.id).data("onChange");
            if (fun) {
                fun(a,value);
            }
        }
    },
    getText:function(){
        var name = this.id;
        var chk_text;
        chk_text = $('input[name="'+name+'"]:checked').parent().find("label").text();
        if ("undefined"== typeof(chk_text)) {
            chk_text = "";
        }
        return chk_text;
    },
    clear:function(){
        this.setValue("");
    },
    readonly:function(f){
        if (f) {
            var len = this.getData().length;
            var arr = [];
            for (var i = 0; i < len; i++) {
                arr.push(i);
            }
            this.setdisabled(arr);
            this.options.readonly = true;
        } else {
            this.setdisabled([]);
            this.options.readonly = false;
        }
    },
    getData:function(){
        return this.options.data;
    },
    getIndexbyValue:function(ids){
        var a = ids.split(","),b=[];
        if (this.options.idField) {
            var v = this.options.idField;
            $.each(this.options.data,function(i,c){
                if ($.inArray(c[v],a)>=0) {
                    b.push(i);
                }
            });
        }
        return b;
    },
    setdisabled:function(indexs){
        var id = this.id;
        var len = this.options.data.length;
        for (var i = 0; i < len; i++) {
            var cellid = id +"_"+ i;
            document.getElementById(cellid).disabled = false;
        }
        $.each(indexs,function(i,c){
            var cellid = id +"_"+ c;
            document.getElementById(cellid).disabled = true;
        });
    },
    loadData:function(data){
        function dwdata(data,idField,textField) {
            data.forEach(function(v,index,arr){
                if (idField&&v[idField]) {
                    if (v.value) {
                        v.pre_value = v.value;
                    }
                    v.value = v[idField];
                }
                if (textField&&v[textField]) {
                    if (v.text) {
                        v.pre_text = v.text;
                    }
                    v.text = v[textField];
                }
                if (v.children&&v.children.length>0) {
                    data.children = dwdata(v.children,idField,textField);
                }
            });
            return data;
        }
        if (!data) {
            data = [];
        }
        var options = this.options;
        this.options.data = dwdata(data,options.idField,options.textField);
    },
    isValid:function(callback){
        var selfs = this;
        if (selfs.options.valid.indexOf("required")>=0){
            var v = selfs.getValue();
            if (callback){
                callback(v!=="");
            }
        } else {
            if (callback){
                callback(true);
            }
        }
    }
};

h5ui.datagrid = function(id,options) {
    this.id = id;
    if (typeof(options)=='undefined') {
        options = {};
    }
    this.options = options;
    this.grid;
    this.init();
};

h5ui.datagrid.prototype = {
    init:function(){
        var id = this.id;
        var options = this.options;
        var $t = $("#"+id);
        var ch = $t.parent().height(); 
        var url,params;
        if (options.trancode) {
            url = "proxy/handle?transCode="+options.trancode;
            params = function(params){
                var temp = {   
                  pageSize: params.pageSize,
                  pageIndex: params.pageNumber,  
                  sort: params.sort,  
                  sortOrder: params.order
                };  
                for(var o in options.params) {
                    temp[o] = options.params[o];
                }
                return temp;  
            }
        }

        var goption = {
            url:url,
            method:'post',
            editable:true,
            queryParams:params,
            queryParamsType:'String',
            height:ch,
            dataField:'data',
            showRefresh:false,
            showColumns:false,
            columns: options.columns,
            data: options.data,
            striped: true,  //表格显示条纹  
            pageSize: 10,  //每页显示的记录数  
            pageNumber:1, //当前第几页  
            sidePagination: "server" //表示服务端请求
        };

        for(var o in options) {
            if (o!=="trancode"&&o!=="params") {
                if (o=="columns") {
                    var columns = options[o];
                    var cc = {
                        // mode:'inline'
                    };
                    columns.forEach(function(v,i,a){
                        if (v.editable) {
                            for(var o in cc) {
                                v.editable[o] = cc[o];
                            }
                        }
                    });
                }
                goption[o] = options[o];
            }
        }
        this.grid = $t.bootstrapTable(goption);
    },
    getOptions:function(){
        var id = this.id;
        return $("#"+id).bootstrapTable("getOptions");
    },
    reload:function(params){
        var id = this.id;
        var options = this.getOptions();
        var url = options.url;
        var opt = {
            url:url,
            query:params
        };
        $("#"+id).bootstrapTable("refresh",opt);
    },
    load:function(params){
        var id = this.id;
        var options = this.getOptions();
        var url = options.url;
        var opt = {
            url:url,
            pageNumber:1,
            query:params
        };
        $("#"+id).bootstrapTable("refresh",opt);
    },
    getSelected:function(f){
        var id = this.id;
        if (f) {
            $("#"+id).bootstrapTable("getSelections");
        } else {
            $("#"+id).bootstrapTable("getAllSelections");
        }
    },
    insertRow:function(param){
        var id = this.id;
        $("#"+id).bootstrapTable("insertRow",param);
    },
    updateRow:function(param){
        var id = this.id;
        $("#"+id).bootstrapTable("updateRow",param);
    },
    getData:function(f){
        var id = this.id;
        return $("#"+id).bootstrapTable("getData",f);
    },
    loadData:function(data){
        var id = this.id;
        $("#"+id).bootstrapTable("load",data);
    },
    destroy:function(){
        var id = this.id;
        $("#"+id).bootstrapTable("destroy");
    },
    showRow:function(params){
        var id = this.id;
        $("#"+id).bootstrapTable("showRow",params);
    },
    hideRow:function(params){
        var id = this.id;
        $("#"+id).bootstrapTable("hideRow",params);
    },
    appendRow:function(data){
        var id = this.id;
        $("#"+id).bootstrapTable("append",data);
    }
};

h5ui.push = {
    createLocalPushMsg: function(msg,options){
        if (typeof(msg)=='undefined') {
            return;
        }
        plus.push.createMessage(msg, "LocalMSG", options);
    }
};


h5ui.picSlider = function(id,options){
    this.id = id;
    var $id = $("#"+id);
    var defaultOptions = {
        autoScroll:true,
        showBar:true,
        showsearch:false
    };
    if (typeof(options)=='undefined') {
        if (typeof($id.attr("data-options"))=='undefined') {
            return;
        }
        var o = "{"+$id.attr("data-options")+"}";
        options = eval('(' + o + ')');
    }
    $id.removeAttr("data-options");
    for(var o in defaultOptions) {
        if ('undefined'==typeof(options[o])) {
            options[o] = defaultOptions[o];
        }
    }
    this.options = options;
    $id.addClass("mui-slider");
    $id.addClass("zbui-picSlider");
    $id.append("<div class=\"mui-slider-group mui-slider-loop\">\
                    <div  v-for=\"(img,index) in imgsA\" :class=\"img.type=='clone'?'mui-slider-item mui-slider-item-duplicate':'mui-slider-item'\">\
                        <a href=\"#\">\
                            <img v-bind:src=\"img.url\">\
                        </a>\
                    </div>\
                <div>");
    if (options.showBar) {
    $id.append("<div class=\"mui-slider-indicator\">\
                    <div v-for=\"(img,index) in imgs\" :class=\"index==0?'mui-indicator mui-active':'mui-indicator'\"></div>\
                </div>");
    }
    if (options.showsearch) {
         $id.append('<div class="mui-input-row mui-search">\
                        <input id="search" type="search" class="mui-input-clear" placeholder="'+options.searchprompt+'">\
                    </div>');
    }
    

    var s = options.imgList[0];
    var e = options.imgList[options.imgList.length-1];
    var nimgList = [];
    nimgList.push({
        type:"clone",
        url:e.url
    });
    options.imgList.forEach(function(v,k,a){
        nimgList.push(v);
    });
    nimgList.push({
        type:"clone",
        url:s.url
    });

    this.slider = new Vue({
        el:"#"+id,
        data:{
            imgsA:nimgList,
            imgs:options.imgList
        }
    });

    var slider = mui("#"+id);
    if(options.autoScroll) {
        slider.slider({
            interval: 5000
        });
    }
};

h5ui.picSlider.prototype = {
    getsize: function(){
        var id = this.id;
        var $id = $("#"+id);
        return {
            width:$id.width(),
            height:$id.height()
        };
    }
};

h5ui.menuList = function(id,options){
    this.id = id;
    var $id = $("#"+id);
    var defaultOptions = {
        formatter:function(value){
            return value;
        },
        pageSize:5,
        pageIndex:1,
        height:"auto",
        pullUPrefresh:false,
        pullDownrefresh:false,
        data:[],
        autoLoad:true,
        fit:false,
        loadFilter:function(data){return data},
        buttons:function(){return undefined;},
        onLoadSuccess:function(){},
        onBeforeUpdate:function(){},
        onUpdated:function(){},
        onClick:function(){},
        onCheck:function(){},
        onCancelCheck:function(){}
    };
    $id.addClass("mui-table-view");
    $id.addClass("zbui-menuList");
    if (typeof(options)=='undefined') {
        if (typeof($id.attr("data-options"))=='undefined') {
            return;
        }
        var o = "{"+$id.attr("data-options")+"}";
        options = eval('(' + o + ')');
    }
    $id.removeAttr("data-options");
    for(var o in defaultOptions) {
        if ('undefined'==typeof(options[o])) {
            options[o] = defaultOptions[o];
        }
    }
    
    this.options = options;
    if(!options.page&&options.autoLoad)
        this.load();

    var view = [];
    var d1 = this.options.loadFilter(options.data);
    d1.forEach(function(v,k,a){
        view.push({
            text:options.formatter(v,k,a),
            buttons:options.buttons(v,k,a)
        });
    });
    options.view = view;
    this.options = options;
    var selfs = this;
    if (options.fit) {
        $id.addClass("mui-fullscreen");
    }

    this.pullCtrl;
    this.scroll;
    this.init();
};

h5ui.menuList.prototype = {
    init: function(){
        var selfs = this;
        var id = this.id;
        var $id = $("#"+id);
        var options = this.options;
        if (options.fit==false&&"auto"==options.height) {
            $id.append('<div><li class="mui-table-view-cell mui-left" v-if="menu.view.length==0" ><div class="zbui-menuList-nodata">'+h5ui.menuList.defaults.nomsg+'</div></li>\
                    <li v-else :class="menu.singleSelect==undefined?\'mui-table-view-cell mui-left\':(menu.singleSelect==true?\'mui-table-view-cell mui-left mui-radio\':\'mui-table-view-cell mui-left mui-checkbox\')" \
                         v-for="(menuh,index) in menu.view" :name="index">\
                        <input v-if="menu.singleSelect==true" :name="['+"'input-'"+'+id]" :value="index" type="radio">\
                        <input v-else-if="menu.singleSelect==false" :name="['+"'input-'"+'+id]" :value="index" type="checkbox">\
                        <div v-else style="display:none"></div>\
                        <div :class="typeof(menuh.buttons)==\'undefined\'?\'mui-disabled\':\'mui-slider-right mui-disabled\'" >\
                            <a :class="['+"'mui-btn '"+'+btn.class]" \
                            v-for=\"(btn,index) in menuh.buttons\" :name="[index]" ><vue-gesture :type="\'tap\'"  :call="handleComponent.bind(this,\'tab\')" >{{btn.text}}</vue-gesture></a>\
                        </div>\
                        <div class="mui-slider-handle" v-html="menuh.text">\
                        </div>\
                        </li></div>');

        } else {
            if (!options.fit) {
                $id.css("height",options.height+"px");
            }
            $id.append('<div class="mui-scroll-wrapper"><div class="mui-scroll">\
                    <div><li class="mui-table-view-cell mui-left" v-if="menu.view.length==0" ><div class="zbui-menuList-nodata">'+h5ui.menuList.defaults.nomsg+'</div></li>\
                    <li v-else :class="menu.singleSelect==undefined?\'mui-table-view-cell mui-left\':(menu.singleSelect==true?\'mui-table-view-cell mui-left mui-radio\':\'mui-table-view-cell mui-left mui-checkbox\')" \
                         v-for="(menuh,index) in menu.view" :name="index">\
                        <input v-if="menu.singleSelect==true" :name="['+"'input-'"+'+id]" :value="index" type="radio">\
                        <input v-else-if="menu.singleSelect==false" :name="['+"'input-'"+'+id]" :value="index" type="checkbox">\
                        <div v-else style="display:none"></div>\
                        <div :class="typeof(menuh.buttons)==\'undefined\'?\'mui-disabled\':\'mui-slider-right mui-disabled\'" >\
                            <a :class="['+"'mui-btn '"+'+btn.class]" \
                            v-for=\"(btn,index) in menuh.buttons\" :name="[index]" ><vue-gesture :type="\'tap\'"  :call="handleComponent.bind(this,\'tab\')" >{{btn.text}}</vue-gesture></a>\
                        </div>\
                        <div class="mui-slider-handle" v-html="menuh.text">\
                        </div>\
                        </li></div></div></div>');
        }

        this.menu = new Vue({
            el:"#"+id,
            data:{
                menu:options,
                id:id
            },
            methods: {
                handleComponent: function(str,e){
                    var selected = selfs.getSelected();
                    var buttons = selfs.options.view[selected.index[0]].buttons;
                    var j = $(e.target).parents(".mui-btn").attr("name");
                    buttons[j].tap(selfs.options.data[selected.index[0]]);
                    mui.swipeoutClose(selected.target[0]);
                }
            },
            beforeCreate: function(){},
            created: function () {},
            beforeMount: function(){},
            mounted: function(){
                var $id = $("#"+selfs.id);
                var wrapper = $id.find(".mui-scroll-wrapper")[0];
                var scroll = mui(wrapper).scroll();
                var p = $id.find(".mui-scroll")[0];
                if (true==options.page){
                    if (options.pullDownrefresh||options.pullUPrefresh) {
                        mui.ready(function() {
                            selfs.addpulltorefresh(mui(p));
                            selfs.options.onLoadSuccess(selfs);
                        });
                    } else {
                        selfs.options.onLoadSuccess(selfs);
                    }
                } else {
                    selfs.options.onLoadSuccess(selfs);
                }
                mui("#"+selfs.id).on('tap','.mui-table-view-cell',function(){
                    var index = this.getAttribute("name");
                    if (index==null) {
                        return;
                    }
                    selfs.options.onClick(selfs.options.data[index]);
                    var checked = $(this).find("input[name='input-"+selfs.id+"']").is(":checked");
                    if (checked) {
                        selfs.options.onCancelCheck(selfs.options.data[index]);
                    } else {
                        selfs.options.onCheck(selfs.options.data[index]);
                    }
                });

                selfs.scroll = mui("#"+selfs.id+" .mui-scroll-wrapper").scroll();
            },
            beforeUpdate: function(){
                selfs.options.onBeforeUpdate(selfs);
            },
            updated: function(){
                if (selfs.scroll.refresh){
                    selfs.scroll.refresh();
                }
                selfs.options.onUpdated(selfs);
            },
            beforeDestroy: function(){},
            destroyed: function(){}
        });
    },
    setOptions: function(options){
        var noption = {};
        var option = this.options;
        for (var o in option) {
            noption[o]=option[o];
        }
        for (var o in options) {
            noption[o]=options[o];
        }
        this.options = noption;
        this.menu.$set(this.menu.$data,"menu",noption);
    },
    load:function(params){
        var options = this.options;
        var that = this;
        if (params) {
            options.param = params;
        }
        if ('undefined'!==typeof(options.transcode)) {
            options.pageIndex = 1;
            if (options.page==true) {
                options.param.pageIndex = options.pageIndex;
                options.param.pageSize = options.pageSize;
            } else {
                delete options.param.pageIndex;
                delete options.param.pageSize;
            }
            h5ui.ajax(options.transcode,options.param,function(e){
                if (e.status>=0) {
                    if (that.pullCtrl) {
                        var $tips = $("#"+that.id).find(".mui-pull-bottom-tips");
                        if (e.data.length<that.options.pageSize) {
                            if (that.pullCtrl.endPullUpToRefresh) {
                                that.pullCtrl.endPullUpToRefresh(true);
                                $tips.css("display","none");
                            }
                        } else {
                            if (that.pullCtrl.endPullUpToRefresh){
                                that.pullCtrl.endPullUpToRefresh();
                                $tips.css("display","block");
                            }
                        }
                    }
                    that.loadData(e.data);
                }
            },false);
        }
    },
    loadData: function(data){
        var options = this.options;
        var view = [];
        options.data = data;
        var d1 = this.options.loadFilter(data);
        d1.forEach(function(v,k,a){
            view.push({
                text:options.formatter(v),
                buttons:options.buttons(v)
            });
        });
        options.view = view;
    },
    getData: function(){
        return this.options.data;
    },
    insertRow: function(index,row){
        var data = this.getData();
        data.splice(index,0,row);
        this.loadData(data);
    },
    appendRow: function(row){
        this.insertRow(0,row);
    },
    updateRow:function(index,row){
        var data = this.getData();
        data.splice(index,1,row);
        this.loadData(data);
    },
    deleteRow: function(index){
        var data = this.getData();
        data.splice(index,1);
        this.loadData(data);
    },
    addpulltorefresh: function($dom) {
        var selfs = this;
        var options = selfs.options;
        var opt = {};
        if (true==options.pullDownrefresh) {
            opt.down = {
                callback: function() {
                    var self = this;
                    setTimeout(function() {
                        selfs.options.pageIndex = 1;
                        if (options.page==true) {
                            options.param.pageIndex = options.pageIndex;
                            options.param.pageSize = options.pageSize;
                        }
                        h5ui.ajax(options.transcode,options.param,function(e){
                            if (e.status>=0) {
                                var $tips = $("#"+selfs.id).find(".mui-pull-bottom-tips");
                                if (e.data.length<selfs.options.pageSize) {
                                    self.endPullUpToRefresh(true);
                                    $tips.css("display","none");
                                } else {
                                    self.endPullUpToRefresh();
                                    $tips.css("display","block");
                                }
                                self.endPullDownToRefresh();
                                selfs.loadData(e.data);
                            }
                        },false);
                        if ('undefined'!==typeof(selfs.options.onPullDownrefresh)) {
                            selfs.options.onPullDownrefresh();
                        }
                    }, 1000);
                }
            }
        }
        if (true==options.pullUprefresh) {
            opt.up = {
                callback: function() {
                    var self = this;
                    setTimeout(function() {
                        selfs.options.pageIndex += 1;
                        if (options.page==true) {
                            options.param.pageIndex = options.pageIndex;
                            options.param.pageSize = options.pageSize;
                        }
                        h5ui.ajax(options.transcode,options.param,function(e){
                            if (e.status>=0) {
                                var $tips = $("#"+selfs.id).find(".mui-pull-bottom-tips");
                                if (e.data.length<selfs.options.pageSize) {
                                    self.endPullUpToRefresh(true);
                                    $tips.css("display","none");
                                } else {
                                    self.endPullUpToRefresh();
                                    $tips.css("display","block");
                                }
                                e.data.forEach(function(v,k,a){
                                    selfs.insertRow(selfs.getData().length,v);
                                });
                            }
                        },false);

                        if ('undefined'!==typeof(selfs.options.onPullUprefresh)) {
                            selfs.options.onPullUprefresh();
                        }
                    }, 1000);
                }
            }
        }
        this.pullCtrl = $dom.pullToRefresh(opt);
        if(options.autoLoad) {
            this.load();
        } else {
            this.pullCtrl.endPullUpToRefresh(true);
            var $tips = $("#"+selfs.id).find(".mui-pull-bottom-tips");
            $tips.css("display","none");
        } 
    },
    getChecked: function(){
        var id = this.id;
        var name = "input-" + id;
        var selected =[];
        var selectedIndex = [];
        var data = this.getData();
        $('input[name="'+name+'"]:checked').each(function(){
            var index = parseInt($(this).val());
            selectedIndex.push(index);
            selected.push(data[index]);
        });
        return {
            index:selectedIndex,
            items:selected
        };
    },
    getSelected: function(){
        var id = this.id;
        var $li = $("#"+id).find(".mui-table-view-cell");
        var n = 0;
        var selected =[];
        var selectedIndex = [];
        var target = [];
        var data = this.getData();
        $li.each(function(){
            if ($(this).hasClass("mui-selected")){
                selectedIndex.push(n);
                selected.push(data[n]);
                target.push(this);
            }
            n++;
        });
        return {
            index:selectedIndex,
            items:selected,
            target:target
        };
    },
    checkAll: function(){
        var id = this.id;
        var name = "input-" + id;
        var boxes = document.getElementsByName(name);
        for(i=0;i<boxes.length;i++){
            boxes[i].checked = true;
        }
    },
    uncheckAll: function(){
        var id = this.id;
        var name = "input-" + id;
        var boxes = document.getElementsByName(name);
        for(i=0;i<boxes.length;i++){
            boxes[i].checked = false;
        }
    },
    checkRow: function(indexArray){
        var id = this.id;
        var name = "input-" + id;
        var boxes = document.getElementsByName(name);
        for(i=0;i<boxes.length;i++){
            if ($.inArray(i,indexArray)>=0) {
                boxes[i].checked = true;
            }
        }
    },
    uncheckRow: function(indexArray){
        var id = this.id;
        var name = "input-" + id;
        var boxes = document.getElementsByName(name);
        for(i=0;i<boxes.length;i++){
            if ($.inArray(i,indexArray)>=0) {
                boxes[i].checked = false;
            }
        }
    },
    resize: function(param) {
        var id = this.id;
        var $id = $("#"+id);
        if (typeof(param.height)!=='undefined') {
            $id.css("height",param.height+"px");
        }
    },
    getsize: function(){
        var id = this.id;
        var $id = $("#"+id);
        return {
            width:$id.width(),
            height:$id.height()
        };
    },
    hide:function(){
        var id = this.id;
        $("#"+id).css("display","none");
    },
    show:function(){
        var id = this.id;
        $("#"+id).css("display","block");
    }
};

h5ui.searchbox = function(id,options){
    var that = this;
    this.id = id;
    var $id = $("#"+id);
    $id.addClass("mui-table-view");
    if (typeof(options)=='undefined') {
        if (typeof($id.attr("data-options"))=='undefined') {
            return;
        }
        var o = "{"+$id.attr("data-options")+"}";
        options = eval('(' + o + ')');
    }
    $id.removeAttr("data-options");
    $id.attr("name",id);
    this.options = options;

    $id.wrap('<div id="'+id+'-container" class="mui-input-row mui-search"></div>');
    $id.attr("type","search");
    $id.addClass("mui-input-clear");
    if (typeof(options.prompt)!=='undefined') {
        $id.attr("placeholder",options.prompt);
    }
    this.container = new Vue({
        el: '#'+id+'-container',
        mounted: function(){
            var $id = $("#"+that.id);
            $id[0].addEventListener("keydown",function(e){
                if (options.keydown) {
                    options.keydown($(e.target).val());
                }
                if(13 == e.keyCode){
                    if (options.onEnter) {
                        options.onEnter($(e.target).val());
                    }
                   document.activeElement.blur();
                } 
            });
            $id[0].addEventListener("keyup",function(e){
                if (options.keyup) {
                    options.keyup($(e.target).val());
                }
            });
        }
    });
};

h5ui.searchbox.prototype = {
    focus:function(){
        var initNativeObjects = function() {  
            if (mui.os.android) {  
                var main = plus.android.runtimeMainActivity();  
                var Context = plus.android.importClass("android.content.Context");  
                InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");  
                imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);  
            } else {  
                nativeWebview = plus.webview.currentWebview().nativeInstanceObject();  
            }  
        };
        var showSoftInput = function($id,$c) {  
            var nativeWebview = plus.webview.currentWebview().nativeInstanceObject();  
            if (mui.os.android) {  
                //强制当前webview获得焦点  
                plus.android.importClass(nativeWebview);  
                nativeWebview.requestFocus();  
                imm.toggleSoftInput(0, InputMethodManager.SHOW_FORCED);  
            } else {  
                nativeWebview.plusCallMethod({  
                    "setKeyboardDisplayRequiresUserAction": false  
                });  
            }  
            setTimeout(function() {  
                $c.addClass("mui-active");
                $id.trigger("click").focus(); 
            }, 200);  
        }; 

        var id = this.id;
        var $c = $('#'+id+'-container');
        var $id = $("#"+id);
        if (isApp()) {
            waitforplus(function(){
                initNativeObjects();  
                showSoftInput($id,$c);  
            });
        } else {
            $c.addClass("mui-active");
            $id.trigger("click").focus();
        }
    },
    getValue: function(){
        return document.getElementById(this.id).value;
    },
    getText: function(){
        return document.getElementById(this.id).value;
    },
    hide:function(){
        var id = this.id;
        $("#"+id).parents(".zbui-input-row").css("display","none");
    },
    show:function(){
        var id = this.id;
        $("#"+id).parents(".zbui-input-row").css("display","block");
    },
    clear:function(){
        document.getElementById(this.id).value="";
    },
    readonly:function(f){
        if (f) {
            this.options.readonly = true;
        } else {
            this.options.readonly = false;
        }
    }
};

h5ui.card = function(id,options){
    this.id = id;
    var $id = $("#"+id);
    if (typeof(options)=='undefined') {
        if (typeof($id.attr("data-options"))=='undefined') {
            return;
        }
        var o = "{"+$id.attr("data-options")+"}";
        options = eval('(' + o + ')');
    }
    $id.removeAttr("data-options");
    this.options = options;

    $id.addClass("mui-card-content-inner").removeAttr("id").removeClass("zbui-card zbui-card-pad");
    $id.wrap("<div class='mui-card-content'></div>");
    $id.parent().wrap("<div class='zbui-card mui-card'></div>");
    $id.parent().before('<div class="mui-card-header">'+options.head+'</div>');
    $id.parent().parent().attr("id",id).addClass("zbui-card-pad");
};

h5ui.card.prototype = {
    getsize: function(){
        var id = this.id;
        var $id = $("#"+id);
        return {
            width:$id.width(),
            height:$id.height()
        };
    },
    hide:function(){
        var id = this.id;
        $("#"+id).css("display","none");
    },
    show:function(){
        var id = this.id;
        $("#"+id).css("display","block");
    }
};

h5ui.layout = {
    fit:function(a,n,p){
        var inheight;
        setTimeout(function(){
            if ('undefined'==typeof(p)) {
                inheight = $(window).height();
            } else {
                inheight = p.getinsize().height;
            }
            a.forEach(function(v,k,a){
                inheight -= v.getsize().height;
            });
            n.resize({height:inheight});
        },0);
    }
};

h5ui.progressbar = function(id,options){
    var that = this;
    this.id = id;
    var defaultOptions = {
        width:"100%",
        label:"",
        labelWidth:"35%",
        value:"0",
        readonly:false,
        min:0,
        max:100,
        showpercent:false,
        onClick:function(){}
    };

    var $id = $("#"+id);
    this.$id = $id;
    if (!options) {
        if (typeof($id.attr("data-options"))=='undefined') {
            return;
        }
        var o = "{"+$id.attr("data-options")+"}";
        var opts = eval('(' + o + ')');
        options = opts;
    }

    for(var o in defaultOptions) {
        if ('undefined'==typeof(options[o])) {
            options[o] = defaultOptions[o];
        }
    }

    $id.removeAttr("data-options");
    this.options = options;
    this.init();
};

h5ui.progressbar.prototype = {
    init: function(){
        var that = this;
        var options = this.options;
        var id = this.id;
        var $id = $("#"+id);
        this.$id = $id;
        var nvalue = this.toS1(options.value);
        $id.attr("type","range");
        $id.val(nvalue);
        $id.wrap('<div id="'+id+'-container" class="zbui-box" style="width:'+options.width+'"></div>');
        $id.wrap('<div class="mui-text-center zbui-progressbar-content" style="width: 65%;">');
        $id.wrap('<div class="mui-input-row mui-input-range">');
        if (options.readonly) {
            $id.css("display","none");
        }
        $idc = $("#"+id+"-container");
        this.$idc = $idc;
        $idc.find(".mui-input-range").append('<p class="mui-progressbar mui-progressbar-in" data-progress="20"><span></span></p>');
        $idc.prepend('<label style="width: 35%;">'+options.label+'</label>');
        $idc.find(".mui-input-range").append('<input type="text" class="progressbar-num" readonly="true" value="'+options.value+'">');

        if (options.showpercent) {
            $idc.find(".progressbar-num").val(this.toS1(options.value)+"%");
        } else {
            $idc.find(".progressbar-num").val(options.value);
        }

        var pb = $idc.find(".zbui-progressbar-content .mui-input-range");
        mui(pb).progressbar().setProgress(nvalue);
        this.processbar = mui(pb);
        setColor(nvalue);
        function setColor(value){
            var v = value,c;
            if (v>=0&&v<25) {
                c = "#ff0401";
            } else if (v>=25&&v<50) {
                c = "#ff8201";
            } else if (v>=50&&v<75) {
                c = "#ffdd00";
            } else if (v>=75&&v<=100) {
                c = "#3eeda0";
            }
            $idc.find(".mui-input-range p.mui-progressbar span").css("background",c);
        }
        $idc.find('input[type="range"]').each(function(){
            this.addEventListener('input', function() {
                that.options.value = that.toS2(this.value);
                if (options.showpercent) {
                    $idc.find(".progressbar-num").val(this.value+"%");
                } else {
                    $idc.find(".progressbar-num").val(that.toS2(this.value));
                }
                mui(pb).progressbar().setProgress(this.value);
                setColor(this.value);
            });
        });

        this.processbar[0].addEventListener("tap",function () {
            options.onClick();
        });
    },
    readonly: function(f){
        var that = this;
        if (f) {
            that.$id.css("display","none");
        } else {
            that.$id.css("display","block");
        }
    },
    getValue: function(){
        return this.options.value;
    },
    setValue: function(value){
        this.options.value = value;
        this.$id.val(value);
        this.processbar.progressbar().setProgress(this.toS1(value));
        if (this.options.showpercent) {
            this.$idc.find(".progressbar-num").val(this.toS1(value)+"%");
        } else {
            this.$idc.find(".progressbar-num").val(value);
        }
        var v = this.toS1(value),c;
        if (v>=0&&v<25) {
            c = "#ff0401";
        } else if (v>=25&&v<50) {
            c = "#ff8201";
        } else if (v>=50&&v<75) {
            c = "#ffdd00";
        } else if (v>=75&&v<=100) {
            c = "#3eeda0";
        }
        this.$idc.find(".mui-input-range p.mui-progressbar span").css("background",c);
    },
    toS1: function(value){//将自定义转化为百分制
        var options = this.options;
        value = parseFloat(value);
        var min = options.min;
        var max = options.max;
        return Math.round((value-min)/(max-min)*100);
    },
    toS2: function(value){//将百分制转化为自定义
        var options = this.options;
        value = parseFloat(value);
        var min = options.min;
        var max = options.max;
        return Math.round((value/100)*(max-min)+min);
    },
    setOptions: function(options){
        var nopts = this.options;
        for(var o in nopts) {
            if (options[o]) {
                nopts[o] = options[o];
            }
        }
        this.options = nopts;
        this.destroy();
        this.init();
    },
    destroy: function(){
        var origin = this.$id[0].outerHTML;
        var $c = this.$idc.parent();
        $c.empty();
        $c.append(origin);
    }
};

h5ui.echarts = function(id,options){
    this.id = id;
    var $id = $("#"+id);
    var defaultOptions = {
        type:"line"
    };
    if (!options) {
        if (typeof($id.attr("data-options"))=='undefined') {
            return;
        }
        var o = "{"+$id.attr("data-options")+"}";
        var opts = eval('(' + o + ')');
        options = opts;
    }
    for(var o in defaultOptions) {
        if ('undefined'==typeof(options[o])) {
            options[o] = defaultOptions[o];
        }
    }
    this.options = options;
    this.echart = echarts.init(document.getElementById(id),'vintage');
    this.loadData([]);
};

h5ui.echarts.prototype = {
    getOption: function(chartType,data){
        var that = this;
        var rs = that.getdatabytype(chartType,data);
        var chartOption = chartType == 'pie' ? 
        {
            calculable: false,
            backgroundColor:"white",
            series: [{
                name: '访问来源',
                type: 'pie',
                radius: '65%',
                center: ['50%', '50%'],
                label:{formatter:"{b}:{d}%"},
                data:rs
            }]
        } : {
            legend: {
                data: rs.legend
            },
            backgroundColor:"white",
            grid: {
                x: 35,
                x2: 10,
                y: 30,
                y2: 25
            },
            color:["#b7e7ba","#298efa"],
            backgroundColor:"white",
            toolbox: {
                show: false,
                feature: {
                    mark: {
                        show: true
                    },
                    dataView: {
                        show: true,
                        readOnly: false
                    },
                    magicType: {
                        show: true,
                        type: ['line', 'bar']
                    },
                    restore: {
                        show: true
                    },
                    saveAsImage: {
                        show: true
                    }
                }
            },
            calculable: false,
            xAxis: [{
                type: 'category',
                data: rs.xvalue,
                axisLabel: {
                   interval:0,
                   rotate:90
                },
                axisTick:{
                    show:false
                }
            }],
            yAxis: [{
                show:false,
                type: 'value',
                splitArea: {
                    show: true
                }
            }],
            
            series:rs.series
        };

        if ("gauge"==chartType) {
            chartOption = {
                backgroundColor:"white",
                series:[{
                    name: '',
                    type: 'gauge',
                    detail: {formatter:'{value}%'},
                    data: rs
                }]
            };
        }
        if ("treemap"==chartType) {
            chartOption = {
                backgroundColor:"white",
                label:{
                    normal:{
                        position: 'insideTopLeft',
                        formatter: function (params) {
                            var arr = [
                                '{name|' + params.name + '}',
                                '{hr|}',
                                '{budget|$ ' + echarts.format.addCommas(params.value[0]) + '} {label|budget}'
                            ];

                            mode !== 1 && arr.push(
                                '{household|$ ' + echarts.format.addCommas((+params.value[3].toFixed(4)) * 1000) + '} {label|per household}'
                            );

                            return arr.join('\n');
                        },
                    }
                },
                series:[{
                    name:"treemap",
                    type:"treemap",
                    breadcrumb:{show:false},
                    data: rs
                }]
            };

        }
        return that.mergoptions(this.options,chartOption);
    },
    mergoptions:function(options,chartOption){
        for (var o in options) {
            chartOption[o] = options[o];
        }
        return chartOption;
    },
    loadData: function(data){
        this.echart.clear();
        var options = this.options;
        var Option = this.getOption(options.type,data);
        this.echart.setOption(Option);
    },
    getdatabytype: function(chartType,data) {
        var ml;
        if (!(data instanceof Array)) {
            ml = data.markLine;
            data = data.data;
        } 
        if ("line"==chartType||"bar"==chartType) {
            var xvalue=[],legend=[],series=[];
            data.forEach(function(v,k,a){
                if ($.inArray(v.xvalue,xvalue)<0) {
                    xvalue.push(v.xvalue);
                }
                if ($.inArray(v.legend,legend)<0) {
                    legend.push(v.legend);
                    series.push({
                        name:v.legend,
                        type:chartType,
                        data:[],
                        lineStyle:{width:3},
                        symbolSize:10,
                        markLine: {
                            silent: true,
                            data: []
                        },
                        itemStyle : { normal: {label : {show: true}}}
                    });
                }
            });
            data.forEach(function(v,k,a){
                series.forEach(function(v1,k1,a1){
                    xvalue.forEach(function(v2,k2,a2){
                        if (v.xvalue == v2&&v.legend == v1.name) {
                            v1.data[k2] = v.yvalue;
                        }
                    });
                });
            });

            series.forEach(function(v1,k1,a1){
                if (ml) {
                    ml.forEach(function(v2,k2,a2){
                        if (v2.legend==v1.name) {
                            v1.markLine.data.push({
                                yAxis:v2.yvalue
                            });
                        }
                    });
                }
            });
            return {
                xvalue:xvalue,
                legend:legend,
                series:series
            };
        } else {
            return data;
        }
    }
};

h5ui.update = function(){
    var res = $.ajax({url:"getAppUploadUrl",method:"post",async:false,error:function(){}});
    var server;
    if (res.responseText) {
         server = res.responseText;
    } else {
        return;
    }
    plus.runtime.getProperty(plus.runtime.appid, function(inf) {
        var ver = inf.version;
        var xhr = new plus.net.XMLHttpRequest();
        xhr.onreadystatechange = function () {
            switch ( xhr.readyState ) {
                case 4:
                    if ( xhr.status == 200 ) {
                        var data = JSON.parse(xhr.responseText);
                        var ver_new = (data.Android.version).replace(/\./g,'');
                        var ver_used = ver.replace(/\./g,'');
                        if (ver_new > ver_used) {
                            h5ui.window.confirm(data.Android.title,data.Android.note,["立即更新","取消"],function(rs){
                                if (rs.index==0) {
                                    plus.nativeUI.toast("正在准备环境，请稍后！");
                                    var dtask = plus.downloader.createDownload(data.Android.url, {}, function(d, status) {
                                        if (status == 200) {                                        
                                            var path = d.filename;
                                            plus.runtime.install(path);
                                        }else {
                                            alert('版本更新失败:' + status);
                                        }
                                    });
                                    dtask.start(); 
                                }
                            });
                        }
                    } else {
                        console.log( "xhr请求失败："+xhr.readyState );
                    }
                    break;
                default :
                    break;
            }
        }
        xhr.open( "GET", server );
        xhr.send();
    });
};

h5ui.pics = function(id,options){
    var $id = $("#"+ id);
    var defaultOptions = {
        data:[],
        canAdd:false,
        canRemove:false,
        trancode:null,
        queryParams:{},
        uploadUri:null,
        loadFilter:function(data){return data;},
        onClickIcon:function(index,cell){},
        onBeforeUpload:function(uri){return uri},
        onBeforeLoad:function(param){return param},
        onLoadSuccess:function(data){}
    };
    if (!options) {
        if (typeof($id.attr("data-options"))=='undefined') {
            return;
        }
        var o = "{"+$id.attr("data-options")+"}";
        var opts = eval('(' + o + ')');
        options = opts;
    }
    $id.removeAttr("data-options"); 
    $.extend(true,defaultOptions,options);
    this.options = defaultOptions;
    options = defaultOptions;
    $id.addClass("mui-table-view mui-grid-view");
    $id.append('<li class="mui-table-view-cell mui-media mui-col-xs-4" v-for="(item,index) in items.data">\
            <a href="#">\
                <span class="mui-icon mui-icon-closeempty" v-if="items.canRemove==true" :name="['+"'pic'"+'+index]"></span>\
                <img class="mui-media-object" :src=item.path data-preview-src="" data-preview-group="1">\
            </a>\
        </li>');
    $id.append('<li class="mui-table-view-cell mui-media mui-col-xs-4" v-if="items.canAdd==true">\
        <a href="#">\
            <span class="mui-icon mui-icon-plus"></span>\
        </a>\
    </li>');
    var selfs = this;
    new Vue({
        el: '#'+id,
        data: {
            items:options,
        },
        mounted: function(){
            mui("#"+id).on('tap', '.mui-icon-plus', function() {
                h5ui.window.popoverMenu([{
                    text: "拍照",
                    func: function () {
                        h5ui.camera.getImage(function (path) {
                            h5ui.window.showLoading();
                            selfs.compress(path,function(npath){
                                h5ui.uploader(selfs.options.onBeforeUpload(selfs.options.uploadUri),[{path:npath,key:npath}],
                                function(){
                                    h5ui.window.hideLoading();
                                    selfs.load();
                                });
                            });
                        });
                    }
                }, {
                    text: "从手机相册选择",
                    func: function () {
                        h5ui.gallery.galleryImg(function (path) {
                            h5ui.window.showLoading();
                            selfs.compress(path,function(npath){
                                h5ui.uploader(selfs.options.onBeforeUpload(selfs.options.uploadUri),[{path:npath,key:npath}],
                                function(){
                                    h5ui.window.hideLoading();
                                    selfs.load();
                                });
                            });
                        });
                    }
                }]);
            });

            mui("#"+id).on('tap', '.mui-icon-closeempty', function() {
                var index = parseInt($(this).attr("name").substring(3));
                selfs.options.onClickIcon(index,selfs.options.data[index]);
            });
            mui.previewImage();
        }
    });
    this.load();
};

h5ui.pics.prototype = {
    load: function(){
        var selfs = this;
        var options = this.options;
        if (!options.trancode) {
            return;
        }
        h5ui.window.showLoading();
        var param={};
        param = options.onBeforeLoad(options.queryParams);
        h5ui.ajax(options.trancode,param,function(rs){
            h5ui.window.hideLoading();
            if (rs.status<0) {
                alert("请求出错！请稍后再试！");
                return; 
            }
            selfs.loadData(rs.data);
            options.onLoadSuccess(rs.data);
        });
    },
    loadData:function(data){
        var selfs = this;
        this.options.data = selfs.options.loadFilter(data);
    },
    appendData:function(data){
        var d = this.options.data;
        d=d.concat(selfs.options.loadFilter(data));
        this.options.data = d;
    },
    removeByIndex:function(index){
        var d = this.options.data;
        d.splice(index,1);
        this.options.data = d;
    },
    setEdit: function(f){
        this.options.canRemove = f;
        this.options.canAdd = f;
    },
    canRemove:function(f){
        this.options.canRemove = f;
    },
    canAdd:function(f){
        this.options.canAdd = f;
    },
    getData:function(){
        return this.options.data;
    },
    compress: function(path,callback){
        h5ui.window.msg("正在压缩图片!"+path);
        var selfs = this;
        plus.zip.compressImage({
            src:path,
            dst:"_www"+path,
            overwrite:true,
            quality:30,
            format:'png'
        },
        function(e) {
            if (callback) {
                callback("_www"+path);
            }
        },function(error) {
            h5ui.window.msg("图片压缩失败!"+JSON.stringify(error));
        });
    }
};

h5ui.uploader = function(url,task,callback){
    var task1 = plus.uploader.createUpload(HomePath + url,
        {method: "POST"},
        function (t, status) { //上传完成
            if (status == 200) {
                if (callback) {
                    callback(arguments["0"],arguments["1"]);
                }
            } else {
                alert("上传失败：" + status);
            }
        }
    );
    task.forEach(function(v,k,a){
        task1.addFile(v.path, {key: v.key});
    });
    task1.start();
};

(function(){
    document.addEventListener( "plusready", onPlusReady, false );
    function onPlusReady() {
        mui.back = function(){
            if (typeof(thenav)!=='undefined') {
                if (thenav.childframe&&thenav.childframe.length>0) {
                    thenav.childframe[thenav.childframe.length-1].options.backfunc();
                } else if (thenav instanceof h5ui.nav) {
                    thenav.options.backfunc();
                } else {
                    plus.runtime.quit();
                }
            } else {
                plus.runtime.quit();
            }
        };
    };
})();
