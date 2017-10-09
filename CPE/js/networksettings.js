(function(){
    var g_searchNetworkAuto = 0;
    var g_searchNetworkManual = 1;
    var g_searchNetworkMode = [
        {
            mode: g_searchNetworkAuto,
            name: str_dialup_networkauto
        },
        {
            mode: g_searchNetworkManual,
            name: str_dialup_networkmanual
        }
    ];
    var g_networkModeAuto = 0;
    var g_networkMode2G = 3;
    var g_networkMode3G = 2;
    var g_networkMode4G = 1;
    var g_networkMode = [
        {
            mode: g_networkModeAuto,
            name: str_dialup_networkauto
        },
        {
            mode: g_networkMode2G,
            name: str_dialup_networkmode2G
        },
        {
            mode: g_networkMode3G,
            name: str_dialup_networkmode3G
        },
        {
            mode: g_networkMode4G,
            name: str_dialup_networkmode4G
        }
    ];

    var g_getNetworkListFailed = -1;
    var g_getNetworkListMAX = 40;
    var g_getNetworkListPadding = 0;

    var g_networkNormal = 1;
    var g_networkRoaming = 2;

    var g_networkRegist = 0;
    var g_networkAvailable = 1;
    var g_networkForbidden = 2;

    var g_registStatusFailed = -1;
    var g_registStatusSuccess = 0;
    var g_registStatusRegisting = 1;

    var g_networkList;

    var g_curSearchNetworkMode = g_searchNetworkAuto;
    var g_curNetworkMode = g_networkModeAuto;

    getNetworkData();
    $(document).ready(function(){
        initNetworkList();
        initSearchNetworkList();
        $("#apply").attr("value", common_apply).on("click", function(){
            saveNetworkData();
        });

    });
    function initNetworkList(){
        var html = "";
        var option = '<option value="%d">%s</option>';
        $.each(g_networkMode, function(){
            html += option;
            html = html.replace("%d", this.mode);
            html = html.replace("%s", this.name);
        });
        $("#networkmode").html(html).val(g_curNetworkMode);
    }
    function initSearchNetworkList(){
        var html = "";
        var option = '<option value="%d">%s</option>';
        $.each(g_searchNetworkMode, function(){
            html += option;
            html = html.replace("%d", this.mode);
            html = html.replace("%s", this.name);
        });
        $("#networksearch").html(html).val(g_curSearchNetworkMode);
    }
    function saveNetworkData(){
        var obj, _data, postdata;

        stopLogoutTimer();
        _data = {};
        obj = $("#network").serializeArray();
        $.each(obj, function(){
            _data[this.name] = parseInt(this.value);
        });
        postdata = JSON.stringify(_data);
        saveAjaxJsonData("/action/SetNetworkSearchMode", postdata, function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                if (_data.type === g_searchNetworkAuto) {
                    showResultDialog(common_success, common_success, 3000);
                } else if (_data.type === g_searchNetworkManual) {
                    showWaitingDialog(common_waiting, common_waitingmsg);
                    getNetworkList();
                } else {
                    showResultDialog(common_failed, common_failed, 3000);
                }
            } else {
                startLogoutTimer();
                showResultDialog(common_failed, common_failed);
            }
        }, {
            async: true
        });

    }
    function getNetworkData(){
        getAjaxJsonData("/action/GetNetworkSearchMode", function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                g_curNetworkMode = obj.mode;
                g_curSearchNetworkMode = obj.type;
            }
        },{
            async: false
        });
    }
    function getNetworkList(){
        getAjaxJsonData("/action/GetNetworkList", function(obj){
            var status;
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                g_networkList = obj.networkList;
                status = Number(obj.status);
                if (status <= g_getNetworkListFailed) {
                    closeDialog();
                    showResultDialog(common_failed, str_dialup_networktips1, 3000);
                } else if (status === g_getNetworkListPadding) {
                    setTimeout(getNetworkList, 5000);
                } else if (status <= g_getNetworkListMAX) {
                    closeDialog();
                    showNetworkListDialog(obj.networkList, registNetwork);
                } else {
                    closeDialog();
                    showResultDialog(common_failed, str_dialup_networktips1, 3000);
                }
            }
        }, {
            async: true
        });

    }
    function getRegistResult(){
        getAjaxJsonData("/action/GetRegNetworkStatus", function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                if (obj.status === g_registStatusFailed) {
                    closeDialog();
                    showResultDialog(common_failed, common_failed, 3000);
                } else if (obj.status === g_registStatusSuccess) {
                    closeDialog();
                    showResultDialog(common_success, common_success, 3000);
                } else if (obj.status === g_registStatusRegisting) {
                    setTimeout(getRegistResult, 4000);
                } else {
                    closeDialog();
                    showResultDialog(common_failed, common_failed, 3000);
                }
            }
        }, {
            async: true
        });
    }
    function registNetwork(){
        var index, data, postdata;
        index = 0;
        data = $("#networkform").serializeArray();
        $.each(data, function(key, val){
            if (val.name === "networklist") {
                index = val.value;
            }
        });
        postdata = g_networkList[index];
        postdata = JSON.stringify(postdata);
        closeDialog();
        startLogoutTimer();
        saveAjaxJsonData("/action/ManualRegNetwork", postdata, function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                showWaitingDialog(common_waiting, str_dialup_networkregisttips);
                getRegistResult();
            } else {
                showResultDialog(common_failed, common_failed, 3000);
            }
        }, {
            async: true
        });
    }
    function showNetworkListDialog(networkinfo, callback){
        var i, len, networkarray, style, table;
        var networktable = [
            '<form id="networkform">',
            '<table>',
            '<tbody>',
            '<tr>',
            '<th class="tdwidth40"></th>',
            '<th class="tdwidth80">%roam</th>',
            '<th class="tdwidth120">%operatorname</th>',
            '<th class="tdwidth60">%rate</th>',
            '<th class="tdwidth100">%status</th>',
            '</tr>',
            '%table',
            '</tbody>',
            '</table>',
            '</form>'].join("");
        var networklist = [
            '<tr class="%class">',
            '<td><input type="radio" name="networklist" value="%d"></td>',
            '<td>%roam</td>',
            '<td>%operatorname</td>',
            '<td>%rate</td>',
            '<td>%status</td>',
            '</tr>'].join("");

        if (Array.isArray(networkinfo)) {
            networkarray = networkinfo;
        } else {
            networkarray = [];
        }

        networktable = networktable.replace("%roam", str_dialup_networkroam);
        networktable = networktable.replace("%operatorname", str_dialup_networkopname);
        networktable = networktable.replace("%rate", str_dialup_networkrate);
        networktable = networktable.replace("%status", str_dialup_networkstatus);
        style = "";
        for(i = 0, len = networkarray.length; i < len; i++) {
            style += networklist;
            style = style.replace("%operatorname", networkarray[i].operatorName);
            style = style.replace("%d", i);
            if (i % 2 === 0) {
                style = style.replace("%class", "oddtr");
            } else {
                style = style.replace("%class", "eventr");
            }

            if (networkarray[i].roamingStatus === g_networkRoaming) {
                style = style.replace("%roam", "Roaming");
            } else if (networkarray[i].roamingStatus === g_networkNormal) {
                style = style.replace("%roam", "Normal");
            } else {
                style = style.replace("%roam", "Unknown");
            }

            if (networkarray[i].networkRat === g_networkMode2G) {
                style = style.replace("%rate", "2G");
            } else if (networkarray[i].networkRat === g_networkMode3G) {
                style = style.replace("%rate", "3G");
            } else if (networkarray[i].networkRat === g_networkMode4G) {
                style = style.replace("%rate", "4G");
            } else {
                style = style.replace("%rate", "Unknown");
            }

            if (networkarray[i].networkStatus === g_networkForbidden) {
                style = style.replace("%status", "Forbidden");
            } else if (networkarray[i].networkStatus === g_networkAvailable) {
                style = style.replace("%status", "Allow");
            } else if (networkarray[i].networkStatus === g_networkRegist) {
                style = style.replace("%status", "Registed");
            } else {
                style = style.replace("%status", "Unknown");
            }
        }
        table = networktable.replace("%table", style);
        showDialog(table);
        $("#diatitle").children().text(str_dialup_networknetworklist);
        $("#diaclose").on("click", closeDialog);
        $("#ok-btn").attr("value", str_dialup_networkregist).on("click", callback);
        $("#cancel-btn").attr("value", common_cancel).on("click", closeDialog);
    }
})();