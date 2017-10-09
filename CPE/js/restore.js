(function(){
    var g_defaultGateway = "http://192.168.1.1";
    var g_systemReady = 2;
    var g_systemStatus = 1;
    $(document).ready(function(){
        $("#apply").attr("value", str_system_restore).on("click", function(){
            showConfirmDialog(common_confirm, str_system_restore_tips1, restore);
        });
    });
    function restore(){
        closeDialog();
        stopLogoutTimer();
        getAjaxJsonData("/action/reset", function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                showWaitingDialog(common_waiting, str_system_restore_tips2);
                stopAllTimer();
                setTimeout(updateSystemStatus, 2000);
            } else {
                showResultDialog(common_result, common_failed);
                startLogoutTimer();
            }
        }, {

        });
    }
    function updateSystemStatus(){
        if (g_systemStatus === g_systemReady) {
            window.location.replace(g_defaultGateway);
        }
        getAjaxJsonData(g_defaultGateway + "/action/GetSystemStatus", function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                g_systemStatus = obj.status;
            }
        }, {

        });
        setTimeout(updateSystemStatus, 2000);
    }
})();
