var g_resultSuccess = 0;
var g_resultFailed = 1;
var g_globalConfigData;
var g_menuMap;
var g_menuRoute = [];
var g_currentUrl;
var g_maxMenuNum = 5;
var g_pageTitle;
var g_ajaxTimeout = 60000;
var g_networkModeNONE = 0;
var g_networkModeCDMA = 1;
var g_networkModeEVDO = 2;
var g_networkModeGSM = 3;
var g_networkModeWCDMA = 4;
var g_networkModeLTE = 5;
var g_networkModeTDSCDMA = 6;
var g_login = 1;
var g_logout = 0;
var g_curLoginStatus = 0;
var g_defaultLang = "";
var g_currentLang = "";
var g_langList = [];
var g_userName = "";
var g_simStatusNo = 0;
var g_networkStatusTimer;
var g_logoutTime = 300000;
var g_logoutTimer;
var g_allTimer = [];
var g_curSimStatus;
var g_curSimImsi;
var g_sigLevel;
var g_operatorName;
var g_curNetworkType;
var g_curWifiStatusOn = 0;
var g_curWifiStatusOff = 1;
var g_curWifiStatus;
var g_internetModeDHCP = 1;
var g_internetModePPPoE = 2;
var g_internetModeStation = 3;
var g_internetModeMobile = 4;
var g_headInfo = [
    //'<div id="logo" class="logo"></div>',
    '<div id="tools" class="tools">',
    '<div id="lang" class="lang">',
    '<select></select>',
    '</div>',
    '<div id="help" class="help">',
    '<a id="help-url" href="#"><span>Help</span></a>',
    '</div>',
    '<div id="login-info" class="login-info pointer">',
    '<span></span>',
    '</div>',
    '</div>',
    '<div id="info" class="info">',
    '<ul>',
    '<li id="wifi-status" class="info-img"><img src="../images/wifi_on.png"></li>',
    '<li id="internet-mode" class="info-img"><img src="../images/wifi_small_0.png"/></li>',
    '<li id="signal-simg" class="info-img"><img src="../images/signal_small_0.png"></li>',
    '<li id="card-status" class="info-img"><img src="../images/card_invalid.png"/></li>',
    '</ul>',
    '</div>'];
var g_curInternetMode;

doIECompatibility();
getGlobalData();

$(document).ready(function(){
    var simStatusTimer;
    document.title = g_pageTitle;
    if (g_currentUrl === "cardinvalid") {
        initCardInvalidHeader();
    } else {
        initHeader();
    }
    if (g_curSimStatus !== g_simStatusNo){
        simStatusTimer = Timer(updateNetworkStatus, 5000, "simStatus");
        simStatusTimer.start();
        g_allTimer.push(simStatusTimer);
    }
    $("#content-netinfo").remove();
    initMenuMain();
    initMenuLeft();
    initFooter();

});
function getSimStatus(){
    getAjaxJsonData("/action/GetSimInfo", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            g_curSimStatus = obj.status;
            g_curSimImsi = obj.imsi;
        }
    }, {
        async: false
    });
}
function updateNetworkStatus(){
    if (g_curSimStatus !== g_simStatusNo){
        getAjaxJsonData("/action/GetWirelessNetworkInfo", function(obj){
            var _signal, _internet;
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                g_sigLevel = obj.sigLevel;
                _signal = "../images/signal_small_" + obj.sigLevel + ".png";
                $("#signal-simg").children("img").attr("src", _signal);
                if (g_currentUrl === "home" && g_curInternetMode === g_internetModeMobile){
                    _internet = "../images/signal_big_" + g_sigLevel + ".png";
                    $("#internet-img").attr("src", _internet);
                }
            }
        }, {
            async: true
        });
    }
    getAjaxJsonData("/action/GetInternetMode", function(obj){
        var $internetmode;

        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            g_curInternetMode = obj.mode;
            $internetmode = $("#internet-mode");
            if (g_curInternetMode === g_internetModeDHCP){
                $internetmode.children("img").attr("src", "../images/ethernet_small.png");
                $internetmode.attr("title", str_internet_dynamic);
            } else if (g_curInternetMode === g_internetModePPPoE){
                $internetmode.children("img").attr("src", "../images/ethernet_small.png");
                $internetmode.attr("title", str_internet_pppoe);
            } else if (g_curInternetMode === g_internetModeStation){
                $internetmode.children("img").attr("src", "../images/wifi_small_4.png");
                $internetmode.attr("title", str_internet_mode_station);
            } else if (g_curInternetMode === g_internetModeMobile){
                $internetmode.children("img").attr("src", "../images/mobile_up_down.png");
                $internetmode.attr("title", str_internet_mode_mobile);
            } else {
                $internetmode.hide();
            }

        }
    }, {
        async: true,
        dataType: "json",
        contentType : 'application/json'
    });
}

function createButton(id, style, value){
    var obtn = document.createElement("input");
}
function getGlobalData(){
    //var lang = "lang_";
    getCurrentUrl();
    getAjaxJsonData("/action/GetLoginInfo", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            g_curLoginStatus = obj.loginStatus;
            if (g_curLoginStatus === g_login) {
                g_userName = obj.loginUser;
            } else {
                if (g_currentUrl !== "cardinvalid" && g_currentUrl !== "home") {
                    window.location.replace("home.html");
                }
            }
        } else {
            g_curLoginStatus = g_logout;
        }

    }, {
        async: false,
        timeout: 1000
    });

    getAjaxXMLData("/config/global.xml", function(xml){
        g_globalConfigData = xml;
        g_pageTitle = g_globalConfigData.config.title;
        g_maxMenuNum = g_globalConfigData.config.maxnumber_menu;
        g_menuMap = g_globalConfigData.config.menu;
        g_defaultLang = g_globalConfigData.config.default_language;
        g_currentLang = g_defaultLang;
    }, {
        async: false,
        timeout: 1000
    });

   /* lang += g_defaultLang;
    console.log("/language/" + lang + ".js");
    getAjaxData("/language/" + lang + ".js", function(xml){

    }, {
        datatype: "script",
        async: false,
        timeout: 1000
    });*/
    getAjaxXMLData("/config/language.xml", function(xml){
        var obj = xml;
        g_langList = obj.config.lang_list.lang;
    }, {
        async: false,
        timeout: 1000
    });

    getAjaxJsonData("/action/WifiGetStatus", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            g_curWifiStatus = obj.status;
        }
    },{
        async: false
    });

    getAjaxJsonData("/action/GetInternetMode", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            g_curInternetMode = obj.mode;
        }
    }, {
        async: false
    });

    getMenuRoute(g_menuMap);

    getSimStatus();
    if (g_curSimStatus !== g_simStatusNo){
        getAjaxJsonData("/action/GetWirelessNetworkInfo", function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                g_operatorName = obj.operatorName;
                g_sigLevel = obj.sigLevel;
                if (obj.networkType === g_networkModeNONE){
                    g_curNetworkType = str_home_noservice;
                } else if (obj.networkType === g_networkModeGSM) {
                    g_curNetworkType = common_2G;
                } else if (obj.networkType === g_networkModeCDMA ||
                    obj.networkType === g_networkModeEVDO ||
                    obj.networkType === g_networkModeWCDMA ||
                    obj.networkType === g_networkModeTDSCDMA)
                {
                    g_curNetworkType = common_3G;
                } else if (obj.networkType === g_networkModeLTE) {
                    g_curNetworkType = common_4G;
                } else {
                    g_curNetworkType = common_limited;
                }
            }
        }, {
            async: false
        });
    }
}

function clickMenuMainRedirect(ev){
    var redirect = false;
    var _ev = ev || event;
    var target = _ev.target || _ev.srcElemnt;
    var id = target.id || $(target).parent().attr("id");

    switch(id) {
        case "update":
        case "settings":
            var dest = $("#" + id).attr("href");
            if (g_curLoginStatus === g_logout){
                showLoginDialog(function(){
                    do_login(dest);
                });
                redirect = false;
            } else {
                redirect = true;
            }
            break;
        case "home":
            redirect = true;
            break;
        default:
            redirect =  false;
            break;
    }
    return redirect;
}

function initMenuMain() {
    if (!g_menuMap) {
        return
    }
    $("#content-top").load("menu.html #menu-main", function(){
        var menuNum = 0;
        if (g_menuMap.home && menuNum < g_maxMenuNum) {
            $("#menu-main-home").children("a").text(menu_main_home);
            menuNum++;
        } else {
            $("#menu-main-home").remove();
        }
        if (g_menuMap.update && menuNum < g_maxMenuNum) {
            $("#update").text(menu_main_update);
            menuNum++;
        } else {
            $("#menu-main-update").remove();
        }
        if (g_menuMap.settings && menuNum < g_maxMenuNum) {
            $("#settings").text(menu_main_settings);
            menuNum++;
        } else {
            $("#menu-main-settings").remove();
        }
        if (g_menuMap.log && menuNum < g_maxMenuNum ) {
            $("#log").text(menu_main_log);
            menuNum++;
        } else {
            $("#menu-main-log").remove();
        }
        $("#" + "menu-main-" + g_menuRoute[0] + " a").addClass("click");
        $("#menu-main").on("click", function(ev){
            return clickMenuMainRedirect(ev);
        });
    });

}
function changeMenuLeftStatus(ev){
    var submenu, _id;
    var _ev = ev || event;
    var target = _ev.target || _ev.srcElemnt;

    _id = $(target).parent().attr("id") || $(target).attr("id");
    if (_id === "menu-left-settings"){
        return;
    }
    if ($("#" + _id).children("a").length > 0) {
        return true;
    }
    submenu = $(this).children("ul").children("li");
    $.each(submenu, function(){
        if ($(this).attr("id") === _id) {
            if ($(this).hasClass("click")) {
                $(this).removeClass("click");
                $(this).children("ul").addClass("hide");
            } else {
                $(this).addClass("click");
                $(this).children("ul").removeClass("hide");
            }
        } else {
            $(this).removeClass("click");
            $(this).children("ul").addClass("hide");
        }
    });

}
function initDialupSubmenu(obj){
    if (obj.hasOwnProperty("mobileconnection")) {
        $("#mobileconnection").children("a").text(submenu_dialup_mobileconnection);
    } else {
        $("#mobileconnection").remove();
    }
    if (obj.hasOwnProperty("profilemanagement")) {
        $("#profilemanagement").children("a").text(submenu_dialup_profilemanagement);
    } else {
        $("#profilemanagement").remove();
    }
    if (obj.hasOwnProperty("networksettings")) {
        $("#networksettings").children("a").text(submenu_dialup_networksettings);
    } else {
        $("#networksettings").remove();
    }
}
function initEthernetSubmenu(obj){
    if (obj.hasOwnProperty("ethernetstatus")){
        $("#ethernetstatus").children("a").text(submenu_ethernet_status);
    } else {
        $("#ethernetstatsu").remove();
    }
    if (obj.hasOwnProperty("ethernetsettings")){
        $("#ethernetsettings").children("a").text(submenu_ethernet_settings);
    } else {
        $("#ethernetsettings").remove();
    }
    if (obj.hasOwnProperty("macclone")){
        $("#macclone").children("a").text(submenu_ethernet_macclone);
    } else {
        $("#macclone").remove();
    }
}
function initWlanSubmenu(obj){
    if (obj.hasOwnProperty("basicsettings")) {
        $("#basicsettings").children("a").text(submenu_wlan_basic);
    } else {
        $("#basicsettings").remove();
    }
    if (obj.hasOwnProperty("advancesettings")) {
        $("#advancesettings").children("a").text(submenu_wlan_advance);
    } else {
        $("#advancesettings").remove();
    }
    if (obj.hasOwnProperty("wlanmacfilter")) {
        $("#wlanmacfilter").children("a").children("a").text(submenu_wlan_macfilter);
    } else {
        $("#wlanmacfilter").remove();
    }
    if (obj.hasOwnProperty("wps")) {
        $("#wps").children("a").text(submenu_wlan_wps);
    } else {
        $("#wps").remove();
    }
    if (obj.hasOwnProperty("wifistation")) {
        $("#wifistation").children("a").text(submenu_wlan_wifistation);
    } else {
        $("#wifistation").remove();
    }
}
function initLanSubmenu(obj) {
    if (obj.hasOwnProperty("dhcp")) {
        $("#dhcp").children("a").text(submenu_lan_dhcp);
    } else {
        $("#dhcp").remove();
    }
}
function initSecuritySubmenu(obj) {
    if (obj.hasOwnProperty("firewallswitch")) {
        $("#firewallswitch").children("a").text(submenu_security_firewallswitch);
    } else {
        $("#firewallswitch").remove();
    }
    if (obj.hasOwnProperty("lanmacfilter")) {
        $("#lanmacfilter").children("a").text(submenu_security_macfilter);
    } else {
        $("#lanmacfilter").remove();
    }
    if (obj.hasOwnProperty("lanipfilter")) {
        $("#lanipfilter").children("a").text(submenu_security_lanipfilter);
    } else {
        $("#lanipfilter").remove();
    }
}
function initSystemSubmenu(obj){
    if (obj.hasOwnProperty("deviceinfo")) {
        $("#deviceinfo").children("a").text(submenu_system_deviceinfo);
    } else {
        $("#deviceinfo").remove();
    }
    if (obj.hasOwnProperty("modifypassword")) {
        $("#modifypassword").children("a").text(submenu_system_modifypsd);
    } else {
        $("#modifypassword").remove();
    }
    if (obj.hasOwnProperty("reboot")) {
        $("#reboot").children("a").text(submenu_system_reboot);
    } else {
        $("#reboot").remove();
    }
    if (obj.hasOwnProperty("restore")) {
        $("#restore").children("a").text(submenu_system_restore);
    } else {
        $("#restore").remove();
    }
}
function initMenuLeft(){
    var $leftmenu;
    if (!g_menuMap) {
        return;
    }
    $leftmenu = $("#menu-left");
    if ($leftmenu.children().is("#onlineupdate")) {
        $leftmenu.load("menu.html #menu-left-update", function(){
            if (g_menuMap.update.onlineupdate) {
                $("#label-onlineupdate").text(menu_left_onlineupdate);
            } else {
                $("#onlineupdate").remove();
            }
        });
    }
    if ($leftmenu.children().is("#settings")) {
        $leftmenu.load("menu.html #menu-left-settings", function(){
            if (g_menuMap.settings.internet) {
                $("#internet").children("a").text(menu_left_internet);
            } else {
                $("#internet").remove();
            }
            if (g_menuMap.settings.quicksetup) {
                $("#quicksetup").children("a").text(menu_left_quicksetup);
            } else {
                $("#quicksetup").remove();
            }
            if (g_menuMap.settings.dialup) {
                $("#label-dialup").text(menu_left_dialup);
                initDialupSubmenu(g_menuMap.settings.dialup);
            } else {
                $("#dialup").remove();
            }
            if (g_menuMap.settings.ethernet) {
                $("#label-ethernet").text(menu_left_ethernet);
                initEthernetSubmenu(g_menuMap.settings.ethernet);
            } else {
                $("#ethernet").remove();
            }
            if (g_menuMap.settings.wlan) {
                $("#label-wlan").text(menu_left_wlan);
                initWlanSubmenu(g_menuMap.settings.wlan);
            } else {
                $("#wlan").remove();
            }
            if (g_menuMap.settings.lan) {
                $("#label-lan").text(menu_left_lan);
                initLanSubmenu(g_menuMap.settings.lan);
            } else {
                $("#lan").remove();
            }
            if (g_menuMap.settings.security) {
                $("#label-security").text(menu_left_security);
                initSecuritySubmenu(g_menuMap.settings.security);
            } else {
                $("#lan").remove();
            }
            if (g_menuMap.settings.system) {
                $("#label-system").text(menu_left_system);
                initSystemSubmenu(g_menuMap.settings.system);
            } else {
                $("#system").remove();
            }
            if (g_menuRoute.length === 3) {
                $("#" + g_menuRoute[1] + " " + "ul").removeClass("hide");
                $("#" + g_menuRoute[2]).addClass("click");
            }
            $("#" + g_menuRoute[1]).addClass("click");
            $("#menu-left-settings").on("click", changeMenuLeftStatus);
            $(".submenu-item").on("mouseover", function(){
                $(this).addClass("active");
            }).on("mouseout", function(){
                $(this).removeClass("active");
            });
        });
    }
}
function getCurrentUrl() {
    var start = "/html/".length,
        end = 0,
        url = window.location.pathname;
    if (url.indexOf(".") >= 0) {
        end = url.indexOf(".");
    }
    g_currentUrl = url.substring(start, end);
}
function getMenuRoute(menumap){
    var ret = false;
    $.each(menumap, function(key, value){
        if (typeof value === "string") {
            if (value === g_currentUrl) {
                ret = true;
                g_menuRoute.unshift(key);
                return false;
            }
        } else if (typeof value === "object") {
            ret = getMenuRoute(value);
            if (ret) {
                g_menuRoute.unshift(key);
                return false;
            }
        }
    });
    return ret;
}

function initLangList(list){
    var $lang, innerHtml = "",
        _opn = "<option value=\"%lang\">%label_lang</option>";

    $lang = $("#lang");
    if (!Array.isArray(list)){
        innerHtml +=_opn;
        innerHtml = innerHtml.replace("%lang", list);
        innerHtml = innerHtml.replace("%label_lang", eval("common_lang_" + list));
        $lang.children("select").attr("disabled", "disabled");
    } else{
        for(var i = 0, len = list.length; i < len; i++){
            innerHtml +=_opn;
            innerHtml = innerHtml.replace("%lang", list[i]);
            innerHtml = innerHtml.replace("%label_lang", eval("common_lang_" + list[i]));
        }
    }
    $lang.children("select").html(innerHtml);
    $lang.on("change", function(){
        //console.log($("#lang select").val());
        //需要向后台发送语言变更
    });
}
function initHeader(){
    var head, $wifistatus, $internetmode;
    head = g_headInfo.join("");
    $("#header").html(head);
    $("#help").remove();
    if (g_curLoginStatus === g_logout){
        $("#login-info").on("click", login).children().text(common_login);
    } else {
        startLogoutTimer();
        $("#login-info").on("click", logout).children().text(common_logout + " (" + g_userName + ")");
    }
    initLangList(g_langList);

    if (g_curSimStatus === g_simStatusNo) {
        $("#signal-simg").remove();
        $("#card-status").children("img").attr("src", "../images/card_invalid.png");
    } else {
        var _signal_s = "";
        if (g_sigLevel) {
            _signal_s = "../images/signal_small_" + g_sigLevel + ".png";
        }
        $("#signal-simg").attr("title", g_curNetworkType).children("img").attr("src", _signal_s);
        $("#card-status").remove();
    }
    $wifistatus = $("#wifi-status");
    if (g_curWifiStatus === g_curWifiStatusOn) {
        $wifistatus.children("img").attr("src", "../images/wifi_on.png");
        $wifistatus.attr("title", common_wifion);
    } else if (g_curWifiStatus === g_curWifiStatusOff) {
        $wifistatus.children("img").attr("src", "../images/wifi_off.png");
        $wifistatus.attr("title", common_wifioff);
    } else {
        $wifistatus.children("img").attr("src", "../images/wifi_off.png");
        $wifistatus.attr("title", common_unknown);
    }
    $internetmode = $("#internet-mode");
    if (g_curInternetMode === g_internetModeDHCP){
        $internetmode.children("img").attr("src", "../images/ethernet_small.png");
        $internetmode.attr("title", str_internet_dynamic);
    } else if (g_curInternetMode === g_internetModePPPoE){
        $internetmode.children("img").attr("src", "../images/ethernet_small.png");
        $internetmode.attr("title", str_internet_pppoe);
    } else if (g_curInternetMode === g_internetModeStation){
        $internetmode.children("img").attr("src", "../images/wifi_small_4.png");
        $internetmode.attr("title", str_internet_mode_station);
    } else if (g_curInternetMode === g_internetModeMobile){
        $internetmode.children("img").attr("src", "../images/mobile_up_down.png");
        $internetmode.attr("title", str_internet_mode_mobile);
    } else {
        $internetmode.hide();
    }
}
function initCardInvalidHeader(){
    var head;
    head = g_headInfo.join("");
    $("#header").html(head);
    $("#login-info").remove();
    $("#help").remove();
    if (!Array.isArray(g_langList)){
        $("#lang").remove();
    } else {
        initLangList();
        $("#lang").on("change", function(){
            //console.log($("#lang").children("select").val());
            //需要向后台发送语言变更
        })
    }
}
function initFooter(){
    $("#privacy_policy").remove();
    $("#open_source").remove();
}
function setLang(){
    $.ajax({
        url: "/cgi-bin/test.py",
        type: "POST",
        async: false,
        dataType: "text",
        timeout: 1000,
        cache: false,
        data: "{'lang': 'en_us'}",
        error: function(xhr, textStatus) {
            var errorInfo = textStatus + ": " + xhr.status + " " + xhr.readyState;
            console.log(errorInfo);
        },
        success: function(data){
            console.log(data);
        }
    });
}

function doIECompatibility(){
    if (!Array.isArray) {
        Array.isArray = function(arg) {
            return Object.prototype.toString.call(arg) === "[object Array]";
        }
    }
}
function stopAllTimer(){
    var i, len;
    if (!Array.isArray(g_allTimer)) {
        return;
    }
    for(i = 0, len = g_allTimer.length; i < len; i++){
        g_allTimer[i].stop();
    }
}
function startAllTimer(){
    var i, len;
    if (!Array.isArray(g_allTimer)) {
        return;
    }
    for(i = 0, len = g_allTimer.length; i < len; i++){
        g_allTimer[i].start();
    }
}

function login(){
    showLoginDialog(do_login);
}
function do_login(dest){
    var ret = checkUsernamePassword();
    if (ret) {
        var data = $(".login-input").serializeArray();
        var _obj = {};
        var postdata;
        $.each(data, function(index, val){
            _obj[val.name] = val.value;
        });
        postdata = JSON.stringify(_obj);
    } else {
        return;
    }
    clearErrorMsg();
    saveAjaxJsonData("/action/login", postdata, function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            getAjaxJsonData("/action/GetLoginInfo", function(obj2){
                if (typeof obj2.retcode === "number" && obj2.retcode === g_resultSuccess){
                    g_curLoginStatus = obj2.loginStatus;
                    if (obj2.loginStatus === g_login){
                        g_userName = obj2.loginUser;
                        startLogoutTimer();
                        if (dest){
                            window.location.replace(dest);
                        } else {
                            $("#login-info").off("click", login).on("click", logout).children("span").text(common_logout + " (" + g_userName + ")");
                            closeDialog();
                        }
                    }
                }
            }, {
                timeout: 1000
            });
        } else {
            showErrorMsg("tips", "login-error-tips", str_login_error);
        }
    }, {
        async: false
    });
}

function logout(){
    showConfirmDialog(common_logout, str_logout_tips, do_logout);
}
function do_logout(){
    getAjaxJsonData("/action/logout", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            closeDialog();
            window.location.replace("home.html");
        }
    }, {
        async: false
    });
}

function showLoginDialog(callback){
    var logindialog = [
        '<div id="logindialog">',
        '<form class="login-input">',
        '<table cellpadding="0" cellspacing="0" width="300">',
        '<tr id="row-username" class="input-row-info">',
        '<td width="100"><label id="label-username" for="username"></label></td>',
        '<td><input id="username" type="text" name="username" class="user-input-name"></td>',
        '</tr>',
        '<tr id="row-password" class="input-row-info">',
        '<td><label id="label-password" for="password"></label></td>',
        '<td><input id="password" type="password" maxlength="16" name="password" class="user-input-pw"></td>',
        '</tr>',
        '<tr id="tips">',
        '<td colspan="2"></td>',
        '</tr>',
        '</table>',
        '</form>',
        '</div>'].join("");

    showDialog(logindialog);

    $("#diatitle").children().text(common_login);
    $("#diaclose").on("click", closeDialog);
    $("#label-username").text(common_username + common_colon);
    $("#username").focus();
    $("#label-password").text(common_password + common_colon);
    $("#ok-btn").attr("value", common_login).on("click", function(){
        callback();
    });
    $("#cancel-btn").attr("value", common_cancel).on("click", closeDialog);
    $("#logindialog").on("keyup", function(ev){
        var _ev = ev || event;
        if (_ev.keyCode === 13) {
            callback();
        }
        return true;
    });
}

function clearErrorMsg(){
    $("#error-msg").remove();
}
function showErrorMsg(id, css, msg){
    var tips = document.createElement("p");
    tips.id = "error-msg";
    tips.className = css;
    $(tips).text(msg);
    $("#" + id).children("td").append(tips);
}
function checkUsernamePassword() {
    var _usn,
        _pwd;
    _usn = $("#username").val();
    _pwd = $("#password").val();
    clearErrorMsg();
    if ( (_pwd.length < 5 || _pwd.length > 16) ) {
        showErrorMsg("tips", "login-error-tips", str_login_error);
        return false;
    }
    return true;
}
function startLogoutTimer(){
    if (g_curLoginStatus === g_login) {
        if (g_logoutTimer) {
            clearTimeout(g_logoutTimer)
        }
        g_logoutTimer = setTimeout(do_logout, g_logoutTime);
    }
}
function stopLogoutTimer(){
    if (g_logoutTimer) {
        clearTimeout(g_logoutTimer)
    }
}