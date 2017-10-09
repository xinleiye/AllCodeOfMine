(function(){
    var g_resultSuccess = 0;
    var g_resultFailed = 1;
    var g_waitingTime = 3000;
    var g_wifiBandMode24G = 0;
    var g_wifiBandMode5G = 1;
    var g_wifiFrequencyMode802b = 0;
    var g_wifiFrequencyMode802g = 1;
    var g_wifiFrequencyMode802n = 4;
    //var g_wifiFrequencyMode802bgn = 3;
    var g_wifiFrequencyMode802a = 2;
    var g_wifiFrequencyMode802ac = 5;
    var g_wifiWidthAuto = 0;
    var g_wifiWidth20MHz = 1;
    var g_wifiWidth40MHz = 2;
    var g_wifiWidth80MHz = 3;
    var g_wifiBand = [
        {
            band: g_wifiBandMode24G,
            name: "2.4G",
            frequency: [
                {
                    fremode: g_wifiFrequencyMode802b,
                    frename: "802.11b",
                    width: [
                        {
                            value: g_wifiWidthAuto,
                            name: "Auto"
                        },
                        {
                            value: g_wifiWidth20MHz,
                            name: "20MHz"
                        }
                    ]
                },
                {
                    fremode: g_wifiFrequencyMode802g,
                    frename: "802.11g",
                    width: [
                        {
                            value: g_wifiWidthAuto,
                            name: "Auto"
                        },
                        {
                            value: g_wifiWidth20MHz,
                            name: "20MHz"
                        }
                    ]
                },
                {
                    fremode: g_wifiFrequencyMode802n,
                    frename: "802.11n",
                    width: [
                        {
                            value: g_wifiWidthAuto,
                            name: "Auto"
                        },
                        {
                            value: g_wifiWidth20MHz,
                            name: "20MHz"
                        }
                    ]
                }/*,
                {
                    fremode: g_wifiFrequencyMode802bgn,
                    frename: "802.11bgn",
                    width: [
                        {
                            value: g_wifiWidthAuto,
                            name: "Auto"
                        },
                        {
                            value: g_wifiWidth20MHz,
                            name: "20MHz"
                        }
                    ]
                }*/
            ],
            country: [
                {
                    sab: "CN",
                    fullname: common_country_China,
                    channel: "0,1,2,3,4,5,6,7,8,9,10,11,12,13"
                },
                {
                    sab: "UY",
                    fullname: common_country_Uruguay,
                    channel: "0,1,2,3,4,5,6,7,8,9,10,11,12,13"
                },
                {
                    sab: "US",
                    fullname: common_country_America,
                    channel: "0,1,2,3,4,5,6,7,8,9,10,11"
                },
                {
                    sab: "ZM",
                    fullname: common_country_Zambia,
                    channel: "0,1,2,3,4,5,6,7,8,9,10,11,12,13"
                },
                {
                    sab: "IQ",
                    fullname: common_country_Iraq,
                    channel: "0,1,2,3,4,5,6,7,8,9,10,11,12,13"
                },
                {
                    sab: "CM",
                    fullname: common_country_Cameroon,
                    channel: "0,1,2,3,4,5,6,7,8,9,10,11,12,13"
                },
                {
                    sab: "CI",
                    fullname: common_country_CoteDlvoire,
                    channel: "0,1,2,3,4,5,6,7,8,9,10,11,12,13"
                },
                {
                    sab: "CA",
                    fullname: common_country_Canada,
                    channel: "0,1,2,3,4,5,6,7,8,9,10,11"
                },
                {
                    sab: "BR",
                    fullname: common_country_Brazil,
                    channel: "0,1,2,3,4,5,6,7,8,9,10,11,12,13"
                },
                {
                    sab: "AR",
                    fullname: common_country_Argentina,
                    channel: "0,1,2,3,4,5,6,7,8,9,10,11,12,13"
                }
            ]
        },
        {
            band: g_wifiBandMode5G,
            name: "5G",
            frequency: [
                {
                    fremode: g_wifiFrequencyMode802a,
                    frename: "802.11a",
                    width: [
                        {
                            value: g_wifiWidth20MHz,
                            name: "20MHz"
                        }
                    ]
                },
                {
                    fremode: g_wifiFrequencyMode802n,
                    frename: "802.11n",
                    width: [
                        {
                            value: g_wifiWidthAuto,
                            name: "Auto"
                        },
                        {
                            value: g_wifiWidth20MHz,
                            name: "20MHz"
                        }
                    ]
                },
                {
                    fremode: g_wifiFrequencyMode802ac,
                    frename: "802.11ac",
                    width: [
                        {
                            value: g_wifiWidth20MHz,
                            name: "20MHz"
                        },
                        {
                            value: g_wifiWidth40MHz,
                            name: "40MHz"
                        },
                        {
                            value: g_wifiWidth80MHz,
                            name: "80MHz"
                        }
                    ]
                }
            ],
            country: [
                {
                    sab: "CN",
                    fullname: common_country_China,
                    channel: "36,40,44,48,52,56,60,64,149,153,157,161,165"
                },
                {
                    sab: "UY",
                    fullname: common_country_Uruguay,
                    channel: "36,40,44,48,52,56,60,64,100,104,108,112,116,120,124,128,132,136,140,144,149,153,157,161,165"
                },
                {
                    sab: "US",
                    fullname: common_country_America,
                    channel: "36,40,44,48,52,56,60,64,100,104,108,112,116,120,124,128,132,136,140,144,149,153,157,161,165"
                },
                {
                    sab: "ZM",
                    fullname: common_country_Zambia,
                    channel: "36,40,44,48,52,56,60,64,100,104,108,112,116,120,124,128,132,136,140,144,149,153,157,161,165"
                },
                {
                    sab: "IQ",
                    fullname: common_country_Iraq,
                    channel: "36,40,44,48,52,56,60,64,100,104,108,112,116,120,124,128,132,136,140,144,149,153,157,161,165"
                },
                {
                    sab: "CM",
                    fullname: common_country_Cameroon,
                    channel: "36,40,44,48,52,56,60,64,100,104,108,112,116,120,124,128,132,136,140,144,149,153,157,161,165"
                },
                {
                    sab: "CI",
                    fullname: common_country_CoteDlvoire,
                    channel: "36,40,44,48,52,56,60,64,100,104,108,112,116,132,136,140,144,149,153,157,161,165"
                },
                {
                    sab: "CA",
                    fullname: common_country_Canada,
                    channel: "36,40,44,48,52,56,60,64,100,104,108,112,116,120,124,128,132,136,140,144,149,153,157,161,165"
                },
                {
                    sab: "BR",
                    fullname: common_country_Brazil,
                    channel: "36,40,44,48,52,56,60,64,100,104,108,112,116,120,124,128,132,136,140,144,149,153,157,161,165"
                },
                {
                    sab: "AR",
                    fullname: common_country_Argentina,
                    channel: "36,40,44,48,52,56,60,64,100,104,108,112,116,120,124,128,132,136,140,144,149,153,157,161,165"
                }
            ]
        }
    ];

    var g_curWifiBand;
    var g_curWifiMode;
    var g_curWifiCountry;
    var g_curWifiWidth;
    var g_curWifiChannel;

    getWlanAdvanceInfo();
    $(document).ready(function(){
        initWifiBand();
        $("#band").on("change", function(){
            var _val = parseInt($(this).val());
            if (_val === g_curWifiBand){
                initWifiMode(g_curWifiMode);
                initWifiCountry(g_curWifiCountry);
                initWifiBandwidth(g_curWifiWidth);
                initWifiChannel(g_curWifiChannel);
            } else {
                initWifiMode();
                initWifiCountry();
                initWifiBandwidth();
                initWifiChannel();
            }
        });

        initWifiMode(g_curWifiMode);
        $("#mode").on("change", function(){
            initWifiBandwidth();
            if (parseInt($("#band").val()) === g_wifiBandMode5G) {
                initWifiChannel();
            }
        });

        initWifiCountry(g_curWifiCountry);
        initWifiBandwidth(g_curWifiWidth);
        initWifiChannel(g_curWifiChannel);
        $("#country").on("change", function(){
            initWifiChannel();
        });

        $("#bandwidth").on("change", function(){
            var band = parseInt($("#band").val());
            if (band === g_wifiBandMode5G) {
                initWifiChannel();
            }
        });
        $("#apply").attr("value", common_apply).on("click", saveWlanAdvanceInfo);
    });

    function initWifiBand(){
        var option = "<option value=\"%d\">%s</option>";
        var _html = "";
        $.each(g_wifiBand, function(){
            _html += option;
            _html = _html.replace("%d", this.band).replace("%s", this.name);
        });
        $("#band").html(_html).val(g_curWifiBand);
    }
    function initWifiMode(val){
        var option = "<option value=\"%d\">%s</option>";
        var frequency, _html;

        frequency = getWifiFrequency();

        _html = "";
        $.each(frequency, function(){
            _html += option;
            _html = _html.replace("%d", this.fremode).replace("%s", this.frename);
        });
        if (typeof val === "undefined") {
            $("#mode").html(_html);
        } else {
            $("#mode").html(_html).val(val);
        }

    }

    function initWifiCountry(val){
        var option = "<option value=\"%d\">%s</option>";
        var country, _html;

        country = getWifiCountry();

        _html = "";
        $.each(country, function(){
            _html += option;
            _html = _html.replace("%d", this.sab).replace("%s", this.fullname);
        });
        if (typeof val === "undefined") {
            $("#country").html(_html);
        } else {
            $("#country").html(_html).val(val);
        }
    }

    function initWifiChannel(val){
        var option = "<option value=\"%d\">%s</option>";
        var index, band, mode, width, country, channel, _html;

        country = getWifiCountry();

        channel = [];
        $.each(country, function(){
            if (this.sab === $("#country").val()) {
                channel = this.channel.split(",");
            }
        });

        band = $("#band").val();
        if (band === g_wifiBandMode5G){
            mode = parseInt($("#mode").val());
            width = parseInt($("#bandwidth").val());
            if ((mode === g_wifiFrequencyMode802n || mode === g_wifiFrequencyMode802ac) &&
                (width === g_wifiWidth40MHz || width === g_wifiWidth80MHz)) {
                index = channel.indexOf("165");
                channel.splice(index, 1);
            }
        }

        _html = "";
        $.each(channel, function(){
            _html += option;
            _html = _html.replace("%d", this).replace("%s", this);
        });
        if (typeof val === "undefined") {
            $("#channel").html(_html);
        } else {
            $("#channel").html(_html).val(val);
        }
    }

    function initWifiBandwidth(val){
        var option = "<option value=\"%d\">%s</option>";
        var frequency, width, _html;

        frequency = getWifiFrequency();

        width = [];
        $.each(frequency, function(){
            if (parseInt($("#mode").val()) === this.fremode) {
                width = this.width;
            }
        });

        _html = "";
        $.each(width, function(){
            _html += option;
            _html = _html.replace("%d", this.value).replace("%s", this.name);
        });
        if (typeof val === "undefined") {
            $("#bandwidth").html(_html);
        } else {
            $("#bandwidth").html(_html).val(val);
        }
    }

    function getWlanAdvanceInfo(){
        getAjaxJsonData("/action/WifiGetAdvanced", function(obj){

            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                g_curWifiBand = obj.freqband;
                g_curWifiMode = obj.mode;
                g_curWifiCountry = obj.countrycode;
                g_curWifiWidth = obj.bandwidth;
                g_curWifiChannel = obj.channel;
            }
        }, {
            async: false
        });
    }
    function saveWlanAdvanceInfo(){
        var data, postdata;
        var obj = {};
        stopLogoutTimer();
        data = $("#advance-info").serializeArray();
        $.each(data, function(key, val){
            obj[val.name] = val.value;
        });
        obj["freqband"] = parseInt(obj["freqband"]);
        obj["mode"] = parseInt(obj["mode"]);
        obj["bandwidth"] = parseInt(obj["bandwidth"]);
        obj["channel"] = parseInt(obj["channel"]);
        postdata = JSON.stringify(obj);
        saveAjaxJsonData("/action/WifiSetAdvanced", postdata, function(data){
            var _obj = data;
            if (typeof _obj.retcode === "number" && _obj.retcode === g_resultSuccess) {
                showResultDialog(common_result, common_success, g_waitingTime);
            } else {
                showResultDialog(common_result, common_failed, g_waitingTime);
            }
        }, {

        });
    }

    function getWifiFrequency(){
        var band, frequency;

        frequency = [];
        band = parseInt($("#band").val());
        $.each(g_wifiBand, function(){
            if (this.band === band) {
                frequency = this.frequency;
            }
        });
        return frequency;
    }

    function getWifiCountry(){
        var band, country;

        country = [];
        band = parseInt($("#band").val());
        $.each(g_wifiBand, function(){
            if (this.band === band) {
                country = this.country;
            }
        });
        return country;
    }
})();