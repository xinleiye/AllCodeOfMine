(function(){
    var g_systemReady = 2;
    var g_systemNormal = 0;
    var g_lanDhcpStatusOn = 1;
    var g_lanNetmask;
    var g_lanIpAddress;
    var g_lanDhcpStart;
    var g_lanDhcpEnd;
    var g_lanIpLeaseTime;
    var g_lanDhcpStatus;
    var g_systemStatus;
    getLanDhcpData();
    $(document).ready(function(){
        initLanDhcpInfo();
    });
    function getLanDhcpData(){
        getAjaxJsonData("/action/GetLanCfgInfo", function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                g_lanNetmask = obj.netmask;
                g_lanIpAddress = obj.ipaddr;
                g_lanDhcpStart = obj.startip;
                g_lanDhcpEnd = obj.endip;
                g_lanIpLeaseTime = obj.leasetime;
                g_lanDhcpStatus = obj.status;
            }
        }, {
            async: false,
            timeout: 1000
        });
    }
    function saveLanDhcpData(){
        var ret, ip, status, leasetime, dhcpstart, dhcpend, ip3, postdata = {};

        ip3 = $("#ipaddr1").text() + "." + $("#ipaddr2").text() + "." + $("#ipaddr3").val();
        ip = ip3 + "." + $("#ipaddr4").val();
        ret = isValidIP(ip);
        if (ret === false) {
            return;
        }
        postdata.ipaddr = ip;

        dhcpstart = ip3 + "." + $("#dhcpstart").val();
        ret = isValidIP(dhcpstart);
        if (ret === false) {
            return;
        }
        ret = isBroadCast(dhcpstart, g_lanNetmask);
        if (ret === true) {
            return;
        }
        postdata.startip = dhcpstart;

        dhcpend = ip3 + "." + $("#dhcpend").val();
        ret = isValidIP(dhcpend);
        if (ret === false) {
            return;
        }
        ret = isBroadCast(dhcpend, g_lanNetmask);
        if (ret === true) {
            return;
        }
        postdata.endip = dhcpend;

        leasetime = $("#leasetime").val();
        ret = checkLeaseTime(leasetime);
        if (ret === false) {
            return;
        }
        postdata.leasetime = parseInt(leasetime);
        status = parseInt($("input[name = \"dhcpturn\"]:checked").val());
        postdata.status = status;
        postdata.netmask = g_lanNetmask;
        postdata = JSON.stringify(postdata);
        stopLogoutTimer();
        stopAllTimer();
        saveAjaxJsonData("/action/SetLanCfgInfo", postdata, function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                if (status === g_lanDhcpStatusOn) {
                    showWaitingDialog(common_waiting, str_wlan_dhcp_successtips);
                    updateSystemStatus();
                } else {
                    showWaitingDialog(common_tip, str_wlan_dhcp_tips);
                }
            } else {
                showResultDialog(common_result, common_failed);
                startLogoutTimer();
                startAllTimer();
            }
        }, {

        });
    }
    function initLanDhcpInfo(){
        var dhcptips;
        var lanip = g_lanIpAddress.split(".");
        $("#ipaddr3").attr("value", lanip[2]);
        $("#ipaddr4").attr("value", lanip[3]);
        $("#ipaddr3, #ipaddr4").on("keyup", function(){
            var $this = $(this);
            checkIPPart($this);
        });

        var landhcpstart = g_lanDhcpStart.split(".");
        $("#dhcpstart").attr("value", landhcpstart[3]);

        var landhcpend = g_lanDhcpEnd.split(".");
        $("#dhcpend").attr("value", landhcpend[3]);

        dhcptips = str_wlan_dhcp_iprangetips.replace("%s", g_lanDhcpStart).replace("%e", g_lanDhcpEnd);
        $("#iprangetips").text(dhcptips);

        $("#leasetime").attr("value", g_lanIpLeaseTime).on("keyup", function(){
            var time = $(this).val();
            checkLeaseTime(time);
        });

        if (g_lanDhcpStatus === g_lanDhcpStatusOn) {
            $("#dhcpon").attr("checked", "checked");
        } else {
            $("#dhcpoff").attr("checked", "checked");
        }
        $("#dhcpstart, #dhcpend").on("keyup", function(){
            var $this = $(this);
            checkDhcpInput($this);
        });
        $("#apply").attr("value", common_apply).on("click", saveLanDhcpData);
    }
    function updateSystemStatus(){
        var gateway;

        gateway = $("#ipaddr1").text() + "." + $("#ipaddr2").text() + "." + $("#ipaddr3").val() + "." + $("#ipaddr4").val();
        if (g_systemStatus === g_systemReady || g_systemStatus === g_systemNormal) {
            window.location.replace("http://" + gateway);
        }
        getAjaxJsonData("http://" + gateway + "/action/GetSystemStatus", function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                g_systemStatus = obj.status;
            }
        }, {

        });
        setTimeout(updateSystemStatus, 2000);
    }
    function checkIPPart($this){
        var $tips, ipaddr;
        ipaddr = $this.val();
        $tips = $("#ipaddrtips");
        if ((isNaN(ipaddr) === true) ||
            (ipaddr.length <= 0) ||
            (ipaddr.indexOf(" ") !== -1))
        {
            $tips.addClass("error-tips").text(str_wlan_dhcp_iprangetip2);
            $("#iptips").show();
            return;
        }
        if (ipaddr < 0 || ipaddr >255) {
            $tips.addClass("error-tips").text(str_wlan_dhcp_iprangetip2);
            $("#iptips").show();
            return;
        }
        $tips.removeClass("error-tips");
        $("#iptips").hide();
    }
    function checkDhcpInput($this){
        var ret, ip, ipaddr, start, end, $tips, tipstr;

        $tips = $("#iprangetips");
        ipaddr = $this.val();
        if (isNaN(ipaddr) === true) {
            $tips.addClass("error-tips").text(str_wlan_dhcp_iprangetip2);
            return false;
        }

        start = Number($("#dhcpstart").val());
        end = Number($("#dhcpend").val());
        if ((start >= end) || (start > 255 || start < 0) || (end > 255 || end < 0)) {
            $tips.addClass("error-tips").text(str_wlan_dhcp_iprangetip2);
            return false;
        }

        ip = $("#ipaddr1").text() + "." + $("#ipaddr2").text() + "." + $("#ipaddr3").val();
        start = ip + "." + start;
        end = ip + "." + end;
        ret = isBroadCast(start, g_lanNetmask);
        if (ret) {
            $tips.addClass("error-tips").text(str_wlan_dhcp_iprangetip2);
            return false;
        }
        ret = isBroadCast(end, g_lanNetmask);
        if (ret){
            $tips.addClass("error-tips").text(str_wlan_dhcp_iprangetip2);
            return false;
        }
        tipstr = str_wlan_dhcp_iprangetips.replace("%s", start).replace("%e", end);
        $tips.removeClass("error-tips").text(tipstr);
        return true;
    }
    function checkLeaseTime(time){
        var $tips;

        $tips = $("#leasetimetips");
        if ((isNaN(time) === true) ||
            (time.length === 0) ||
            (time.indexOf(" ") !== -1))
        {
            $tips.text(str_wlan_dhcp_leasetimetips);
            return false;
        }
        if (time > 604800 || time < 120) {
            $tips.text(str_wlan_dhcp_leasetimetips);
            return false;
        }
        $tips.text("");
        return true;
    }
    function isValidIP(ip) {
        var ipArr, i, len;
        ipArr = ip.split(".");
        len = ipArr.length;
        if (len !== 4){
            return false;
        }
        for(i = 0; i < len; i++) {
            if (isNaN(ipArr[i]) === true) {
                return false;
            }
            if (ipArr[i].length === 0) {
                return false;
            }
            if (ipArr[i].indexOf(" ") !== -1) {
                return false;
            }
        }
        if ((ipArr[0] <= 0 || ipArr[0] == 127 || ipArr[0] >= 223) ||
            (ipArr[1] < 0 || ipArr[1] > 255) ||
            (ipArr[2] < 0 || ipArr[2] > 255) ||
            (ipArr[3] < 0 || ipArr[3] > 255))
        {
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
