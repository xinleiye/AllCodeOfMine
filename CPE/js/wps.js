(function(){
    var g_wpsEnable = 1;
    var g_wpsDisable = 0;

    var g_wpsStatus = g_wpsDisable;

    getWPSStatus();
    $(document).ready(function(){
        var $on, $off;

        $on = $("#wpson");
        $off = $("#wpsoff");
        $on.attr("value", g_wpsEnable);
        $off.attr("value", g_wpsDisable);
        if (g_wpsStatus === g_wpsEnable){
            $on.attr("checked", "checked");
            $("#apply").on("click", saveWPSStatus);
        } else {
            $off.attr("checked", "checked");
            $("#apply").on("click", saveWPSStatus);
        }
        $("#resetpin").attr("value", str_wlan_wps_generatepin);
        $("#newpin").attr("value", str_wlan_wps_resetpin).on("click", function(){
            $("#pincode").text("09314603");
            $("#pincode").fadeIn(3000);
            console.log("sdfsd");
        });
        $("#connect").attr("value", str_wlan_wps_deviceconnect);
        $("#apply").attr("value", common_apply);
    });
    function getWPSStatus(){
        getAjaxJsonData("/action/getWPSStatus", function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                g_wpsStatus = obj.status;
            }
        }, {
            async: false
        });
    }
    function saveWPSStatus(){
        var postdata, data = {};

        data.status = parseInt($("#wpsstatus input:radio[name='wpsstatus']:checked").val());
        console.log($("#wpsstatus input:radio[name='wpsstatus']:checked").val());
        /*saveAjaxJsonData("/action/setWPSStatus", postdata, function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                showResultDialog(common_result, common_success, 3000);
            } else {
                showResultDialog(common_result, common_failed, 3000);
            }
        }, {

        });*/
    }
})();