/**
 * 创建文章的node脚本
 * 启动后，访问127.0.0.1/add 来添加文章
 * 其中add.tpl为添加操作页面的模板
 * indextmp.tpl为首页模板
 * template.tpl为文章模板 
 * articlelist.json为已建文章列表
 */
var http = require('http');
var path = require('path');
var url  = require('url');
var fs = require('fs');
var existsArticle = require('./articlelist.json') || [];

// 读取模板文件
var template = '';
fs.readFile('./template.tpl', function ( err, data) {
    if( !err ) {
        template = data.toString('utf-8');
    }
});

var indextmp = '';
fs.readFile('./indextmp.tpl', function ( err, data) {
    if( !err ) {
        indextmp = data.toString('utf-8');
    }
});


/**
 * send 数据发送，非chunked模式
 * @param  {[type]} res         [description]
 * @param  {[type]} content     [description]
 * @param  {[type]} contentType [description]
 * @return {[type]}             [description]
 */
var send = function (res, content, contentType) {
    var srcContent = content || ' ';

    // 头信息设置
    var headSettings = {};
    headSettings['Content-Length']   = Buffer.byteLength( srcContent );
    headSettings['Content-Type']     = contentType || 'text/html';

    // 实际发送处理
    res.writeHead( 200, headSettings );
    res.end(srcContent);
};

var strReplace = function (str, data) {
    var reg = /\#\{([a-zA-Z\_\-0-9]+)\}/g;
    var result = str.replace(reg, function (){
        var ar = (typeof data[arguments[1]] == 'undefined' ) ? '' : data[arguments[1]];
        return ar;
    });
    return result;
};

var queryToJson = function (queryStr) {
    if (queryStr == undefined) {
        return {};
    }
    var reg = /([^\?&\&]+)/g;
    var temp = queryStr.match( reg );
    var resultObj = {};
    for (var i = 0; i < temp.length; i++) {
        var queryStr = temp[i];
        var strArr = queryStr.split('=');

        if (strArr.length >= 2) {
            resultObj[ strArr[0] ] = strArr[1];
        }
    }
    return resultObj;
};

var listenReq = function (req, cbk) {
    var data = '';
    req.addListener("data", function(postDataChunk) {
        data += postDataChunk;
        
    });
    req.addListener("end", function() {
        cbk(data);
    });
};

// 创建文件路径
var createPath = function ( path ) {
    if( fs.existsSync( CONFIG.STATIC_CACHE_PATH + '/' + path ) ) {
        return;
    }

    path = path.replace( /\\/g, '/' );
    path = path.replace( /^\/(.*)\/$/, '$1' );

    var pathArr = path.split('/');

    for( var i = 1, pL = pathArr.length; i <= pL; i++ ) {
        var tmpPath = CONFIG.STATIC_CACHE_PATH + '/' + pathArr.slice(0, i ).join('/');
        if( !fs.existsSync( tmpPath ) ) {
            fs.mkdirSync( tmpPath );
        }
    }
};

var createFile = function (filePath, content, cbk) {
    fs.writeFile(filePath, content, function ( err ){
        if( err ){
            console.log( err );
        }
        else {
            console.log(filePath + ' has created!');
            cbk();
        }
    } ); 
}

// 创建文章
var createArticle = function (res, fileName, data) {
    var str = strReplace(template, data);
    createFile('./page/' + fileName + '.html', str, function () {
        send(res, 'Task Finished!');
    });
};


var TEMP_ITEM = '<li><a href="./page/#{filename}.html" target="_blank">#{title}</a></li>';
var freshIndex = function (newArticle, cbk) {
    if (!existsArticle.list) {
        existsArticle.list = [];
    }
    existsArticle.list.push(newArticle);
    var arr = existsArticle.list;
    var str = [];
    for (var i  = 0, arrL = arr.length; i < arrL; i++) {
        str.unshift(strReplace(TEMP_ITEM, arr[i]));
    }

    var result = strReplace(indextmp, {
        list: str.join('')
    });


    createFile('./articlelist.json', JSON.stringify(existsArticle), function () {
        createFile('./index.html', result, function () {
            cbk && cbk();
        });
    });
};

// 创建服务器
http.createServer(function (req, res){
    var urlInfo = url.parse(req.url);

    var content = '';
    switch(urlInfo.path) {
        case '/add':
            fs.readFile('./add.tpl', function ( err, data) {
                if( !err ) {
                    content = data.toString('utf-8');
                    send(res, content);
                }
            });
            return;
            break;
        case '/submit':
            listenReq(req, function (dataStr) {
                var data = queryToJson(dataStr);
                for (var i in data) {
                    if (data.hasOwnProperty(i)) {
                        // 此处的空格会替换成+，不知道为什么
                        data[i] = decodeURIComponent(data[i].replace(/\+/g, ' '));
                    }
                }
                freshIndex(data, function () {
                    createArticle(res, data.filename, data);
                });
            });
            return;
            break;
        default:
            fs.readFile('.' + urlInfo.path, function ( err, data) {
                if( !err ) {
                    content = data.toString('utf-8');
                    send(res, content, 'text/css');
                }
            });
            return;
    }
    
}).listen(80, '0.0.0.0');