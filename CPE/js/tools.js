/*
* 定时器方法
* */
var timerPrototype = {
    create: function(callback, time, name){
        this.id = 0;
        this.callback = callback;
        this.time = time;
        this.name = name;
    },
    stop: function(){
        var _this = this;
        clearTimeout(_this.id);
    },
    start: function(){
        var callback, time, _this;

        callback = this.callback;
        time = this.time;
        _this = this;
        function _start(){
            callback();
            _this.id = setTimeout(_start, time);
        }
        _start();

    }
};

function Timer(callback, time, name) {
    var f;
    function F(){}
    F.prototype = timerPrototype;
    f = new F();
    f.create(callback, time, name);
    return f;
}

/*
* ajax方法
* */
function getAjaxJsonData(urlstr, callback, options) {
    var isasync = true,
        cache = false,
        inTimeout = 0;

    if (options) {
        if (options.hasOwnProperty("async")) {
            isasync = options.async;
        }
        if (options.hasOwnProperty("cache")) {
            cache = options.cache;
        }
        if (options.hasOwnProperty("timeout")) {
            inTimeout = parseInt(options.timeout, 10);
            if ((inTimeout < 0) || isNaN(inTimeout)) {
                inTimeout = g_ajaxTimeout;
            }
        }
    }
    $.ajax({
        url: urlstr,
        async: isasync,
        timeout: inTimeout,
        cache: cache,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        error: function(xhr, textStatus) {
            var errorInfo = textStatus + ": " + xhr.status + " " + xhr.readyState;
            console.log(errorInfo);
        },
        success: function(data){
            var obj = data2Object(data);
            if (typeof callback === "function"){
                callback(obj);
            }
        }
    });
}

function getAjaxXMLData(urlstr, callback, options) {
    var isasync = true,
        cache = false,
        inTimeout = 0;

    if (options) {
        if (options.hasOwnProperty("async")) {
            isasync = options.async;
        }
        if (options.hasOwnProperty("timeout")) {
            inTimeout = parseInt(options.timeout, 10);
            if ((inTimeout < 0) || isNaN(inTimeout)) {
                inTimeout = g_ajaxTimeout;
            }
        }
        if (options.hasOwnProperty("cache")) {
            cache = options.cache;
        }
    }
    $.ajax({
        url: urlstr,
        async: isasync,
        timeout: inTimeout,
        cache: cache,
        type: "POST",
        dataType: "xml",
        contentType: "application/xml",
        error: function(xhr, textStatus) {
            var errorInfo = textStatus + ": " + xhr.status + " " + xhr.readyState;
            console.log(errorInfo);
        },
        success: function(data){
            var obj = xml2object($(data));
            if (typeof callback === "function"){
                callback(obj);
            }
        }
    });
}

function saveAjaxJsonData(url, data, callback, options){
    var isasync = true,
        timeout = 0;

    if (options){
        if (options.hasOwnProperty("async")){
            isasync = options.async;
        }
        if (options.hasOwnProperty("timeout")){
            timeout = options.timeout;
        }
    }
    $.ajax({
        url: url,
        async: isasync,
        data: data,
        timeout: timeout,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        error: function(xhr, msg){
            var errorInfo = xhr.status + ": " + msg;
            console.log(errorInfo);
        },
        success: function(data){
            var obj = data2Object(data);
            if (typeof callback === "function") {
                callback(obj);
            }
        }
    });
}

function data2Object(data){
    var obj;
    if (data){
        if (typeof data === "object"){
            obj = data;
        } else {
            try{
                obj = JSON.parse(data);
            } catch(e){
                obj = {};
            }
        }
    } else {
        obj = {};
    }
    return obj;
}
function _getNodeValue(str) {
    if (typeof (str) === "undefined" || str === null ) {
        return null;
    }
    var trimStr = $.trim(str);
    if ( trimStr.length === 0) {
        return trimStr;
    }
    if (isNaN(str)) {
        return str;
    } else {
        return parseInt(str, 10);
    }
}
function _parseXML2Object($xml) {
    if ($xml.children().length > 0) {
        var obj = {};
        $xml.children().each(function(){
            var childObj = {};
            if ($(this).children().length > 0) {
                childObj = _parseXML2Object($(this));
            } else {
                childObj = _getNodeValue($(this).text());
            }
            if (obj[this.tagName]){
                if (Array.isArray(obj[this.tagName])) {
                    obj[this.tagName].push(childObj);
                } else {
                    var _value = obj[this.tagName];
                    obj[this.tagName] = [];
                    obj[this.tagName].push(_value);
                    obj[this.tagName].push(childObj);
                }
            } else {
                obj[this.tagName] = childObj;
            }
        });
        return obj;
    } else {
        return _getNodeValue($xml.text());
    }
}
function xml2object($xml){
    var obj = {};

    if ($xml.find("response").length > 0) {
        var _response = _parseXML2Object($xml.find("response"));
        obj.type = "response";
        obj.response =_response;
    } else if ($xml.find("config").length > 0) {
        var _config = _parseXML2Object($xml.find("config"));
        obj.type = "config";
        obj.config = _config;
    } else if ($xml.find("error").length > 0) {
        var _code = $xml.find("code").text(),
            _message = $xml.find("message").text();
        obj.type = "error";
        obj.error = {
            code: _code,
            message: _message
        };
    } else {
        obj.type = "unknow";
    }
    return obj;
}


/*
* 获取字符串方法
* */
function getText(text){
    if (typeof text === "string" && text.length !== 0) {
        document.write(text);
    } else {
        document.write("Error: Can't get string!");
    }
}

/**
 * 弹出框方法
 */
function showBasicDialog(title){
    var dialog = [
        '<div id="dialog">',
        '<div id="dialoghead">',
        '<div id="diatitle"><span></span></div>',
        '<div id="diaclose" class="pointer"><img src="../images/dialog_close_btn.png" /></div>',
        '</div>',
        '<div id="dialogbody">%dialogtype</div>',
        '<div id="dialogbottom" class="btn-area">',
        '<input id="cancel-btn" class="common-btn" type="button">',
        '<input id="ok-btn" class="common-btn" type="button">',
        '</div>',
        '</div>'].join("");

    showDialog(dialog);
    $("#diatitle").children("span").text(title);
    $("#dialogbody").text("");
    $("#diaclose").remove();
    $("#dialogbottom").remove();
}

function adjustPopWindowSize(){
    var odiv = document.getElementById("pop-window");
    odiv.style.width = Math.max($(window).width(), $(document).width()) + "px";
    odiv.style.height = Math.max($(window).height(), $(document).height()) + "px";
}
function closeDialog(){
    $(window).off("resize", adjustPopWindowSize);
    $("#pop-window").remove();
}
function closeResultDialog(){
    $(window).off("resize", adjustPopWindowSize);
    $("#pop-window").remove();
    window.location.reload();
}

function showDialog(style){
    var _dialog, odiv;
    var dialog = [
        '<div id="dialog">',
        '<div id="dialoghead">',
        '<div id="diatitle"><span></span></div>',
        '<div id="diaclose" class="pointer"><img src="../images/dialog_close_btn.png" /></div>',
        '</div>',
        '<div id="dialogbody">%dialog</div>',
        '<div id="dialogbottom" class="btn-area">',
        '<input id="cancel-btn" class="common-btn" type="button">',
        '<input id="ok-btn" class="common-btn" type="button">',
        '</div>',
        '</div>'].join("");

    if (typeof style === "string") {
        _dialog = dialog.replace("%dialog", style);
    } else {
        _dialog = dialog.replace("%dialog", "");
    }
    odiv = document.createElement("div");
    odiv.id = "pop-window";
    odiv.className = "mask";
    odiv.style.width = Math.max($(window).width(), $(document).width()) + "px";
    odiv.style.height = Math.max($(window).height(), $(document).height()) + "px";
    $(window).on("resize", adjustPopWindowSize);
    odiv.innerHTML = _dialog;
    document.body.appendChild(odiv);
}
function showResultDialog(title, msg, time){
    var style = [
        '<div id="resultdialog" class="clearfix">',
        '<div id="resultmsg">',
        '<span></span>',
        '</div>',
        '</div>'].join("");

    showDialog(style);

    $("#diatitle").children("span").text(title);
    $("#diaclose").remove();
    $("#resultmsg").children("span").text(msg);
    $("#dialogbottom").remove();

    if (typeof time === "number"){
        setTimeout(closeResultDialog, time);
    } else {
        setTimeout(closeDialog, 3000);
    }

}

function showWaitingDialog(title, msg){
    var style = [
        '<div id="waitingdialog" class="clearfix">',
        '<div id="waitingimg"></div>',
        '<div id="waitingmsg">',
        '<span></span>',
        '</div>',
        '</div>'].join("");
    showDialog(style);

    $("#diatitle").children("span").text(title);
    $("#diaclose").remove();
    $("#waitingmsg").children("span").text(msg);
    $("#dialogbottom").remove();
}

function showConfirmDialog(title, msg, callback){
    var style = [
        '<div id="confirmdialog">',
        '<div id="confirmmsg">',
        '<span></span>',
        '</div>',
        '</div>'].join("");

    showDialog(style);
    $("#diatitle").children("span").text(title);
    $("#diaclose").on("click", closeDialog);
    $("#confirmmsg").children("span").text(msg);
    if (typeof callback === "function"){
        $("#ok-btn").attr("value", common_ok).on("click", callback);
    }
    $("#cancel-btn").attr("value", common_cancel).on("click", closeDialog);
}