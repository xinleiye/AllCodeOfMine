(function (){
    var g_deviceInfo = {
        deviceName: "",
        softwareVersion: "",
        hardwareVersion: "",
        lanMac: "",
        imei: "",
        meid: ""
    };
    getDeviceInfo();
    $(document).ready(function(){
        showDeviceInfo();
    });
    function getDeviceInfo(){
        getAjaxJsonData("/action/GetDeviceInfo", function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                g_deviceInfo.deviceName = obj.deviceName;
                g_deviceInfo.softwareVersion = obj.softwareVersion;
                g_deviceInfo.hardwareVersion = obj.hardwareVersion;
                g_deviceInfo.lanMac = obj.lanMac;
                g_deviceInfo.imei = obj.imei;
                g_deviceInfo.meid = obj.meid;
            }
        }, {
            async: false
        });
    }
    function showDeviceInfo(){
        if (g_deviceInfo.deviceName.length > 0) {
            $("#devicename").text(g_deviceInfo.deviceName);
        } else {
            $("#devicename").text(common_unknown);
        }
        if (g_deviceInfo.softwareVersion.length > 0) {
            $("#softver").text(g_deviceInfo.softwareVersion);
        } else {
            $("#softver").text(common_unknown);
        }
        if (g_deviceInfo.imei.length > 0) {
            $("#imei").text(g_deviceInfo.imei);
        } else {
            $("#imei").text(common_unknown);
        }
        if (g_curSimImsi) {
            $("#imsi").text(g_curSimImsi);
        } else {
            $("#imsi").text(common_unknown);
        }
        if (g_deviceInfo.hardwareVersion.length > 0) {
            $("#hardver").text(g_deviceInfo.hardwareVersion);
        } else {
            $("#hardver").text(common_unknown);
        }
        if (g_deviceInfo.lanMac.length > 0) {
            $("#lanmac").text(g_deviceInfo.lanMac);
        } else {
            $("#lanmac").text(common_unknown);
        }
        if (g_deviceInfo.meid.length > 0) {
            $("#meid").text(g_deviceInfo.meid);
        } else {
            $("#meid").text(common_unknown);
        }
    }
})();