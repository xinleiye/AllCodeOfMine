(function(){
    var g_wifiModeAP = 1;
    var g_wifiModeAPStation = 2;
    var g_wifiStatusConnected = 5;
    var g_wifiStrengthLevel0 = 20;
    var g_wifiStrengthLevel1 = 25;
    var g_wifiStrengthLevel2 = 35;
    var g_wifiStrengthLevel3 = 45;
    var g_wifiStrengthLevel4 = 55;
    var g_wifiMode = [
        {
            mode: g_wifiModeAP,
            name: str_wlan_wifistation_ap
        },
        {
            mode: g_wifiModeAPStation,
            name: str_wlan_wifistation_applus
        }
    ];
    var g_wifiAuthMode = {
        0: str_wlan_basicsettings_securityopen,
        2: str_wlan_basicsettings_securitywpa,
        3: str_wlan_basicsettings_securitywpa2,
        4: str_wlan_basicsettings_securitywpa12
    };
    var g_wifiStatus = {
        0: common_none,
        1: common_none,
        2: str_wlan_wifiStation_coned,
        3: str_wlan_wifiStation_coning,
        4: str_wlan_wifistation_discon,
        5: str_wlan_wifiStation_coned
    };
    var g_wifiStatusConed = 5;
    var g_wifiStatusConing = 3;
    var g_wifiStatusDiscon = 4;

    var g_wifiAuthModeOpen = 0;

    var g_wifiListStyle = [
        '<div id="wifistationlist">',
        '<table cellspacing="1" cellpadding="0">',
        '<tbody id="wifistationlistbody">',
        '<tr>',
        '<th id="ssid">%ssid</th>',
        '<th id="authmode">%authmode</th>',
        '<th id="psd">%psd</th>',
        '<th id="rssi">%rssi</th>',
        '<th id="connect">%connect</th>',
        '</tr>',
        '<tr id="ssidlist1" class="oddtr">',
        '<td id="ssid1"></td>',
        '<td id="authmode1"></td>',
        '<td><input id="psd1" type="password" name="psk" class="psdbox"/></td>',
        '<td id="rssi1"><img src="../images/wifi_small_0.png"/></td>',
        '<td><input id="connect1" type="button" value="" class="connect-btn"/></td>',
        '</tr>',
        '</tbody>',
        '</table>',
        '</div>'].join("");

    var g_curWifiMode;
    //var g_curWifiStatus;
    var g_curWifiSSID = {
        ssid: "",
        status: "",
        authmode: "",
        rssi: ""
    };
    var g_wifiList = [];
    var g_wifiStationConnectedTimer;
    getWifiStatus();
    $(document).ready(function(){
        var option = "<option value=\"%d\">%s</option>";
        var _html = "";
        $.each(g_wifiMode, function(){
            _html += option;
            _html = _html.replace("%d", this.mode);
            _html = _html.replace("%s", this.name);
        });
        $("#wifimode").html(_html).val(g_curWifiMode).on("change", function(){
            var _val = parseInt($(this).val());
            $("#apply").removeAttr("disabled");
            if (_val !== g_curWifiMode) {
                $("#apply").attr("value", common_apply).off("click", scanWifiStation).on("click", setWifiMode);
            } else {
                if (_val === g_wifiModeAPStation) {
                    $("#apply").attr("value", str_wlan_wifistation_scan).off("click", setWifiMode).on("click", scanWifiStation);
                }
            }
        });
        if (g_curWifiMode === g_wifiModeAPStation) {
            if (g_curWifiSSID.status === g_wifiStatusConnected) {
                initWifiStationConnectList();
                createWifiStationConnectedTimer();
            } else {
                $("#wifistationlist").remove();
            }
            $("#apply").attr("value", str_wlan_wifistation_scan).on("click", scanWifiStation);
        } else if (g_curWifiMode === g_wifiModeAP) {
            $("#apply").attr("value", common_apply).attr("disabled", "disabled");
        }
    });
    function getWifiStatus(){
        getWifiMode();
        getAjaxJsonData("/action/WifiStationConnectedInfo", function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                g_curWifiSSID.status = obj.status;
                g_curWifiSSID.ssid = obj.ssid;
                g_curWifiSSID.authmode = obj.authmode;
            }
        }, {
            async: false
        });
    }
    function getWifiMode(){
        getAjaxJsonData("/action/WifiGetMode", function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                g_curWifiMode = obj.mode;
            }
        }, {
            async: false
        });
    }
    function setWifiMode(){
        var data, obj = {}, postdata;

        stopLogoutTimer();
        data = $("#wifistatiion").serializeArray();
        $.each(data, function(key, val){
            obj[val.name] = val.value;
        });
        obj["wifimode"] = parseInt(obj["wifimode"]);
        postdata = JSON.stringify(obj);
        showWaitingDialog(common_waiting, common_waitingmsg);
        saveAjaxJsonData("/action/WifiSetMode", postdata, function(obj){
            closeDialog();
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                showResultDialog(common_success, common_success, 3000);
            } else {
                startLogoutTimer();
            }
        }, {
        });
    }
    function scanWifiStation(){
        stopAllTimer();
        stopLogoutTimer();
        showWaitingDialog(common_waiting, common_waitingmsg);
        getAjaxJsonData("/action/WifiStationScan", function(obj){
            var i, len, list, list1;
            closeDialog();
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                list = obj.wifiList;
                g_wifiList = [];
                if (g_curWifiSSID.ssid.length > 0) {
                    for (i = 0, len = list.length; i < len; i++){
                        if (list[i].ssid === g_curWifiSSID.ssid) {
                            g_wifiList.unshift(list[i]);
                        } else {
                            g_wifiList.push(list[i]);
                        }
                    }
                } else {
                    g_wifiList = list;
                }
                for(i = 0, len = g_wifiList.length; i < len; i++){
                    g_wifiList[i].rssi = getWifiSignalLevel(g_wifiList[i].rssi);
                }
                list1 = g_wifiListStyle.replace("%ssid", str_wlan_wifistation_ssid);
                list1 = list1.replace("%authmode", str_wlan_wifistation_security);
                list1 = list1.replace("%psd", str_wlan_wifistation_psd);
                list1 = list1.replace("%rssi", str_wlan_wifistation_strength);
                list1 = list1.replace("%connect", str_wlan_wifistation_op);
                $("#wifiscan").html(list1);
                updataWifiStationList(g_wifiList);
                startAllTimer();
                startLogoutTimer();
            }
        }, {
            timeout: 20000
        });
    }
    function updateWifiStationConnectList(){
        getAjaxJsonData("/action/WifiStationConnectedInfo", function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                g_curWifiSSID.status = obj.status;
                g_curWifiSSID.ssid = obj.ssid;
                g_curWifiSSID.authmode = obj.authmode;
                g_curWifiSSID.rssi = getWifiSignalLevel(obj.rssi);
                showWifiStationConnectList(g_curWifiSSID);
            }
        }, {
            async: true
        });
    }
    function initWifiStationConnectList(){
        var list, $psd1;
        $("#wifistationlist").remove();
        list = g_wifiListStyle.replace("%ssid", str_wlan_wifistation_ssid);
        list = list.replace("%authmode", str_wlan_wifistation_security);
        list = list.replace("%psd", str_wlan_wifiStation_status);
        list = list.replace("%rssi", str_wlan_wifistation_strength);
        list = list.replace("%connect", str_wlan_wifistation_op);
        $("#wifiscan").html(list);
        $("#psd").attr("id", str_wlan_wifiStation_status);
        $psd1 = $("#psd1");
        $psd1.parent().attr("id", str_wlan_wifiStation_status + "1");
        $psd1.remove();
    }
    function showWifiStationConnectList(obj){
        var status = obj.status;
        $("#ssid1").text(obj.ssid);
        $("#authmode1").text(g_wifiAuthMode[obj.authmode]);
        $("#" + str_wlan_wifiStation_status + "1").text(g_wifiStatus[status]);
        $("#rssi1").children("img").attr("src", "../images/wifi_small_" + obj.rssi + ".png");
        if (status === g_wifiStatusConed) {
            $("#connect1").removeAttr("disabled").attr("value", str_wlan_wifistation_discon).off("click", connection).on("click", disconnection);
            $("#psd1").attr("disabled", "disabled");
        } else if (status === g_wifiStatusConing) {
            $("#connect1").attr("disabled", "disabled").attr("value", str_wlan_wifiStation_coning);
        } else if (status === g_wifiStatusDiscon) {
            if (obj.authmode !== g_wifiAuthModeOpen){
                $("#psd1").removeAttr("disabled");
            }
            $("#connect1").attr("value", str_wlan_wifistation_con).removeAttr("disabled").off("click", disconnection).on("click", connection);

        } else {
            $("#connect1").attr("disabled", "disabled");
        }
        $("#ssidlist1").attr("class", "oddtr");
    }
    function createWifiStationConnectedTimer(){
        g_wifiStationConnectedTimer = Timer(updateWifiStationConnectList, 5000, "wifiStationConnectedTimer");
        g_wifiStationConnectedTimer.start();
        g_allTimer.push(g_wifiStationConnectedTimer);
    }
    function connection(ev){
        var index, _id = ev.target.id || event.target.id;
        var wifi, key, postdata;
        if (_id.indexOf("connect") === -1) {
            return;
        }
        index = _id.substr("connect".length);
        wifi = g_wifiList[Number(index) - 1];
        if (wifi.authmode === g_wifiAuthModeOpen) {
            wifi.psk = "";
        } else {
            key = $("#psd" + index).val();
            if (key.length > 32 || key.length < 8){
                $("#psd" + index).attr("title", str_wlan_wifistation_psdtips).addClass("error");
                setTimeout(function(){
                    $("#psd" + index).removeAttr("title").removeClass("error");
                }, 5000);
                return;
            }
            wifi.psk = key;
        }
        postdata = JSON.stringify(wifi);
        stopLogoutTimer();
        showWaitingDialog(common_waiting, str_wlan_wifistation_connecting);
        saveAjaxJsonData("/action/WifiStationConnect", postdata, function(obj){
            startLogoutTimer();
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                closeDialog();
                initWifiStationConnectList();
                createWifiStationConnectedTimer();
            } else {
                showResultDialog(common_failed, str_wlan_wifistation_confailed, 3000);
            }
        }, {
            async: true,
            timeout: 20000
        });
    }
    function disconnection(){
        getAjaxJsonData("/action/WifiStationDisconnect", function(obj){
            if (typeof obj.retcode === "number" && obj.retcode ===g_resultSuccess){
                window.location.reload();
            }
        }, {

        });
    }

    function updataWifiStationList(wifilist){
        var i, len, index;
        var wifiinfo, $list, $rssi, module;
        module = $("#ssidlist1").clone();
        $("#ssidlist1").remove();
        for(i = 0, len = wifilist.length; i < len; i++){
            index = i + 1;
            $list = module.clone();
            wifiinfo = wifilist[i];
            $list.find("#ssid1").attr("id", "ssid" + index).text(wifiinfo.ssid);
            $list.find("#authmode1").attr("id", "authmode" + index).text(g_wifiAuthMode[wifiinfo.authmode]);
            if (wifiinfo.authmode === g_wifiAuthModeOpen){
                $list.children().find("#psd1").attr("disabled", "disabled");
            } else {
                $("#psd1").removeAttr("disabled");
            }
            $list.children().find("#psd1").attr("id", "psd" + index);

            $rssi = $list.find("#rssi1");
            $rssi.children("img").attr("src", "../images/wifi_small_" + wifiinfo.rssi + ".png");
            $rssi.attr("id", "rssi" + index);

            $list.children().find("#connect1").attr("id", "connect" + index).attr("value", str_wlan_wifistation_con);
            if( index%2 === 0){
                $list.attr("class", "eventr");
            } else {
                $list.attr("class", "oddtr");
            }
            $list.attr("id", "ssidlist" + index);
            $list.appendTo("#wifistationlistbody");
        }
        $("#wifistationlist").on("click", function(ev){
            connection(ev)
        });
    }
    function getWifiSignalLevel(rssi) {
        var level = 0;
        if (rssi < g_wifiStrengthLevel0) {
            level = 0;
        } else if (rssi < g_wifiStrengthLevel1) {
            level = 1;
        } else if (rssi< g_wifiStrengthLevel2) {
            level = 2;
        } else if (rssi < g_wifiStrengthLevel3) {
            level = 3;
        } else if (rssi < g_wifiStrengthLevel4) {
            level = 4;
        } else {
            level = 4;
        }
        return level;
    }
})();

