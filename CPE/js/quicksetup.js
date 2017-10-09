(function(){
    var g_ethernetModeDynamic = 0;
    var g_ethernetModeStatic = 1;
    var g_ethernetModePPPoE = 2;
    var g_SSIDSecurityOpen = 0;
    var g_quickSetupPageIndex = [
        {
            id: "qsprofile",
            title: str_quicksetup_profile_title,
            init: initQSProfileContent
        },
        {
            id: "qsethernet",
            title: str_quicksetup_ethernet_title,
            init: initQSEthernetContent
        },
        {
            id: "qswlan",
            title: str_quicksetup_wlan_title,
            init: initQSWlanContent
        }
    ];
    var g_ethernetMode = [
        {
            id: "dynamic",
            mode: g_ethernetModeDynamic,
            name: str_ethernet_dynamic,
            tips: str_ethernet_dynamic_tips,
            init: getQuickSetupInfo
        },
        {
            id: "static",
            mode: g_ethernetModeStatic,
            name: str_ethernet_static,
            tips: str_ethernet_static_tips,
            init: initEthernetStaticInfo
        },
        {
            id: "pppoe",
            mode: g_ethernetModePPPoE,
            name: str_ethernet_pppoe,
            tips: str_ethernet_pppoe_tips,
            init: initEthernetPPPoEInfo
        }
    ];
    var g_profileList;
    var g_defaultProfileID;
    var g_ethernetStaticIP;
    var g_curPageIndex = 0;
    var g_curEthernetInfo = {
        mode: "",
        ipaddr: "",
        netmask: "",
        gateway: "",
        dns1: "",
        dns2: "",
        username: "",
        password: ""
    };
    var g_curWlanInfo = {
        ssid: "",
        securitymode: "",
        securitykey: ""
    };
    getQuickSetupInfo();
    $(document).ready(function(){
        var _selector, _step, _index;
        var i, len, init;
        for (i = 0, len = g_quickSetupPageIndex.length; i < len; i++) {
            _selector = "#" + g_quickSetupPageIndex[i].id + "-title";
            $(_selector).children("h1").text(g_quickSetupPageIndex[i].title);
            _index = i + 1;
            _step = str_quicksetup_step + " " + _index + " / " + len;
            $(_selector).children("span").text(_step);
            init = g_quickSetupPageIndex[i].init;
            if (typeof init === "function") {
                init();
            }
        }
        g_curPageIndex = 0;
    });
    function getQuickSetupInfo(){
        getAjaxJsonData("/action/GetProfile", function(obj){

            if (typeof obj.retcode === "number" &&obj.retcode === g_resultSuccess){
                g_profileList = obj.profileList;
                g_defaultProfileID = obj.curid;
            } else {
            }
        }, {
            async: false,
            timeout: 1000
        });
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
        getAjaxJsonData("/action/WifiGetBasic", function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                g_curWlanInfo.ssid = obj.ssid;
                g_curWlanInfo.securitymode = obj.securitymode;
                if (g_curWlanInfo.securitymode !== g_SSIDSecurityOpen){
                    g_curWlanInfo.securitykey = obj.securitykey;
                }
            }
        }, {
            async: false,
            timeout: 1000
        });
    }
    function showProfileInfo(index){
        var i, len, profile;
        for(i = 0, len = g_profileList.length; i < len; i++){
            if ( index === g_profileList[i].index) {
                profile = g_profileList[i];
                break;
            }
        }
        $("#profile-username").attr("value", profile.username);
        $("#profile-password").attr("value", profile.password);
        $("#profile-apn").attr("value", profile.apn);
    }
    function initQSProfileContent() {
        var i, len;
        var option = "<option value=\"%d\">%s</option>";
        var html = "";

        $("#newprofile").attr("value", str_dialup_newprofile).on("click", function(){
            showNewProfileDialog(saveNewProfile);
        });
        $("#nextstep1").attr("value", common_next).on("click", switchToNextPage);
        for(i = 0, len = g_profileList.length; i < len; i++){
            if (g_profileList[i].index === g_defaultProfileID) {
                html += option;
                html = html.replace("%d", g_profileList[i].index);
                html = html.replace("%s", g_profileList[i].profilename + " (" + common_default + ")");
                break;
            }
        }
        for(i = 0, len = g_profileList.length; i < len; i++){
            if (g_profileList[i].index !== g_defaultProfileID) {
                html += option;
                html = html.replace("%d", g_profileList[i].index);
                html = html.replace("%s", g_profileList[i].profilename);
            }
        }
        $("#profilelist").html(html).on("change", function(){
            var index = $(this).val();
            showProfileInfo(index);
        });
        showProfileInfo(g_defaultProfileID);
    }

    function saveNewProfile(){
        var name, $newname, data, postdata, obj = {};

        $newname = $("#new-profilename");
        name = $newname.val();
        for(var i = 0, len = g_profileList.length; i < len; i++) {
            if (name === g_profileList[i].profilename) {
                $newname.focus();
                $("#tipstring").text(str_dialup_nametips);
                $("#nametips").show();
                return;
            }
        }

        data = $("#newprofileinfo").serializeArray();
        $.each(data, function(index, val){
            obj[val.name] = val.value;
        });
        startLogoutTimer();
        postdata = JSON.stringify(obj);
        saveAjaxData("/action/AddProfile", postdata, function(data){
            var _obj = data2Object(data);
            if (_obj.retcode && _obj.retcode === "0"){
                closeDialog();
                window.location.reload();
            } else {
                closeDialog();
            }
        }, {
            type: "POST",
            dataType: "json",
            contentType : 'application/json'
        });
    }

    function initQSEthernetContent() {
        var $mode, $tips, _html = "";

        $mode = $("#ethnernetmode");
        $.each(g_ethernetMode, function(){
            _html += '<option value=\"' + this.mode + '\">' + this.name + '</option>';
        });
        $mode.html(_html);
        $mode.on("change", function(){
            var $tips, $this = $(this);
            $tips = $("#tips");
            $.each(g_ethernetMode, function(){
                if ($this.val() === this.mode) {
                    $tips.text(this.tips);
                    $("#" + this.id).show();
                } else {
                    $("#" + this.id).hide();
                }
            });
        });
        $tips = $("#tips");
        $.each(g_ethernetMode, function(){
            var init;
            init = this.init;
            if (typeof init === "function") {
                init();
            }
            if (g_curEthernetInfo.mode === this.mode) {
                $tips.text(this.tips);
                $mode.val(this.mode);
                $("#" + this.id).show();
            } else {
                $("#" + this.id).hide();
            }
        });
        $("#prestep2").attr("value", common_back).on("click", swichtToPrePage);
        $("#nextstep2").attr("value", common_next).on("click", switchToNextPage);
    }
    function initEthernetStaticInfo(){
        var $ipaddr, $netmask, $gateway, $dns1, $dns2;

        $ipaddr = $("#ipaddr");
        if (g_curEthernetInfo.ipaddr.length > 0) {
            $ipaddr.attr("value", g_curEthernetInfo.ipaddr);
        } else {
            $ipaddr.attr("value", common_null);
        }
        $ipaddr.on("blur", function(){
            var ip, ret;
            ip = $(this).val();
            ret = checkIPAddr(ip);
            if (ret === false) {
                $("#ipaddrtips").text(str_ethernet_invalid_ipaddr);
            } else {
                $("#ipaddrtips").text("");
            }
        });

        $netmask = $("#netmask");
        if (g_curEthernetInfo.netmask.length > 0) {
            $netmask.attr("value", g_curEthernetInfo.netmask);
        } else {
            $netmask.attr("value", common_null);
        }
        $netmask.on("blur", function(){
            var ip, ret;
            ip = $(this).val();
            ret = checkNetmask(ip);
            if (ret === false) {
                $("#netmasktips").text(str_ethernet_invalid_netmask);
            } else {
                $("#netmasktips").text("");
            }
        });

        $gateway = $("#gateway");
        if (g_curEthernetInfo.gateway.length > 0) {
            $gateway.attr("value", g_curEthernetInfo.gateway);
        } else {
            $gateway.attr("value", common_null);
        }
        $gateway.on("blur", function(){
            var ip, ret;
            ip = $(this).val();
            ret = checkIPAddr(ip);
            if (ret === false) {
                $("#gatewaytips").text(str_ethernet_invalid_gateway);
            } else {
                $("#gatewaytips").text("");
            }
        });

        $dns1 = $("#dns1");
        if (g_curEthernetInfo.dns1.length > 0) {
            $dns1.attr("value", g_curEthernetInfo.dns1);
        } else {
            $dns1.attr("value", common_null);
        }
        $dns1.on("blur", function(){
            var ip, ret;
            ip = $(this).val();
            ret = checkIPAddr(ip);
            if (ret === false) {
                $("#dns1tips").text(str_ethernet_invalid_dns1);
            } else {
                $("#dns1tips").text("");
            }
        });

        $dns2 = $("#dns2");
        if (g_curEthernetInfo.dns2.length > 0) {
            $dns2.attr("value", g_curEthernetInfo.dns2);
        } else {
            $dns2.attr("value", common_null);
        }
        $dns2.on("blur", function(){
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
    }
    function initEthernetPPPoEInfo(){
        if (g_curEthernetInfo.username.length > 0) {
            $("#pppoe-username").attr("value", g_curEthernetInfo.username);
        } else {
            $("#pppoe-username").attr("value", "");
        }
        if (g_curEthernetInfo.password.length > 0) {
            $("#pppoe-psd").attr("value", g_curEthernetInfo.password);
        } else {
            $("#pppoe-psd").attr("value", "");
        }
    }
    function initQSWlanContent() {
        if (g_curWlanInfo.ssid.length > 0){
            $("#ssid").attr("value", g_curWlanInfo.ssid);
        } else {
            $("#ssid").attr("value", "");
        }
        if (g_curWlanInfo.securitykey.length > 0) {
            $("#wpakey").attr("value", g_curWlanInfo.securitykey);
        } else {
            $("#wpakey").attr("value", "");
        }
        if (g_curWlanInfo.securitymode === g_SSIDSecurityOpen){
            $("#keytype").hide();
        } else {
            $("#keytype").show();
        }

        $("#prestep3").attr("value", common_back).on("click", swichtToPrePage);
        $("#finish").attr("value", common_finish).on("click", postData);
    }
    function switchToNextPage() {
        $.each(g_quickSetupPageIndex, function(key, val){
            if (Number(key) === g_curPageIndex) {
                $("#" + val.id).hide();
                $("#" + g_quickSetupPageIndex[g_curPageIndex + 1].id).show();
            }
        });
        g_curPageIndex++;
        if (g_curPageIndex >= g_quickSetupPageIndex.length){
            g_curPageIndex = g_quickSetupPageIndex.length - 1;
        }
    }
    function swichtToPrePage() {
        $.each(g_quickSetupPageIndex, function(key, val){
            if (Number(key) === g_curPageIndex) {
                $("#" + val.id).hide();
                $("#" + g_quickSetupPageIndex[g_curPageIndex - 1].id).show();
            }
        });
        g_curPageIndex--;
        if (g_curPageIndex < 0){
            g_curPageIndex = 0;
        }
    }
    function postData() {
        alert("I'm finish");
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
        if (mask&(mask-1) !== 0){
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