
/* 打开一个标签 */
function OpenTab(title, url, icon) {
    /**
    如果这个标题的标签存在，则选择该标签
    否则添加一个标签到标签组
    */
    if ($("#tabs").tabs('exists', title)) {
        $("#tabs").tabs('select', title);
    } else {
        $("#tabs").tabs('add', {
            title: title,
            content: createTabContent(url),
            closable: true,
            icon: icon
        });
    }
}

function iframefinish(_t) {
        //alert(_t.src);
        var y = (_t.contentWindow || _t.contentDocument);
        if (y.document) y = y.document;
        y.body.style.backgroundColor = "#0000ff";

        var iframeHtml = y.body.innerHTML;
        if (iframeHtml.indexOf("token=") > -1 && !(iframeHtml.indexOf("token=\"") > -1)) {
        var token = iframeHtml.substr(iframeHtml.indexOf("token="), 20).replace(/[^0-9]+/g, '');
        }

        var gui = require('nw.gui');
        var win = gui.Window.get();
        win.cookies.getAll({}, function (cookies) {
            // alert(JSON.stringify(cookies));
            cookies.forEach(function (cookie) {
                if ('mp.weixin.qq.com' == cookie.domain) {
                    //alert(cookie.domain);
                    //alert(cookie.name);
                   // alert(cookie.value);
                  // alert(JSON.stringify(cookie));
                }
            });
        });



}

/* 生成标签内容 */
function createTabContent(url) {
    return '<iframe style="width:100%;height:100%;" onload="iframefinish(this)"  scrolling="auto" frameborder="0" src="' + url + '"></iframe>';
}

 /*菜单点击*/
 function menuclick(_node){
     //alert($(_node.text).text());

       var title = $(_node.text).text();
       var url = $(_node.text).attr("rel");
       var icon = $(_node.text).attr("icon");
       OpenTab(title, url, icon);
     return false; //使超链接的单击事件失效
 }

function clearCookiesJournal() {
    var fs = require('fs');
    var dataPath = require('nw.gui').App.dataPath;
    var cj = dataPath + "/cookies-journal";
    var ck = dataPath + "/cookies";
    fs.exists(cj, function (exists) {
        if (exists) fs.unlinkSync(cj);
    });
    fs.exists(ck, function (exists) {
        if (exists) fs.unlinkSync(ck);
    });
}

function mysetcookies(){
       var gui = require('nw.gui');
       var win = gui.Window.get();
       win.cookies.set({
           "url": "https://mp.weixin.qq.com",
                   "domain": "mp.weixin.qq.com",
                   "expirationDate": 1518835221,
                   "httpOnly": false,
                   "name": "mm_lang",
                   "path": "/",
                   "sameSite": "no_restriction",
                   "secure": false,
                   "storeId": "0",
                   "value": "zh_CN"
               });

}

function myremovecookies() {
       var gui = require('nw.gui');
       var win = gui.Window.get();
       removeAllCookies(win);

}


function removeAllCookies(win) {

    win.cookies.getAll({}, function (cookies) {
               // console.log('attempting to get cookies' + cookies.length + 'cookies...');
        for (var i = 0; i < cookies.length; i++) {
           //alert(JSON.stringify(cookies[i]));
            removeCookie(win, cookies[i]);
            if (cookies[i].session== false) {
             // win.cookies.set(cookies[i]);
            }
            
        }
    });
}

function removeCookie(nwWin, cookie) {
    console.log('removing cookie:' + cookie.name + ':' + cookie.domain + cookie.path);
    var lurl = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain + cookie.path;
    nwWin.cookies.remove({
            url: lurl,
            name: cookie.name
        },
        function (result) {
            if (result) {
                if (!result.name) {
                    result = result[0];
                } // in devTools it looked like the result was an arra
                console.log('cookie remove callback:' + result.name + '' + result.url);
            } else {
                console.log('cookie removal failed');
            }
        }
    );
}

/*
$(function () {
    $("#menu li a").click(function () {
        var title = $(this).text();
        var url = $(this).attr("rel");
        var icon = $(this).attr("icon");
        OpenTab(title, url, icon);
        return false; //使超链接的单击事件失效
    });
});*/

/*
var wR = chrome.webRequest || chrome.experimental.webRequest;
var new_sessionId = "randskbksbdfmnsdbf345k345h34k5";
wR.onBeforeSendHeaders.addListener(
    function (details) {
        details.requestHeaders.forEach(function (header) {
            if (header.name === "Cookie") {
                var cookies = header.value.split(";");
                var valid_cookies = cookies.filter(function (cookie) {
                    return cookie && cookie.indexOf("connect.sid") < 0;
                });
                valid_cookies.push("connect.sid=" + new_sessionId);
                header.value = valid_cookies.join("; ");

                alert(cookies);
            }
        });
        return { requestHeaders: details.requestHeaders };
    },
    { urls: ["<all_urls>"] },
    ["blocking", "requestHeaders"]
);

wR.onHeadersReceived.addListener(function (details) {
    details.responseHeaders.forEach(function (header) {
        if (header.name === "set-cookie") {
            var cookies = header.value.split("; ");
            var sessionCookie = cookies.find(function (cookie) {
                return cookie && cookie.indexOf("connect.sid") === 0;
            });
            if (sessionCookie) {
                var sessionId = sessionCookie.split("=")[1];
                // console.log(sessionId);
            }
        }
    });
},
    { urls: ["<all_urls>"] },
    ["blocking", "responseHeaders"]
);*/