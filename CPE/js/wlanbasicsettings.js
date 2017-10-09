(function(){
    var g_resultSuccess = 0;
    var g_resultFailed = 1;
    var g_SSIDStatusOn = 0;
    var g_SSIDStatusOff = 1;
    var g_waitingTime = 3000;
    var g_SSIDSecurity = {
        0: str_wlan_basicsettings_securityopen,
        //2: str_wlan_basicsettings_securitywpa,
        3: str_wlan_basicsettings_securitywpa2,
        4: str_wlan_basicsettings_securitywpa12
    };
    var g_SSIDSecurityOpen = 0;
    var g_SSIDSecurityWep = 1;
    var g_SSIDSecurityWpa = 2;
    var g_SSIDSecurityWpa2 = 3;
    var g_SSIDSecurityWpa12 = 4;
    var g_minSSIDLength = 1;
    var g_maxSSIDLength = 32;
    var g_minSSIDPaswordLength = 8;
    var g_maxSSIDPasswordLength = 64;
    var g_SSIDBroadcastOn = 1;
    var g_SSIDStatus = g_SSIDStatusOff;
    var g_SSIDName;
    var g_SSIDSecurityMode;
    var g_SSIDSecurityKey;
    var g_SSIDBroadcast;
    getWlanBasicInfo();
    $(document).ready(function(){
        initWlanBasicInfo();
    });
    function getWlanBasicInfo(){
        getAjaxJsonData("/action/WifiGetStatus", function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                g_SSIDStatus = obj.status;
            }
        },{
            async: false
        });
        getWifiBasicInfo();
    }
    function initWlanBasicInfo(){
        var options = "<option value=\"%d\">%s</option>";
        var html;
        html = "";
        if (g_SSIDStatus === g_SSIDStatusOn){
            $("#ssidon").attr("checked", "checked");
            $("#ssidname").attr("value", g_SSIDName);
            $.each(g_SSIDSecurity, function(key, val){
                html += options;
                html = html.replace("%d", key);
                html = html.replace("%s", val);
            });
            $("#securitymode").html(html).val(g_SSIDSecurityMode);
            if (g_SSIDSecurityMode !== g_SSIDSecurityOpen) {
                $("#securitymodetips").parent().hide();
                $("#securitykey").val(g_SSIDSecurityKey);
                $("#wpakey").show();
            } else {
                $("#wpakey").hide();
                $("#securitymodetips").text(str_wlan_basicsettings_opentips).parent().show();
            }
            if (g_SSIDBroadcast === g_SSIDBroadcastOn){
                $("#broadcaston").attr("checked", "checked");
            } else {
                $("#broadcastoff").attr("checked", "checked");
            }
            $("#showwpa").on("click", function(){
                if ($("#showwpa").prop("checked") === true) {
                    $("#securitykey").attr("type", "text");
                } else {
                    $("#securitykey").attr("type", "password");
                }
            });
            $("#ssidsetting").show();
        } else {
            $("#ssidoff").attr("checked", "checked");
            $("#ssidsetting").hide();
        }
        $("#apply").attr("value", common_apply).on("click", saveWlanBasicInfo);
        $("#cancel").attr("value", common_cancel);
        $("#securitymode").on("change", changeSecurityMode);
    }
    function saveWlanBasicInfo(){
        var ssidStatus;

        ssidStatus = getWifiStatus();
        if (ssidStatus.status !== g_SSIDStatus) {
            saveWifiStatus();
        } else {
            if (ssidStatus.status === g_SSIDStatusOn){
                saveWifiBasicInfo();
            }
        }
    }
    function getWifiStatus(){
        var data, obj = {};
        data = $("#ssidstatus").serializeArray();
        $.each(data, function(key, val){
            obj[val.name] = parseInt(val.value);
        });
        return obj;
    }
    function saveWifiStatus(){
        var postdata;
        stopLogoutTimer();
        postdata = getWifiStatus();
        postdata = JSON.stringify(postdata);
        showWaitingDialog(common_waiting, common_waitingmsg);
        saveAjaxJsonData("/action/WifiSetStatus", postdata, function(obj){
            closeDialog();
            startLogoutTimer();
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                showResultDialog(common_result, common_success, g_waitingTime);
            } else {
                showResultDialog(common_result, common_failed, g_waitingTime);
            }
        }, {
            async: true,
            timeout: 20000
        });
    }
    function clearErrorTips(){
        $("#ssidtip").hide();
        $("#ssidtipstring").text("");
        $("#wpatip").hide();
        $("#wpatipstring").text("");
    }
    function checkWifiSSID(ssid){
        var reg = /[,":;\\&%+'<>?]+/g;

        clearErrorTips();
        if (ssid[0] === " ") {
            $("#ssidname").focus();
            $("#ssidtipstring").text(str_wlan_basicsettings_ssidtips1);
            $("#ssidtip").show();
            return false;
        }
        if (ssid.match(reg)){
            $("#ssidname").focus();
            $("#ssidtipstring").text(str_wlan_basicsettings_ssidtips2);
            $("#ssidtip").show();
            return false;
        }
        if (ssid.length < g_minSSIDLength || ssid.length > g_maxSSIDLength) {
            $("#ssidname").focus();
            $("#ssidtipstring").text(str_wlan_basicsettings_ssidtips3.replace("%s", g_minSSIDLength).replace("%e", g_maxSSIDLength));
            $("#ssidtip").show();
            return false;
        }
        return true;
    }
    function checkWifiSSIDPassword(psd){
        var reg;

        clearErrorTips();
        reg = /[,":;\\&%+'<>?]+/g;
        if (psd[0] === " ") {
            $("#securitykey").focus();
            $("#wpatipstring").text(str_wlan_basicsettings_psdtips1);
            $("#wpatip").show();
            return false;
        }
        if (psd.match(reg)) {
            $("#securitykey").focus();
            $("#wpatipstring").text(str_wlan_basicsettings_psdtips2);
            $("#wpatip").show();
            return false;
        }
        if (psd.length < g_minSSIDPaswordLength || psd.length > g_maxSSIDPasswordLength) {
            $("#securitykey").focus();
            $("#wpatipstring").text(str_wlan_basicsettings_psdtips3.replace("%s", g_minSSIDPaswordLength).replace("%e", g_maxSSIDPasswordLength));
            $("#wpatip").show();
            return false;
        }
        return true;
    }
    function saveWifiBasicInfo(){
        var ret, data, obj = {}, postdata;

        data = $("#ssidsetting").serializeArray();
        $.each(data, function(key, val){
            obj[val.name] = val.value;
        });
        obj["broadcast"] = parseInt(obj["broadcast"]);
        ret = checkWifiSSID(obj.ssid);
        if (ret === false){
            return;
        }
        if (obj.securitymode === g_SSIDSecurityOpen) {
            postdata = JSON.stringify(obj);
        } else if ( obj.securitymode === g_SSIDSecurityWep) {
            data = $("#wepkey").serializeArray();
            $.each(data, function(key, val){
                obj[val.name] = val.value;
            });
            postdata = JSON.stringify(obj);
        } else {
            data = $("#wpakey").serializeArray();
            $.each(data, function(key, val){
                obj[val.name] = val.value;
            });
            ret = checkWifiSSIDPassword(obj.securitykey);
            if (ret === false) {
                return;
            }
            postdata = JSON.stringify(obj);
        }
        stopLogoutTimer();
        showWaitingDialog(common_waiting, common_waitingmsg);
        saveAjaxJsonData("/action/WifiSetBasic", postdata, function(data){
            var _obj = data;
            closeDialog();
            if (typeof _obj.retcode === "number" && _obj.retcode === g_resultSuccess){
                showResultDialog(common_result, common_success, g_waitingTime);
            } else {
                showResultDialog(common_result, common_failed, g_waitingTime);
            }
        }, {
            async: true,
            timeout: 20000
        });
    }
    function getWifiBasicInfo(){
        getAjaxJsonData("/action/WifiGetBasic", function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                g_SSIDName = obj.ssid;
                g_SSIDSecurityMode = obj.securitymode;
                g_SSIDBroadcast = obj.broadcast;
                if (g_SSIDSecurityMode !== g_SSIDSecurityOpen){
                    g_SSIDSecurityKey = obj.securitykey;
                }

            }
        }, {
            async: false
        });
    }
    function changeSecurityMode(){
        var val = parseInt($("#securitymode").val());
        if (val === g_SSIDSecurityOpen) {
            $("#securitymodetips").text(str_wlan_basicsettings_opentips).parent().show();
            $("#wpakey").hide();
            $("#wepkey").hide();
        } else if (val === g_SSIDSecurityWep) {
            $("#securitymodetips").text(str_wlan_basicsettings_weptips).parent().show();
            $("#wpakey").hide();
            $("#wepkey").show();
        } else if (val === g_SSIDSecurityWpa) {
            $("#securitymodetips").parent().hide();
            $("#wpakey").show();
            $("#wepkey").hide();
        } else if (val === g_SSIDSecurityWpa2) {
            $("#securitymodetips").parent().hide();
            $("#wpakey").show();
            $("#wepkey").hide();
        } else if (val === g_SSIDSecurityWpa12){
            $("#securitymodetips").parent().hide();
            $("#wpakey").show();
            $("#wepkey").hide();
        } else{
            return;
        }
    }
})();