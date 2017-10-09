(function(){
    var g_systemReady = 2;
    var g_systemStatus = 0;
    $(document).ready(function(){
        $("#apply").attr("value", str_system_reboot).on("click", function(){
            showConfirmDialog(common_confirm, str_system_reboot_tips1, reboot);
        });
    });
    function reboot(){
        closeDialog();
        getAjaxJsonData("/action/reboot", function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                showWaitingDialog(common_waiting, str_system_reboot_tips2);
                if (typeof g_networkStatusTimer !== "undefined"){
                    clearTimeout(g_networkStatusTimer);
                }
                if (typeof g_dialupStatusTimer !== "undefined"){
                    clearTimeout(g_dialupStatusTimer);
                }
                clearTimeout();
                setTimeout(updateSystemStatus, 2000);
            } else {
                showResultDialog(common_result, common_failed, 3000);
            }
        }, {
        });
    }
    function updateSystemStatus(){
        if (g_systemStatus === g_systemReady) {
            window.location.replace("home.html");
        }
        getAjaxJsonData("/action/GetSystemStatus", function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                g_systemStatus = obj.status;
            }
        }, {
        });
        setTimeout(updateSystemStatus, 2000);
    }
})();
