(function(){
    var g_enable = 1;
    var g_disable = 0;
    var g_firewallStatus = 0;
    var g_wanPingStatus = 0;
    var g_ipFilterStatus = 0;
    var g_macFilterStatus = 0;
    getFirewallStatus();
    $(document).ready(function(){
        if (g_firewallStatus === g_enable) {
            $("#firewall").attr("checked", "checked");
        } else {

        }
        if (g_ipFilterStatus === g_enable) {
            $("#ipfilter").attr("checked", "checked");
        } else {

        }
        if (g_wanPingStatus === g_enable) {
            $("#wanping").attr("checked", "checked");
        } else {

        }
        if (g_macFilterStatus === g_enable) {
            $("#macfilter").attr("checked", "checked");
        } else {

        }
        $("#apply").attr("value", common_apply).on("click", saveFirewallStatus);
    });
    function saveFirewallStatus(){
        var data = {}, postdata;

        stopLogoutTimer();
        if($("#firewall").prop("checked")){
            data.firewallEnable = g_enable;
        } else {
            data.firewallEnable = g_disable;
        }
        if($("#ipfilter").prop("checked")){
            data.ipFilterEnable = g_enable;
        } else {
            data.ipFilterEnable = g_disable;
        }
        if($("#wanping").prop("checked")){
            data.wanPingEnable = g_enable;
        } else {
            data.wanPingEnable = g_disable;
        }
        if($("#macfilter").prop("checked")){
            data.macFilterEnable = g_enable;
        } else {
            data.macFilterEnable = g_disable;
        }

        postdata = JSON.stringify(data);
        saveAjaxJsonData("/action/SetFirewallCfg", postdata, function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                showResultDialog(common_result, common_success, 3000);
            } else {
                showResultDialog(common_result, common_failed, 3000);
            }
        }, {
            isasync: true
        });
    }
    function getFirewallStatus(){
        getAjaxJsonData("/action/GetFirewallCfg", function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                g_firewallStatus = obj.firewallEnable;
                g_wanPingStatus = obj.wanPingEnable;
                g_ipFilterStatus = obj.ipFilterEnable;
                g_macFilterStatus = obj.macFilterEnable;
            }
        }, {
            async: false
        });
    }
})();