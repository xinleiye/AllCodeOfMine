(function(){
    var g_simStatusNo = 0;
    var g_simStatusPIN = 1;
    var g_simStatusPUK = 2;
    var g_curSimStatus;

    getSimStatus();
    $(document).ready(function(){
        if (g_curSimStatus === g_simStatusPIN) {
            window.location.replace("pin.html");
        } else if (g_curSimStatus === g_simStatusPUK){
            window.location.replace("puk.html");
        } else if (g_curSimStatus === g_simStatusNo) {
            initCardInvalidPage();
        } else {
            window.location.replace("home.html");
        }
    });

    function initCardInvalidPage(){
        $("#msg1").text(str_cardinvalid_cardinvalid);
        $("#msg2").text(str_cardinvalid_setinternet);
        $("#msg3").text(str_cardinvalid_insertSIMcard);
        $("#cardinvalid_button").attr("value", str_cardinvalid_gotohome).on("click", function(){
            window.location.replace("home.html");
        });
    }
    function getSimStatus(){
        getAjaxJsonData("/action/GetSimInfo", function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                g_curSimStatus = obj.status;
            }
        }, {
            async: false
        });
    }
})();