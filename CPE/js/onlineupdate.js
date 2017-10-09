(function(){
    var g_newVersionChecking = 11;
    var g_newVerisonFound = 12;
    var g_newVersionFailed = 13;
    var g_newVersionNotFound = 14;
    var g_internetModeMobile = 4;

    var g_fotaDownloadFailed = 20;
    var g_fotaDownloading = 30;
    var g_fotaDownloadPedding = 31;
    var g_fotaDownloadSuccess = 40;

    var g_fotaInstallReady = 50;
    var g_fotaInstalling = 60;
    var g_fotaInstallFailed = 80;
    var g_fotaInstallSuccess = 90;
    var g_fotaInstallReport = 100;

    var g_deviceInfo;
    var g_curNewVersionStatus = g_newVersionChecking;
    var g_curDownloadStatus = g_fotaDownloading;
    var g_curUpdateStatus;

    getDeviceInfo();
    $(document).ready(function(){
        if (g_deviceInfo.softwareVersion){
            $("#cursoftver").text(g_deviceInfo.softwareVersion);
        } else {
            $("#cursoftver").text(common_unknown);
        }
        if (g_deviceInfo.hardwareVersion){
            $("#curhardver").text(g_deviceInfo.hardwareVersion);
        } else {
            $("#curhardver").text(common_unknown);
        }
        $("#check").attr("value", str_update_onlineupdate_checknewver).on("click", checkNewVersion);
    });
    function checkNewVersion(){
        getAjaxJsonData("/action/FotaCheckNewVersion", function(obj){
            closeDialog();
            stopLogoutTimer();
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                showWaitingDialog(common_waiting, str_update_onlineupdate_checking);
                //getNewVersionInfo();
                updateNewVersionInfo();
            } else {
                showResultDialog(common_result, common_failed);
                startLogoutTimer();
            }
        }, {
            async: true
        });
    }
    function getNewVersionInfo(){
        getAjaxJsonData("/action/FotaGetCheckVersionInfo", function(obj){
            var status;
            if (typeof obj.retcode === "number"){
                status = obj.status;
                g_curNewVersionStatus = status;
                if (status === g_newVersionChecking) {
                    //showWaitingDialog(common_waiting, str_update_onlineupdate_checking);
                    //updateNewVersionInfo();
                } else if (status === g_newVerisonFound) {
                    $("#newsoftver").text(obj.version);
                    $("#desc").text(obj.brief);
                    $("#upgrade").attr("value", str_update_onlineupdate_doupdate).on("click", function(){
                        if (g_curInternetMode === g_internetModeMobile) {
                            showConfirmDialog(common_tip, str_update_onlineupdate_mobiledatatips.replace("%s", "<strong>" + str_dialup_mobiledata + "</strong>"), do_update);
                        } else {
                            do_update();
                        }
                    }).show();
                    $("#newver").show();
                    closeDialog();
                } else if (status === g_newVersionFailed) {
                    closeDialog();
                    showResultDialog(common_result, common_failed, 3000);
                } else if (status === g_newVersionNotFound) {
                    closeDialog();
                    showResultDialog(common_result, str_update_onlineupdate_uptodata);
                } else {
                    closeDialog();
                    showResultDialog(common_result, common_unknown, 3000);
                }
            } else {
                closeDialog();
                showResultDialog(common_result, str_update_onlineupdate_unknowncode.replace("%s", obj.retcode), 3000);
            }
        }, {
            async: true,
            type: "POST",
            dataType: "json",
            contentType: "application/json"
        });
    }
    function updateNewVersionInfo(){
        if (g_curNewVersionStatus !== g_newVersionChecking) {
            return;
        }
        getNewVersionInfo();
        setTimeout(updateNewVersionInfo, 2000);
    }
    function do_update(){
        closeDialog();
        getAjaxJsonData("/action/FotaDownload", function(obj){

            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                showBasicDialog(str_update_onlineupdate_doupdate);
                updateProgress();
            } else {
                showResultDialog(common_result, str_update_onlineupdate_updatefailed, 3000);
            }
        }, {
            async: true
        });
    }
    function updateProgress(){
        if (g_curDownloadStatus !== g_fotaDownloading) {
            return;
        }
        getAjaxJsonData("/action/FotaGetDownloadStatus", function(obj){
            var status;
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                status = obj.status;
                g_curDownloadStatus = status;
                if (status === g_fotaDownloadFailed){
                    $("#dialogbody").text(str_update_onlineupdate_downloadfailed + common_colon + obj.errno);
                    setTimeout(closeDialog, 3000);
                } else if (status === g_fotaDownloading) {
                    $("#dialogbody").text(str_update_onlineupdate_downloading.replace("%d", obj.percent));
                } else if (status === g_fotaDownloadPedding) {
                    $("#dialogbody").text(str_update_onlineupdate_pedidng.replace("%id", obj.errno).replace("%d", obj.percent));
                } else if (status === g_fotaDownloadSuccess) {
                    $("#dialogbody").text(str_update_onlineupdate_downloadsuccess);
                    updateUpgradeStatus();
                } else {
                    $("#dialogbody").text(common_unknown);
                }
            }
        }, {
            async: true
        });
        setTimeout(updateProgress, 2000);
    }

    function updateUpgradeStatus(){
        if (g_curUpdateStatus === g_fotaInstallSuccess) {
            closeDialog();
            return;
        }
        getAjaxJsonData("/action/FotaUpgrade", function(obj){
            var status;
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                status = obj.status;
                if (status === g_fotaInstallReady) {
                    $("#dialogbody").text(str_update_onlineupdate_installready);
                } else if (status === g_fotaInstalling){
                    $("#dialogbody").text(str_update_onlineupdate_installing);
                } else if (status === g_fotaInstallFailed) {
                    $("#dialogbody").text(str_update_onlineupdate_installfailed);
                    setTimeout(closeDialog, 3000);
                } else if (status === g_fotaInstallSuccess) {
                    $("#dialogbody").text(str_update_onlineupdate_installsuccess);
                    setTimeout(closeDialog, 3000);
                } else if (status === g_fotaInstallReport) {
                    $("#dialogbody").text(str_update_onlineupdate_installreport);
                }
            }
        }, {
            async: true
        });
        setTimeout(updateUpgradeStatus, 2000);
    }
    function getDeviceInfo(){
        getAjaxJsonData("/action/GetDeviceInfo", function(obj){
            g_deviceInfo = {};
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                g_deviceInfo.softwareVersion = obj.softwareVersion;
                g_deviceInfo.hardwareVersion = obj.hardwareVersion;
            }
        }, {
            async: false
        });
    }
})();
