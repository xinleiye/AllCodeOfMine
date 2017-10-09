(function(){
    var g_macAddrList;
    var g_macFilterStatus;
    getMacFilterInfo();
    $(document).ready(function(){
        $("#macfilterlistbox").on("change", function(){
            var val = $("#macfilterlistbox").val();
            if (val === "1" || val === "2" ){
                $("#macaddr").show();
            } else {
                $("#macaddr").hide();
            }
        });
        $("#macfilterlist").on("click", function(ev){
            var data, pos;
            var _ev = ev || event;
            var target = _ev.target || _ev.srcElemnt;
            var _id = target.id;
            var index = $("#macaddrbody").children().length + 1;
            if (_id === "add") {
                data = $("#macfilterlist").serializeArray();
                if (data.length >= 8) {
                    $("#add").attr("disabled", "disabled");
                    return;
                }
                g_macAddrList = [];
                $.each(data, function(key, val){
                    g_macAddrList.push(val.value);
                });
                $("#macaddr").val("");
                updateMacFilterAddrList();
            } else if (_id.indexOf("del") !== -1) {
                pos = _id.substring(3);
                $("#macaddr-row" + pos).remove();
                g_macAddrList = [];
                data = $("#macfilterlist").serializeArray();
                $.each(data, function(key, val){
                    if (val.value.length > 0) {
                        g_macAddrList.push(val.value);
                    }
                });
                $("#macaddr").val("");
                updateMacFilterAddrList();
            } else if (_id === "macaddr") {

            }
        });
        $("#apply").attr("value", common_apply);
        updateMacFilterAddrList();
    });
    function updateMacFilterAddrList(){
        var i, len;
        var index;
        var $rowmac;
        len = $("#macaddrbody").children().length;
        for(i = 1; i <= len; i++){
            $("#macaddr-row" + i).remove();
        }
        len = g_macAddrList.length;
        if (len >8 ) {
            len = 8;
        }
        for(i = len - 1; i >= 0; i--) {
            index = i + 1;
            $rowmac = $("#macaddr-row").clone();
            $rowmac.children().find("#macaddr").val(g_macAddrList[i]).attr("name", "macaddr" + index).attr("id", "macaddr" + index);
            //$rowmac.children().find("#add").parent().remove();
            $rowmac.children().find("#add").attr("id", "del" + index).attr("value", "del").removeAttr("disabled");
            $rowmac.attr("id", "macaddr-row" + index);
            $("#macaddrbody").prepend($rowmac);
        }
        $("#add").attr("disabled", "disabled");
        $("#macaddr").on("blur", function(){
            var mac = $("#macaddr").val();
            if (mac.length > 0) {
                $("#add").removeAttr("disabled");
            }
        });
    }
    function getMacFilterInfo(){
        getAjaxJsonData("/action/WifiGetMacFilter", function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                g_macFilterStatus = obj.mode;
                g_macAddrList = obj.macaddrList;
            }
        }, {
            async: false
        });
    }
})();