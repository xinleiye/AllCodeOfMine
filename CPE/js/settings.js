var g_topMenu = [];
//var g_leftMenu = [];
var g_menuMap = {};
var g_pageUrl = "";
var g_pid = "";
var g_id = "";

function showSubMenuItem(ev){
    var ev = ev || event;
    var target = ev.target || ev.srcElement;
    var odiv = document.getElementById("left_menu");
    var oul;
    var ospan;
    var parentNode;

/*     for (var i = 0, len = 2; i < len; i++)
    {
        if()
    } */
    switch(target.id){
        case "WWAN_Settings":
            // oul = odiv.getElementsByTagName("ul");
            // ospan = odiv.getElementsByTagName("span");
            // ospan[0].innerHTML = "-";
            // oul[0].setAttribute("style", "");
            var oa = document.getElementById(target.id);
            parentNode = oa.parentNode
            oul = parentNode.getElementsByTagName("ul")[0];
            ospan = parentNode.getElementsByTagName("span");
            ospan[0].innerHTML = "-";
            oa.parentNode.getElementsByTagName("ul")[0].setAttribute("style", "");
            //console.log(oul);
            break;
        case "NAT_Settings":
            //console.log(target.id);
            break;
        default:
            break;
    }
/*
    var oul = oli.getElementsByTagName("ul");
    var ospan = oli.getElementsByTagName("span");
    ospan[0].innerHTML = "-";
    console.log(ospan[0].innerHTML);
    oul[0].setAttribute("style", "");
*/
    //alert("Hello");
    //event.preventDefault();
}
/*
function xml2object($xml) {
    var obj = {};
    if ($xml.find('response').length > 0) {
        var _response = _recursiveXml2Object($xml.find('response'));
        obj.type = 'response';
        obj.response = _response;
    } else if ($xml.find('error').length > 0) {
        var _code = $xml.find('code').text();
        var _message = $xml.find('message').text();
        obj.type = 'error';
        obj.error = {
            code: _code,
            message: _message
        };
    } else if ($xml.find('config').length > 0) {
        var _config = _recursiveXml2Object($xml.find('config'));
        obj.type = 'config';
        obj.config = _config;
    } else {
        obj.type = 'unknown';
    }
    return obj;
}

function _xml2feature($xml) {
    var obj = null;
    if ($xml.find('config').length > 0) {
        var _config = _recursiveXml2Feature($xml.find('config'));
        obj = _config;
    }
    return obj;
}

function _createFeatureNode(str) {
    if (typeof (str) == 'undefined' || str == null) {
        return null;
    }
    var isEmpt = $.trim(str);
    if(isEmpt == "") {
        return isEmpt;
    }
    if (isNaN(str)) {
        return str;
    } else {
        var value = parseInt(str, 10);
        return value;
    }
}
function _recursiveXml2Object($xml) {
    if ($xml.children().length > 0) {
        var _obj = {};
        $xml.children().each( function() {
            var _childObj = ($(this).children().length > 0) ? _recursiveXml2Object($(this)) : $(this).text();
            if ($(this).siblings().length > 0 && $(this).siblings().get(0).tagName == this.tagName) {
                if (_obj[this.tagName] == null) {
                    _obj[this.tagName] = [];
                }
                _obj[this.tagName].push(_childObj);
            } else {
                _obj[this.tagName] = _childObj;
            }
        });
        return _obj;
    } else {
        return $xml.text();
    }
}
function _recursiveXml2Feature($xml) {
    if ($xml.children().length > 0) {
        var _obj = {};
        $xml.children().each( function() {
            var _childObj = ($(this).children().length > 0) ? _recursiveXml2Feature($(this)) : _createFeatureNode($(this).text());
            if ($(this).siblings().length > 0 && $(this).siblings().get(0).tagName == this.tagName) {
                //这部分代码是将与第一个兄弟结点一样的结点保存到一个数组中，代码用途不明
                if (_obj[this.tagName] == null) {
                    _obj[this.tagName] = [];
                }
                _obj[this.tagName].push(_childObj);
            } else {
                _obj[this.tagName] = _childObj;
            }
        });
        return _obj;
    } else {
        return _createFeatureNode($xml.text());
    }
}
*/
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
    //console.log($($xml));
    if ($xml.children().length > 0) {
        var obj = {};
        $xml.children().each(function(i){
            //console.log(this.tagName);
            //console.log($(this).children().length);
            //console.log($(this).siblings().get(0));
            var childObj = {};
            if ($(this).children().length > 0) {
                //console.log("Hello");
                //console.log($(this).siblings());
                childObj = _parseXML2Object($(this));
                //console.log(childObj);
            } else {
                childObj = _getNodeValue($(this).text());
                //console.log(childobj);
            }
            obj[this.tagName] = childObj;
            //console.log(obj);
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
            message: _message,
        };
    } else {
        obj.type = "unknow";
    }
    return obj;
}
//获取XML成功后回调函数
function GetStudentComplete(data) {
    var xml;
    var rel;

    if (typeof data == 'string' || typeof data == 'number') {
        if (!window.ActiveXObject) {
            var parser = new DOMParser();
            xml = parser.parseFromString(data, 'text/xml');
        } else {
            xml = new ActiveXObject('Microsoft.XMLDOM');
            xml.async = false;
            xml.loadXML(data);
        }
    } else {
        xml = data;
    }
    //console.log(xml);
    //console.log($(xml));
    rel = xml2object($(xml));
    //console.log(rel);
/*
    $(xml).find("menu").children().each(function(i){
        if ($(this).children().length === 0) {
            console.log(parseInt($(this).text(), 10));
        }
    });
    $(xml).find("student").each(function(i) {     //查找所有student节点并遍历
        var id = $(this).children("id");          //获得子节点
        var id_vaule = id.text();                 //获取节点文本
        var email_vaule = $(this).attr("email");  //获取节点的属性

        console.log(email_vaule);
    });
    */
}
var g_globalConfigData;
var g_menuMap;
var g_pageTitle;
var g_ajaxTimeout = 20000;
function getConfigData(urlstr, callback, options) {
    var isasync = true,
        inTimeout;
    if (options.async) {
        isasync = options.async === true ? true : false;
    }
    if (options.timeout) {
        inTimeout = parseInt(options.timeout, 10);
        if (isNaN(inTimeout)) {
            inTimeout = g_ajaxTimeout;
        } else if (inTimeout > g_ajaxTimeout) {
            inTimeout = g_ajaxTimeout;
        }
    }
    $.ajax({
        url: urlstr,
        type: "GET",
        async: isasync,
        dataType: "xml",
        timeout: inTimeout,
        cache: false,
        error: function(xhr, textStatus) {
            var errorInfo = textStatus + ": " + xhr.status + " " + xhr.readyState;
            console.log(errorInfo);
        },
        success: function(data){
            if (typeof callback === "function"){
                callback(data);
            }
        },
    });
}

function getGlobalConfigData(){
    getConfigData('/config/global.xml', function(xml){
        g_globalConfigData = xml2object($(xml));
        g_menuMap = g_globalConfigData.config.menu;
        console.log(g_menuMap);
    }, {
        async: true,
        timeout: 1000
    })
}

$(document).ready(function() {
    getGlobalConfigData();
    //getConfigData('/config/global.xml', GetStudentComplete, {async: true, timeout: 1000});
/*    $.ajax({
        url: '/config/global.xml',
        type: 'GET',
        dataType: 'xml',
        timeout: 1000,  //设定超时
        cache: false,   //禁用缓存
        error: function() {
            console.log("加载XML文档出错!");
        },
        success: GetStudentComplete   //设置成功后回调函数
    });*/
});
/*
(function(){

    window.onload = function(){
        g_pageUrl = getPageUrl(g_pageMap);
        g_topMenu = getTopMenu(g_pageMap);
        //g_leftMenu = getLeftMenu(menu, g_pageUrl);
        g_menuMap = getMenuMap(g_pageMap, g_pageUrl);

        initTopMenu(g_topMenu);
        initLeftMenu(g_menuMap);

        updateMenuStatus(g_menuMap, g_pid, g_id);
        console.log(document);
    };
})();
*/
/*
$(document).ready(function()
{
    $("#h_autoconnect").hide();
    $("#h_roaming").hide();
    RefreshMobileAP();
    $("#h_autoconnect").prop('disabled',true);
    $("#h_roaming").prop('disabled',true);

});
var changedvalues = 0;
var Can_Update = 0;
var Old_AutoConnect = 0;
var Old_Roaming = 0;
function UpdateMobileAPValues()
{
    changedvalues = 0;
    if($("#Select_AutoConnect").val() != Old_AutoConnect)
        changedvalues = changedvalues | 2;
    if($("#Select_Roaming").val() != Old_Roaming)
        changedvalues = changedvalues | 4;
    RefreshMobileAP();
}

function RefreshMobileAP()
{
    var error_occured = 0;
    var error_msg = "";
    if(changedvalues == 0)
        pagetag = "GetMobileAP";
    else
        pagetag = "SetMobileAP";
//
    $.ajax(
    {
        type: "POST",
        url: "cgi-bin/qcmap_web_cgi",
        data:
        {
            Page: pagetag,
            mask: changedvalues,
            autoconnect: $("#Select_AutoConnect").val(),
            autoconnect_result: "0",
            roaming: $("#Select_Roaming").val(),
            roaming_result: "0",
            token: session_token
        },
        dataType: "text",
        success: function(msgs)
        {
            if(msgs.length > 0)
            {
                var obj = jQuery.parseJSON(msgs);
                if(obj.result == "AUTH_FAIL")
                {
                    hide_menu();
                    loadpage('QCMAP_login.html');
                    alert("Device is being configured by a different IP: relogin");
                    return;
                }
                if(obj.result == "Token_mismatch")
                {
                    hide_menu();
                    loadpage('QCMAP_login.html');
                    alert("Unauthorised request: relogin");
                    return;
                }
                if(msgs.length <= 0)
                {
                    alert("Data not received from server.");
                }
                else
                {
                    if(changedvalues == 0)
                    {
                        if(obj.autoconnect_result != "SUCCESS")
                        {
                            $("#Label_AutoConnect").text("Failed to Update");
                            error_occured = 1;
                            error_msg = error_msg + "\n" + "Auto Connect : " + obj.autoconnect_result;
                            $("#Select_AutoConnect").val(Old_AutoConnect);
                        }
                        else
                        {
                            Old_AutoConnect = obj.autoconnect;
                            $("#Label_AutoConnect").text("");
                            $("#Select_AutoConnect").val(Old_AutoConnect);
                        }
                        if(obj.roaming_result != "SUCCESS" )
                        {
                            $("#Label_Roaming").text("Failed to Update");
                            error_occured = 1;
                            error_msg = error_msg + "\n" + "Roaming : " + obj.roaming_result;
                            $("#Select_Roaming").val(Old_Roaming);
                        }
                        else
                        {
                            Old_Roaming = obj.roaming;
                            $("#Label_Roaming").text("");
                            $("#Select_Roaming").val(Old_Roaming);
                        }
                    }
                    else
                    {
                        if(obj.autoconnect_result != "SUCCESS")
                        {
                            $("#Label_AutoConnect").text("Failed to Update");
                            error_occured = 1;
                            error_msg = error_msg + "\n" + "Auto Connect : " + obj.autoconnect_result;
                            $("#Select_AutoConnect").val(Old_AutoConnect);
                        }
                        else
                        {
                            Old_AutoConnect = obj.autoconnect;
                            $("#Label_AutoConnect").text("");
                        }
                        if(obj.roaming_result != "SUCCESS" )
                        {
                            $("#Label_Roaming").text("Failed to Update");
                            error_occured = 1;
                            error_msg = error_msg + "\n" + "Roaming : " + obj.roaming_result;
                            $("#Select_Roaming").val(Old_Roaming);
                        }
                        else
                        {
                            Old_Roaming = obj.roaming;
                            $("#Label_Roaming").text("");
                        }
                    }
                    //CheckProfileSettings(document.getElementById("Select_IP_Family"));
                    changedvalues = "0";
                }
                if(error_occured == 1)
                    alert(error_msg);
            }
            else
                alert("No Reply from server.");
        },
        error: function(xhr, textStatus, errorThrown)
        {
            alert("FAIL: " + xhr + " " + textStatus + " " + errorThrown);
        }
    });
}
*/