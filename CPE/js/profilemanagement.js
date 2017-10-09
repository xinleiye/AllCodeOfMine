(function(){
    var g_maxProfileNum = 5;
    var g_maxProfilenameLength = 20;
    var g_minProfilenameLength = 1;
    var g_maxUsernameLength = 32;
    var g_minUsernameLength = 5;
    var g_maxPasswordLength = 32;
    var g_minPasswordLength = 5;
    var g_maxApnLength = 32;
    var g_minApnLength = 1;
    var g_profileReadonly = 1;
    var g_profileAuthNONE = 0;
    var g_profileAuthPAP = 1;
    var g_profileAuthCHAP = 2;
    var g_profileAuthAUTO = 3;
    var g_profileAuthMode = [
        {
            auth: g_profileAuthNONE,
            name: str_dialup_authmodenone
        },
        {
            auth: g_profileAuthAUTO,
            name: str_dialup_authmodeauto
        },
        {
            auth: g_profileAuthPAP,
            name: str_dialup_authmodepap
        },
        {
            auth: g_profileAuthCHAP,
            name: str_dialup_authmodechap
        }
    ];
    var g_profileList;
    var g_defaultProfileID;

    getProfileInfo();
    $(document).ready(function(){
        var i, len, html, $newprofile;
        var option = "<option value=\"%d\">%s</option>";

        len = g_profileList.length;
        if (len <= 0){
            $("#profilelist").attr("disabled", "disabled");
            $("#profile-username").attr("disabled", "disabled");
            $("#profile-psd").attr("disabled", "disabled");
            $("#profile-auth").attr("disabled", "disabled");
            $("#profile-apn").attr("disabled", "disabled");
            $("#apply").hide();
            $("#del").hide();
            $("#newprofile").attr("value", str_dialup_newprofile).on("click", function() {
                showNewProfileDialog();
            });
        } else {
            html = "";
            for(i = 0; i < len; i++){
                if (g_profileList[i].index === g_defaultProfileID) {
                    html += option;
                    html = html.replace("%d", g_profileList[i].index);
                    html = html.replace("%s", g_profileList[i].profilename + " (" + common_default + ")");
                    break;
                }
            }
            for(i = 0; i < len; i++){
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

            html = "";
            for(i = 0, len = g_profileAuthMode.length; i < len; i++){
                html += option;
                html = html.replace("%d", g_profileAuthMode[i].auth).replace("%s", g_profileAuthMode[i].name);
            }

            $("#profile-auth").html(html);

            showProfileInfo(g_defaultProfileID);

            $("#apply").attr("value", common_apply).on("click", modifyProfile);
            $("#del").attr("value", common_del).on("click", deleteProfile);
            $newprofile = $("#newprofile");
            $newprofile.attr("value", str_dialup_newprofile);
            if (g_profileList.length >= g_maxProfileNum){
                $newprofile.attr("disabled", "disabled");
            } else {
                $newprofile.on("click", function() {
                    showNewProfileDialog();
                });
            }
        }
    });

    function deleteProfile(){
        var postdata, _obj = {};

        stopLogoutTimer();
        _obj.index = parseInt($("#profilelist").val(), 10);
        postdata = JSON.stringify(_obj);
        saveAjaxJsonData("/action/DeleteProfile", postdata, function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                showResultDialog(common_result, common_success, 3000);
            } else {
                showResultDialog(common_result, common_failed);
                startLogoutTimer();
            }
        }, {

        });
    }

    function clearErrorInfo(){
        $("#nametips").hide();
        $("#usntips").hide();
        $("#pwdtips").hide();
        $("#apntips").hide();
    }

    function checkProfile(obj) {
        var i, len, val, reg;

        clearErrorInfo();

        reg = /[,":;\\&%+'<>?]+/g;

        val = obj["profilename"];
        if (val.match(reg)){
            $("#new-profilename").focus();
            $("#nametipstring").text(str_dialup_profilenametips1);
            $("#nametips").show();
            return false;
        }
        if (val.length < g_minProfilenameLength || val.length > g_maxProfilenameLength){
            $("#new-profilename").focus();
            $("#nametipstring").text(str_dialup_profilenametips2.replace("%s", g_minProfilenameLength).replace("%e", g_maxProfilenameLength));
            $("#nametips").show();
            return false;
        }
        for(i = 0, len = g_profileList.length; i < len; i++) {
            if (val === g_profileList[i].profilename) {
                $("#new-profilename").focus();
                $("#nametipstring").text(str_dialup_profilenametips);
                $("#nametips").show();
                return false;
            }
        }

        val = obj["username"];
        if (val.match(reg)){
            $("#new-username").focus();
            $("#usntipstring").text(str_dialup_usernametips1);
            $("#usntips").show();
            return false;
        }

        val = obj["password"];
        if (val.match(reg)){
            $("#new-password").focus();
            $("#pwdtipstring").text(str_dialup_passwordtips1);
            $("#pwdtips").show();
            return false;
        }

        val = obj["apn"];
        if (val.match(reg)){
            $("#new-apn").focus();
            $("#apntipstring").text(str_dialup_apntips1);
            $("#apntips").show();
            return false;
        }

        return true;
    }
    function addProfile(){
        var ret, data, postdata, obj = {};

        data = $("#newprofileinfo").serializeArray();
        $.each(data, function(index, val){
            obj[val.name] = val.value;
        });
        ret = checkProfile(obj);
        if (ret === false) {
            return;
        }
        obj.authmode = parseInt(obj.authmode);
        stopLogoutTimer();
        postdata = JSON.stringify(obj);
        saveAjaxJsonData("/action/AddProfile", postdata, function(data){
            var _obj = data;
            closeDialog();
            if (typeof _obj.retcode === "number" && _obj.retcode === g_resultSuccess){
                showResultDialog(common_result, common_success, 3000);
            } else {
                showResultDialog(common_result, common_failed, 3000);
            }
        }, {
        });
    }
    function modifyProfile(){
        var data = $("#profile-settings").serializeArray();
        var obj = {};
        var postdata;

        $.each(data, function(index, val){
            obj[val.name] = val.value;
        });
        obj.index = parseInt(obj.index);
        for(var i = 0, len = g_profileList.length; i < len; i++) {
            if (obj.index === g_profileList[i].index) {
                obj.profilename = g_profileList[i].profilename;
                break;
            }
        }
        if (g_profileList[i].readonly === g_profileReadonly) {
            obj.username = g_profileList[i].username;
            obj.password = g_profileList[i].password;
            obj.authmode = g_profileList[i].authmode;
            obj.apn = g_profileList[i].apn;
        }
        obj.authmode = parseInt(obj.authmode);
        stopLogoutTimer();
        postdata = JSON.stringify(obj);
        saveAjaxJsonData("/action/SetProfile", postdata, function(data){
            var _obj = data;
            if (typeof _obj.retcode === "number" && _obj.retcode === g_resultSuccess){
                showResultDialog(common_result, common_success, 3000);
            } else {
                showResultDialog(common_result, common_failed);
                startLogoutTimer();
            }
        }, {
        });
    }

    function showProfileInfo(index){
        var i, len, profile, num;
        var $usn, $psd, $apn, $auth;

        num = parseInt(index);
        for(i = 0, len = g_profileList.length; i < len; i++){
            if (num === g_profileList[i].index) {
                profile = g_profileList[i];
                break;
            }
        }

        $usn = $("#profile-username");
        $psd = $("#profile-psd");
        $auth = $("#profile-auth");
        $apn = $("#profile-apn");
        $usn.attr("value", profile.username);
        $psd.attr("value", profile.password);
        $auth.val(profile.authmode);
        $apn.attr("value", profile.apn);
        if (profile.readonly === g_profileReadonly) {
            $usn.attr("disabled", "disabled");
            $psd.attr("disabled", "disabled");
            $auth.attr("disabled", "disabled");
            $apn.attr("disabled", "disabled");
        } else {
            $usn.removeAttr("disabled");
            $psd.removeAttr("disabled");
            $auth.removeAttr("disabled");
            $apn.removeAttr("disabled");
        }
    }
    function getProfileInfo(){
        getAjaxJsonData("/action/GetProfile", function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                g_profileList = obj.profileList;
                g_defaultProfileID = obj.curid;
            }
        }, {
            async: false
        });
    }
    function showNewProfileDialog(){
        var i, len, html, style;
        var option = "<option value=\"%d\">%s</option>";
        var newprofiledialog = [
            '<div id="newprofiledialog">',
            '<form id="newprofileinfo">',
            '<table cellspacing="0" cellpadding="0" width="400">',
            '<tbody>',
            '<tr>',
            '<td class="tdwidth120"><label id="label-new-profilename" for="new-profilename"></label></td>',
            '<td><input id="new-profilename" type="text" name="profilename" maxlength="20" class="newprofileinput" /></td>',
            '</tr>',
            '<tr id="nametips" style="display: none" class="fontcolorred">',
            '<td class="tdwidth120"></td>',
            '<td id="nametipstring"></td>',
            '</tr>',
            '<tr>',
            '<td class="tdwidth120"><label id="label-new-username" for="new-username"></label></td>',
            '<td><input id="new-username" type="text" name="username" maxlength="32" class="newprofileinput"></td>',
            '</tr>',
            '<tr id="usntips" style="display: none" class="fontcolorred">',
            '<td class="tdwidth120"></td>',
            '<td id="usntipstring"></td>',
            '</tr>',
            '<tr>',
            '<td class="tdwidth120"><label id="label-new-password" for="new-password"></label></td>',
            '<td><input id="new-password" type="password" name="password" maxlength="32" class="newprofileinput"></td>',
            '</tr>',
            '<tr id="pwdtips" style="display: none" class="fontcolorred">',
            '<td class="tdwidth120"></td>',
            '<td id="pwdtipstring"></td>',
            '</tr>',
            '<tr>',
            '<td class="tdwidth120"><label id="label-new-authmode" for="new-authmode"></label></td>',
            '<td><select id="new-authmode" name="authmode" class="newprofileselect">%select</select></td>',
            '</tr>',
            '<tr>',
            '<td class="tdwidth120"><label id="label-new-apn" for="new-apn"></label></td>',
            '<td><input id="new-apn" type="text" name="apn" maxlength="32" class="newprofileinput"></td>',
            '</tr>',
            '<tr id="apntips" style="display: none" class="fontcolorred">',
            '<td class="tdwidth120"></td>',
            '<td id="apntipstring"></td>',
            '</tr>',
            '</tbody>',
            '</table>',
            '</form>',
            '</div>'].join("");
        html = "";
        for(i = 0, len = g_profileAuthMode.length; i < len; i++){
            html += option;
            html = html.replace("%d", g_profileAuthMode[i].auth).replace("%s", g_profileAuthMode[i].name);
        }
        style = newprofiledialog.replace("%select", html);

        showDialog(style);
        $("#label-new-profilename").text(str_dialup_profilename);
        $("#label-new-username").text(str_dialup_username);
        $("#label-new-password").text(str_dialup_psd);
        $("#label-new-authmode").text(str_dialup_authmode);
        $("#label-new-apn").text(str_dialup_apn);
        $("#cancel-btn").attr("value", common_cancel).on("click", closeDialog);
        $("#diatitle").children().text(str_dialup_newprofile);
        $("#diaclose").on("click", closeDialog);
        $("#ok-btn").attr("value", common_save).on("click", addProfile);
    }
})();