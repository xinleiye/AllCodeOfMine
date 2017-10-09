(function(){
    var g_ethernetModeDynamic = 1;
    var g_ethernetModeStatic = -1;
    var g_ethernetModePPPoE = 2;
    var g_wanConnect = 1;
    var g_wanDisconnect = 0
    var g_wanStatusInfo = {
        mode: "",
        status: "",
        duration: "",
        ipaddr: "",
        netmask: "",
        gateway: "",
        dns1: "",
        dns2: "",
        macaddr: ""
    };
    getWanStatusInfo();
    $(document).ready(function(){
        if (g_wanStatusInfo.mode === g_ethernetModeDynamic) {
            $("#connectmode").text(str_ethernet_dynamic);
        } else if (g_wanStatusInfo.mode === g_ethernetModeStatic) {
            $("#connectmode").text(str_ethernet_static);
        } else if (g_wanStatusInfo.mode === g_ethernetModePPPoE) {
            $("#connectmode").text(str_ethernet_pppoe);
        } else {
            $("#connectmode").text(common_unknown);
        }

        if (g_wanStatusInfo.status === g_wanConnect) {
            $("#connectstatus").text(str_ethernet_status_conned);
        } else if (g_wanStatusInfo.status === g_wanDisconnect) {
            $("#connectstatus").text(str_ethernet_status_disconned);
        } else {
            $("#connectstatus").text(common_unknown);
        }

        if (g_wanStatusInfo.ipaddr.length > 0){
            $("#ipaddr").text(g_wanStatusInfo.ipaddr);
        } else {
            $("#ipaddr").text(common_unknown);
        }

        if (g_wanStatusInfo.netmask.length > 0) {
            $("#netmask").text(g_wanStatusInfo.netmask);
        } else {
            $("#netmask").text(common_unknown);
        }

        if (g_wanStatusInfo.gateway.length > 0) {
            $("#gateway").text(g_wanStatusInfo.gateway);
        } else {
            $("#netmask").text(common_unknown);
        }

        if (g_wanStatusInfo.dns1.length > 0) {
            $("#dns1").text(g_wanStatusInfo.dns1);
        } else {
            $("#dns1").text(common_unknown);
        }

        if (g_wanStatusInfo.dns2.length > 0) {
            $("#dns2").text(g_wanStatusInfo.dns2);
        } else {
            $("#dns2").text(common_unknown);
        }
    });
    function getWanStatusInfo(){
        getAjaxJsonData("/action/GetWanStatusInfo", function(obj){

            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                g_wanStatusInfo.status = obj.status;
                g_wanStatusInfo.mode = obj.mode;
                g_wanStatusInfo.ipaddr = obj.ipaddr;
                g_wanStatusInfo.netmask = obj.netmask;
                g_wanStatusInfo.gateway = obj.gateway;
                g_wanStatusInfo.dns1 = obj.dns1;
                g_wanStatusInfo.dns2 = obj.dns2;
            }
        }, {
            async: false,
            timeout: 1000
        });
    }
})();