(function(){
    var g_mobileDataOn = 1;
    var g_mobileDataOff = 0;
    var g_dialupConing = 100001;
    var g_dialupConed = 100002;
    var g_dialupDisconing = 100003;
    var g_dialupDisconed = 100004;
    var g_wifiStationConed = 5;
    var g_wifiStationConing = 3;
    var g_wifiStationDiscon = 4;
    var g_simStatusNo = 0;
    var g_internetModeDHCP = 1;
    var g_internetModePPPoE = 2;
    var g_internetModeStation = 3;
    var g_internetModeMobile = 4;
    var g_mobileDataStatus;
    var g_curSimStatus;
    var g_operatorName;
    //var g_curInternetMode;
    var g_sigLevel;
    //var g_dialupStatus;
    var g_internetModeTimer;
    var g_dialupStatusTimer;

    getNetworkStatus();
    $(document).ready(function(){
        $("#profile-setting").children().on("click", function(){
            var dest = $(this).attr("href");
            if (g_curLoginStatus === g_logout) {
                showLoginDialog(function(){
                    do_login(dest);
                });
                return false;
            }
        });
        g_internetModeTimer  = Timer(updataInternetMode, 3000, "internetmode");
        g_internetModeTimer.start();
        g_allTimer.push(g_internetModeTimer);
        /*if (g_curInternetMode === g_internetModeMobile && g_mobileDataStatus === g_mobileDataOn) {
            g_dialupStatusTimer = Timer(updateDialupStatus, 3000, "dialupStatus");
            g_dialupStatusTimer.start();
            g_allTimer.push(g_dialupStatusTimer);
        }*/
        $("#data-btn").on("click", saveMobileDataStatus);
    });

    function updataInternetMode(){
        var _internet, _network, $databtn;
        $databtn = $("#data-btn");
        if (g_curInternetMode === g_internetModeDHCP) {
            _network = str_ethernet_dynamic;
            _internet = "../images/ethernet_big.png";
            $databtn.hide();
        } else if (g_curInternetMode === g_internetModePPPoE) {
            _network = str_ethernet_pppoe;
            _internet = "../images/ethernet_big.png";
            $databtn.hide();
        } else if (g_curInternetMode === g_internetModeStation) {
            _network = str_wlan_wifistation;
            _internet = "../images/wifi_big_4.png";
            $databtn.hide();
            updateWifiStationStatus();
        } else if (g_curInternetMode === g_internetModeMobile) {
            if (g_curSimStatus !== g_simStatusNo){
                _network = g_operatorName + " " + g_curNetworkType;
                if (g_mobileDataStatus === g_mobileDataOn){
                    $databtn.removeClass("data-off").addClass("data-on");
                    /*if (!g_dialupStatusTimer) {
                        g_dialupStatusTimer = Timer(updateDialupStatus, 3000, "dialupStatus");
                        g_dialupStatusTimer.start();
                        g_allTimer.push(g_dialupStatusTimer);
                    } else {
                        g_dialupStatusTimer.start();
                    }*/
                } else {
                    $databtn.removeClass("data-on").addClass("data-off");
                    $("#data-status").children("span").text(str_home_datatips);
                }
            } else {
                _network = g_curNetworkType;
                $databtn.addClass("data-off");
                $("#data-status").children("span").text(str_home_invalidcard);
            }
            $databtn.show();
        } else {

        }
        $("#internet-name").text(_network);
        $("#internet-img").attr("src", _internet);

    }

    function getNetworkStatus(){
        getAjaxJsonData("/action/GetInternetMode", function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                g_curInternetMode = obj.mode;
            }
        }, {
            async: false
        });
        getAjaxJsonData("/action/GetSimInfo", function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                g_curSimStatus = obj.status;
            }
        }, {
            async: false
        });
        if (g_curSimStatus !== g_simStatusNo){
            getAjaxJsonData("/action/GetWirelessNetworkInfo", function(obj){
                if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                    g_operatorName = obj.operatorName;
                    g_sigLevel = obj.sigLevel;
                }
            }, {
                async: false
            });
            getAjaxJsonData("/action/GetMobileDataStatus", function(obj){
                if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                    g_mobileDataStatus = obj.status;
                }
            }, {
                async: false
            });
        }
    }
    function saveMobileDataStatus(){
        var postdata, $databtn, obj = {};

        $databtn = $("#data-btn");
        if ($databtn.hasClass("data-on")){
            $("#data-status").children("span").text(str_home_disconnecting);
            g_mobileDataStatus = g_mobileDataOff;
        } else if ($databtn.hasClass("data-off")){
            $("#data-status").children("span").text(str_home_connecting);
            g_mobileDataStatus = g_mobileDataOn;
        } else {
            return;
        }
        startLogoutTimer();
        obj.status = g_mobileDataStatus;
        postdata = JSON.stringify(obj);
        saveAjaxJsonData("/action/SetMobileDataStatus", postdata, function(data){
            var _obj = data;
            if (typeof _obj.retcode === "number" && _obj.retcode === g_resultSuccess) {
                if (g_mobileDataStatus === g_mobileDataOn){
                    $databtn.removeClass("data-off").addClass("data-on");
                    /*g_dialupStatusTimer = Timer(updateDialupStatus, 3000, "dialupStatus");
                    g_dialupStatusTimer.start();
                    g_allTimer.push(g_dialupStatusTimer);*/
                } else {
                    //g_dialupStatusTimer.stop();
                    $databtn.removeClass("data-on").addClass("data-off");
                    $("#data-status").children("span").text(str_home_disconnect);
                }
            }
        }, {
            async: true
        });
    }

    function updateDialupStatus(){
        getAjaxJsonData("/action/GetDialStatus", function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                if (obj.status === g_dialupConing){
                    $("#data-status").children("span").text(str_home_connecting);
                } else if (obj.status === g_dialupConed) {
                    $("#data-status").children("span").text(str_home_connect);
                }else if (obj.status === g_dialupDisconing) {
                    $("#data-status").children("span").text(str_home_disconnecting);
                }else if (obj.status === g_dialupDisconed) {
                    $("#data-status").children("span").text(str_home_disconnect);
                } else {
                    $("#data-status").children("span").text(str_home_disconnect);
                }
            }
        }, {
            async: true
        });
    }
    function updateWifiStationStatus(){
        getAjaxJsonData("/action/WifiStationConnectedInfo", function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                if (obj.status === g_wifiStationConing){
                    $("#data-status").children("span").text(str_home_connecting);
                } else if (obj.status === g_wifiStationConed) {
                    $("#data-status").children("span").text(str_home_connect);
                } else if (obj.status === g_wifiStationDiscon) {
                    $("#data-status").children("span").text(str_home_disconnect);
                } else {
                    $("#data-status").children("span").text(str_home_disconnect);
                }
            }
        }, {
            async: true
        });
    }
})();