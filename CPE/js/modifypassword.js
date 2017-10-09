(function(){
    var g_psdStrengthLow = 60;
    var g_psdStrengthMid = 80;
    var g_psdStrengthHig = 100;
    var g_psdMinLength = 5;
    var g_psdMaxLength = 15;
    var g_curpsdIncorrect = 211;
    var g_newpsdNotMatch = 213;
    var g_stringMaskNumber = 1;
    var g_stringMaskLowerCase = 2;
    var g_stringMaskUpperCase = 4;
    var g_stringMaskOther = 8;
    $(document).ready(function(){
        clearAllTips();
        $("#newpsd1").on("keyup", function(){
            var psd, strength;
            psd = $(this).val();
            if (typeof psd !== "string") {
                return false;
            }
            if (psd.length < g_psdMinLength) {
                return true;
            }
            strength = checkPsdStrength(psd);
            showPasswordStrength(strength);
        });
        $("#apply").attr("value", common_apply).on("click", saveNewPassWord);
    });
    function saveNewPassWord(){
        var oldpsd, newpsd1, newpsd2, postdata={};
        oldpsd = $("#curpsd").val();
        newpsd1 = $("#newpsd1").val();
        newpsd2 = $("#newpsd2").val();

        clearAllTips();
        if (oldpsd.length === 0) {
            $("#curtips").text(str_system_curpsdtips1);
            $("#curpsdtips").show();
            return;
        }
        if (newpsd1 !== newpsd2) {
            $("#newtips2").text(str_system_newpsdtips2);
            $("#newpsdtips2").show();
            return;
        }
        postdata.o_passwd = oldpsd;
        postdata.n_passwd = newpsd1;
        postdata.c_passwd = newpsd2;
        postdata = JSON.stringify(postdata);
        checkNewPsd(oldpsd);
        startLogoutTimer();
        saveAjaxJsonData("/action/ModifyPassword", postdata, function(obj){

            if (typeof obj.retcode === "number") {
                if (obj.retcode === g_resultSuccess) {
                    do_logout();
                } else if (obj.retcode === g_curpsdIncorrect) {
                    $("#curtips").text(str_system_curpsdtips2);
                    $("#curpsdtips").show();
                } else if (obj.retcode === g_newpsdNotMatch) {
                    $("#newtips2").text(str_system_curpsdtips2);
                    $("#newpsdtips2").show();
                }
            }
        }, {

        });
    }
    function checkNewPsd(psd){

    }
    function checkPsdStrength(psd){
        var i, len, ch, chmask, chnum, strength = 0;

        if (typeof psd !== "string") {
            return;
        }

        len = psd.length;
        if (len < 8) {
            strength = g_psdStrengthLow;
        }
        chmask = 0;
        for(i=0; i<len; i++){
            ch = psd[i];
            if(ch>="0" && ch<="9") {
                chmask |= g_stringMaskNumber;
            } else if ((ch>="a")&&(ch<="z")){
                chmask |= g_stringMaskLowerCase;
            } else if ((ch>="A")&&(ch<="Z")){
                chmask |= g_stringMaskUpperCase;
            } else {
                chmask |= g_stringMaskOther;
            }
        }
        chnum = 0;
        if ((chmask&g_stringMaskNumber) !== 0){
            chnum++;
        }
        if ((chmask&g_stringMaskLowerCase) !== 0){
            chnum++;
        }
        if ((chmask&g_stringMaskUpperCase) !== 0){
            chnum++;
        }
        if ((chmask&g_stringMaskOther) !== 0){
            chnum++;
        }

        if (chnum >= 3) {
            strength = g_psdStrengthHig;
        } else if (chnum === 2){
            strength = g_psdStrengthMid;
        } else {
            strength = g_psdStrengthLow;
        }
        return strength;
    }
    function showPasswordStrength(strength){
        var $low, $mid, $hig;
        $low = $("#psdstrength-low");
        $mid = $("#psdstrength-mid");
        $hig = $("#psdstrength-high");
        switch(strength){
            case g_psdStrengthHig:
                $low.attr("class", "psdhighcolor");
                $mid.attr("class", "psdhighcolor");
                $hig.attr("class", "psdhighcolor");
                break;
            case g_psdStrengthMid:
                $low.attr("class", "psdmidcolor");
                $mid.attr("class", "psdmidcolor");
                $hig.attr("class", "psdnormalcolor");
                break;
            case g_psdStrengthLow:
                $low.attr("class", "psdlowcolor");
                $mid.attr("class", "psdnormalcolor");
                $hig.attr("class", "psdnormalcolor");
                break;
            default:
                $low.attr("class", "psdnormalcolor");
                $mid.attr("class", "psdnormalcolor");
                $hig.attr("class", "psdnormalcolor");
                break;
        }
    }
    function clearAllTips(){
        $("#curpsdtips").hide();
        $("#curtips").text("");
        $("#newpsdtips1").hide();
        $("#newtips1").text("");
        $("#newpsdtips2").hide();
        $("#newtips2").text("");
    }
})();