(function(){
    var g_dataStatusOn = 1;
    var g_dataStatusOff = 0;
    var g_dataStatusRoamingOn = 1;
    var g_dataStatusRoamingOff = 0;
    var g_dataStatus;
    var g_dataRoamingStatus;
    getDataStatus(false);
    getDataRoamingStatus(false);
    $(document).ready(function(){
        var $roamingon;

        if (g_dataStatus === g_dataStatusOn) {
            $("#dataon").attr("checked", "checked");
        } else if (g_dataStatus === g_dataStatusOff) {
            $("#dataoff").attr("checked", "checked");
        } else {
            $("#dataoff").attr("checked", "checked");
        }
        $("#dataapply").attr("value", common_apply).on("click", function(){
            var data, obj = {};
            data = $("#datasettings").serializeArray();
            $.each(data, function(key, val){
                obj[val.name] = val.value;
            });
            if (obj.datastatus !== g_dataStatus) {
                saveDataStatus(obj.datastatus);
            }
        });

        $roamingon = $("#roamingon");
        if (g_dataRoamingStatus === g_dataStatusRoamingOn) {
            $roamingon.attr("checked", "checked");
        } else if (g_dataRoamingStatus === g_dataStatusRoamingOff) {
            $("#roamingoff").attr("checked", "checked");
        } else {
            $("#roamingoff").attr("checked", "checked");
        }
        $roamingon.on("click", function(){
            showConfirmDialog(common_confirm, str_dialup_roamingtips, closeDialog);
        });
        $("#roamingapply").attr("value", common_apply).on("click", function(){
            var data;
            var obj = {};
            data = $("#roamingsettings").serializeArray();
            $.each(data, function(key, val){
                obj[val.name] = val.value;
            });
            if (obj.roamingstatus !== g_dataRoamingStatus){
                saveDataRoamingStatus(obj.roamingstatus);
            }
        });
    });

    function getDataStatus(isasync){
        getAjaxJsonData("/action/GetMobileDataStatus", function(obj){

            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                g_dataStatus = obj.status;
                if (g_dataStatus === g_dataStatusOn) {
                    $("#dataon").attr("checked", "checked");
                } else if (g_dataStatus === g_dataStatusOff) {
                    $("#dataoff").attr("checked", "checked");
                } else {
                    $("#dataoff").attr("checked", "checked");
                }
            }
        }, {
            async: isasync
        });

    }
    function getDataRoamingStatus(isasync){
        getAjaxJsonData("/action/GetMobileDataRoamingStatus", function(obj){

            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                g_dataRoamingStatus = obj.status;
                if (g_dataRoamingStatus === g_dataStatusRoamingOn) {
                    $("#roamingon").attr("checked", "checked");
                } else if (g_dataRoamingStatus === g_dataStatusRoamingOff) {
                    $("#roamingoff").attr("checked", "checked");
                } else {
                    $("#roamingoff").attr("checked", "checked");
                }
            }
        }, {
            async: isasync
        });
    }
    function saveDataStatus(data){
        var postdata = {};
        stopLogoutTimer();
        postdata.status = data;
        postdata = JSON.stringify(postdata);
        saveAjaxJsonData("/action/SetMobileDataStatus", postdata, function(obj){
            startLogoutTimer();
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                showResultDialog(common_success, common_success);
                getDataStatus(true);
            } else {
                showResultDialog(common_failed, common_failed, 3000);
            }
        }, {
            async: false
        });
    }
    function saveDataRoamingStatus(data){
        var postdata = {};
        postdata.status = data;
        postdata = JSON.stringify(postdata);
        stopLogoutTimer();
        saveAjaxJsonData("/action/SetMobileDataRoamingStatus", postdata, function(obj){

            startLogoutTimer();
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                showResultDialog(common_success, common_success);
                getDataRoamingStatus(true);
            } else {
                showResultDialog(common_failed, common_failed, 3000);
            }
        }, {
            async: true
        })
    }

})();
