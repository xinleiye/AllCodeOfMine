(function(){
    //var g_internetModeDHCP = "1";
    //var g_internetModePPPoE = "2";
    //var g_internetModeStation = "3";
    //var g_internetModeMobile = "4";
    var g_internetModeEthernet = 1;
    var g_internetModeStation = 2;
    var g_internetModeMobile = 3;
    var g_internetMode = [
        /*{
            mode: g_internetModeDHCP,
            name: str_internet_dynamic,
            html: "ethernetsettings.html"
            //desc: str_internet_mode_gotoethernet
        },
        {
            mode: g_internetModePPPoE,
            name: str_internet_pppoe,
            html: "ethernetsettings.html"
            //desc: str_internet_mode_gotoethernet
        },*/
        {
            mode: g_internetModeEthernet,
            name: str_internet_mode_ethernet,
            html: "ethernetsettings.html"
            //desc: str_internet_mode_gotoethernet
        },
        {
            mode: g_internetModeStation,
            name: str_internet_mode_station,
            html: "wifistation.html"
            //desc: str_internet_mode_gotostation
        },
        {
            mode: g_internetModeMobile,
            name: str_internet_mode_mobile,
            html: "mobileconnection.html"
            //desc: str_internet_mode_gotomobile
        }
    ];
    var g_curInternetMode = {
        mode: "",
        name: "",
        html: ""
        //desc: ""
    };
    getInterentModeInfo();
    $(document).ready(function(){
        initProfilePage();
    });

    function initProfilePage(){
        var i, len, $list;
        var option = "<option value=\"%d\">%s</option>";
        var html = "";

        for(i = 0, len = g_internetMode.length; i < len; i++){
            html += option;
            html = html.replace("%d", g_internetMode[i].mode);
            html = html.replace("%s", g_internetMode[i].name);
        }
        $list = $("#internetmodelist");
        $list.html(html);

        $("#apply").attr("value", "Goto").on("click", redirectToInterentModePage);
    }
    function redirectToInterentModePage(){
        var i, len, data, url;
        data = parseInt($("#internetmodelist").val());
        for(i = 0, len = g_internetMode.length; i < len; i++){
            if (g_internetMode[i].mode === data) {
                url = g_internetMode[i].html;
            }
        }
        window.location.href = url;
    }

    function getInterentModeInfo(){
        getAjaxJsonData("/action/GetInternetMode", function(obj){

            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                $.each(g_internetMode, function(){
                    if (this.mode === obj.mode) {
                        g_curInternetMode = this;
                    }
                });
            } else {

            }
        }, {
            async: false
        });
    }
})();