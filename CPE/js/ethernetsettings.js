(function(){
    var g_ethernetModeDynamic = 1;
    var g_ethernetModeStatic = -1;
    var g_ethernetModePPPoE = 2;
    var g_ethernetInfo = [
        {
            mode: g_ethernetModeDynamic,
            id: "dynamic",
            name: str_ethernet_dynamic,
            tip: str_ethernet_dynamic_tips
        },/*
        {
            mode: g_ethernetModeStatic,
            id: "static",
            name: str_ethernet_static,
            tip: str_ethernet_static_tips
        },*/
        {
            mode: g_ethernetModePPPoE,
            id: "pppoe",
            name: str_ethernet_pppoe,
            tip: str_ethernet_pppoe_tips
        }
    ];
    var g_curEthernetInfo = {
        mode: ""
    };

    getEthernetSettingInfo();
    $(document).ready(function(){
        var $tips, $mode, _html = "";

        $tips = $("#ethernettips");
        $mode = $("#ethnernetmode");
        $.each(g_ethernetInfo, function(){
            _html += '<option value=\"' + this.mode + '\">' + this.name + '</option>';
        });
        $mode.html(_html).on("change", function(){
            var $this = $(this);
            $.each(g_ethernetInfo, function(){
                var val = parseInt($this.val());
                if (val === this.mode) {
                    $tips.text(this.tip);
                    $("#" + this.id).show();
                } else {
                    $("#" + this.id).hide();
                }
            });
        });
        if (g_curEthernetInfo.mode === g_ethernetModeDynamic) {
            $tips.text(str_ethernet_dynamic_tips);
            $mode.val(g_curEthernetInfo.mode);
        } else if (g_curEthernetInfo.mode === g_ethernetModeStatic) {
            $tips.text(str_ethernet_static_tips);
            showStaticInfo(g_curEthernetInfo);
        } else if (g_curEthernetInfo.mode === g_ethernetModePPPoE) {
            $tips.text(str_ethernet_pppoe_tips);
            showPPPoEInfo(g_curEthernetInfo);
        }
        $("#ipaddr").on("blur", function(){
            var ip, ret;
            ip = $(this).val();
            ret = checkIPAddr(ip);
            if (ret === false) {
                $("#ipaddrtips").text(str_ethernet_invalid_ipaddr);
            } else {
                $("#ipaddrtips").text("");
            }
        });
        $("#netmask").on("blur", function(){
            var ip, ret;
            ip = $(this).val();
            ret = checkNetmask(ip);
            if (ret === false) {
                $("#netmasktips").text(str_ethernet_invalid_netmask);
            } else {
                $("#netmasktips").text("");
            }
        });
        $("#gateway").on("blur", function(){
            var ip, ret;
            ip = $(this).val();
            ret = checkIPAddr(ip);
            if (ret === false) {
                $("#gatewaytips").text(str_ethernet_invalid_gateway);
            } else {
                $("#gatewaytips").text("");
            }
        });
        $("#dns1").on("blur", function(){
            var ip, ret;
            ip = $(this).val();
            ret = checkIPAddr(ip);
            if (ret === false) {
                $("#dns1tips").text(str_ethernet_invalid_dns1);
            } else {
                $("#dns1tips").text("");
            }
        });
        $("#dns2").on("blur", function(){
            var ip, ret;
            ip = $(this).val();
            if (ip.length === 0) {
                return;
            }
            ret = checkIPAddr(ip);
            if (ret === false) {
                $("#dns2tips").addClass("error-tips").text(str_ethernet_invalid_dns2);
            } else {
                $("#dns2tips").removeClass("error-tips").text(str_enternet_2nddns_optional);
            }
        });
        $("#apply").attr("value", common_apply).on("click", saveEthernetSettingInfo);
    });
    function getEthernetSettingInfo(){
        getAjaxJsonData("/action/GetWanCfgInfo", function(obj){

            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                g_curEthernetInfo.status = obj.status;
                if (obj.mode === g_ethernetModeDynamic) {
                    g_curEthernetInfo.mode = obj.mode;
                } else if (obj.mode === g_ethernetModeStatic) {
                    g_curEthernetInfo.mode = obj.mode;
                    g_curEthernetInfo.ipaddr = obj.ipaddr;
                    g_curEthernetInfo.netmask = obj.netmask;
                    g_curEthernetInfo.gateway = obj.gateway;
                    g_curEthernetInfo.dns1 = obj.dns1;
                    g_curEthernetInfo.dns2 = obj.dns2;
                } else if (obj.mode === g_ethernetModePPPoE) {
                    g_curEthernetInfo.mode = obj.mode;
                    g_curEthernetInfo.username = obj.username;
                    g_curEthernetInfo.password = obj.password;
                }
            }
        }, {
            async: false,
            timeout: 1000
        });
    }
    function saveEthernetSettingInfo(){
        var ret, mode, postdata, obj = {};

        
        mode = parseInt($("#ethnernetmode").val());
        if (mode === g_ethernetModeDynamic) {
            obj.mode = mode;
        } else if (mode === g_ethernetModeStatic) {
            ret = checkEthernetData();
            if (ret === true){
                obj.mode = mode;
                obj.ipaddr = $("#ipaddr").val();
                obj.netmask = $("#netmask").val();
                obj.gateway = $("#gateway").val();
                obj.dns1 = $("#dns1").val();
                obj.dns2 = $("#dns2").val();
            } else {
                showResultDialog(common_failed, common_failed, 3000);
                return;
            }
        } else if (mode === g_ethernetModePPPoE) {
            obj.mode = mode;
            obj.username = $("#pppoeusername").val();
            obj.password = $("#pppoepsd").val();
        } else {
            return;
        }
	stopLogoutTimer();
        postdata = JSON.stringify(obj);
        saveAjaxJsonData("/action/SetWanCfgInfo", postdata, function(data){
            var _obj = data;
            if (typeof _obj.retcode === "number" && _obj.retcode === g_resultSuccess) {
                showResultDialog(common_success, common_success, 3000);
            } else {
                startLogoutTimer();
                showResultDialog(common_failed, common_failed);
            }
        }, {
        });
    }
    function showStaticInfo(obj){
        $("#ethnernetmode").val(obj.mode);
        $("#ipaddr").attr("value", obj.ipaddr);
        $("#netmask").attr("value", obj.netmask);
        $("#gateway").attr("value", obj.gateway);
        $("#dns1").attr("value", obj.dns1);
        $("#dns2").attr("value", obj.dns2);
        $.each(g_ethernetInfo, function(){
            if (obj.mode === this.mode) {
                $("#" + this.id).show();
            } else {
                $("#" + this.id).hide();
            }
        });
    }
    function showPPPoEInfo(obj){
        $("#ethnernetmode").val(obj.mode);
        $("#pppoeusername").attr("value", obj.username);
        $("#pppoepsd").attr("value", obj.password);
        $.each(g_ethernetInfo, function(){
            if (obj.mode === this.mode) {
                $("#" + this.id).show();
            } else {
                $("#" + this.id).hide();
            }
        });
    }
    function checkEthernetData(){
        var ret, ipaddr, netmask, gateway, dns1, dns2;
        ipaddr = $("#ipaddr").val();
        ret = checkIPAddr(ipaddr);
        if (ret === false) {
            return false;
        }
        netmask = $("#netmask").val();
        ret = checkNetmask(netmask);
        if (ret === false) {
            return false;
        }
        gateway = $("#gateway").val();
        ret = checkIPAddr(gateway);
        if (ret === false) {
            return false;
        }
        dns1 = $("#dns1").val();
        ret = checkIPAddr(dns1);
        if (ret === false) {
            return false;
        }
        dns2 = $("#dns2").val();
        ret = checkIPAddr(dns1);
        if (ret === false) {
            return false;
        }
        ret = isBroadCast(ipaddr, netmask);
        if (ret === false) {
            return false;
        }
        ret = isBroadCast(gateway, netmask);
        if (ret === false) {
            return false;
        }
        return true;
    }
    function checkIPAddr(ip){
        var i, ipaddr;
        if (typeof ip !== "string") {
            return false;
        }
        ipaddr = ip.split(".");
        if (ipaddr.length !== 4) {
            return false;
        }
        for (i = 0; i < 4; i++) {
            if (ipaddr[i].length === 0){
                return false
            }
            if (isNaN(ipaddr[i])) {
                return false;
            }
            if (ipaddr[i].indexOf("0") === 0 && ipaddr[i].length !== 1){
                return false;
            }
            if (ipaddr.indexOf(" ") !== -1){
                return false;
            }
        }
        if ((ipaddr[0] <= 0 || ipaddr[0] === 127 || ipaddr[0] >= 223) ||
            (ipaddr[1] < 0 || ipaddr[1] > 255) ||
            (ipaddr[2] < 0 || ipaddr[2] > 255) ||
            (ipaddr[3] < 0 || ipaddr[3] > 255))
        {
            return false;
        }
        return true;
    }
    function checkNetmask(ip) {
        var i, mask;
        mask = ip.split(".");
        if (mask.length !== 4) {
            return false;
        }
        if (ip === "0.0.0.0") {
            return false;
        }
        if (ip === "255.255.255.255") {
            return false;
        }
        for (i = 0; i < 4; i++) {
            if (mask[i].length === 0){
                return false
            }
            if (isNaN(mask[i])) {
                return false;
            }
            if (mask[i].indexOf("0") === 0 && mask[i].length !== 1){
                return false;
            }
            if (mask.indexOf(" ") !== -1){
                return false;
            }
        }
        mask = ip2Number(ip);
        mask = ~mask + 1;
        if ((mask&(mask-1)) !== 0){
            return false;
        }
        return true;
    }
    function isBroadCast(ipaddr, netmask){
        var ip, mask;
        ip = ip2Number(ipaddr);
        mask = ip2Number(netmask);
        if (((ip&(~mask))===(~mask)) || ((ip&(~mask))===0)){
            return true;
        } else {
            return false;
        }
    }
    function ip2Number(ip){
        var num;
        var ipaddr = ip.split(".");
        num = ipaddr[0]<<24 | ipaddr[1]<<16 | ipaddr[2]<<8 | ipaddr[3];
        return num>>>0;
    }
})();